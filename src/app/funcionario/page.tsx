'use client';

import { useEffect, useState } from "react";
import { livroApi } from "./../api/livroApi"; // Caminho para a API
import Link from "next/link"; // Componente Link para navegação
import { Livros } from "./interface/livros"; // Interface para os livros
import Pesquisa from "../components/common/barra"; // Importa o componente Pesquisa estilizado


export default function FuncionarioLivros() {
  const [livros, setLivros] = useState<Livros[]>([]); // Lista de todos os livros
  const [livrosFiltrados, setLivrosFiltrados] = useState<Livros[]>([]); // Lista de livros após filtragem
  const [query, setQuery] = useState(""); // Valor da pesquisa
  const [statusFilter, setStatusFilter] = useState(""); // Filtro de status (ex: "Disponível", "Emprestado")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1); // Página atual
  const [livrosPorPagina] = useState(12); // Número de livros por página (ajustável)

  // Função para filtrar os livros com base na pesquisa e no filtro de status
  const filtrarLivros = () => {
    let filtrados = livros;

    if (statusFilter) {
      filtrados = filtrados.filter((livro) => livro.status === statusFilter);
    }

    if (query.trim()) {
      const queryLower = query.toLowerCase();
      filtrados = filtrados.filter(
        (livro) =>
          livro.titulo.toLowerCase().includes(queryLower) ||
          livro.autor.toLowerCase().includes(queryLower) ||
          livro.categoria.toLowerCase().includes(queryLower)
      );
    }

    setLivrosFiltrados(filtrados);
  };

  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const livrosData = await livroApi.listarTodosLivros(); // Obtém a lista de livros
        setLivros(livrosData);
        setLivrosFiltrados(livrosData); // Inicializa os livros filtrados com todos os livros
      } catch (err: any) {
        setError("Erro ao carregar os livros. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLivros();
  }, []);

  useEffect(() => {
    filtrarLivros();
  }, [query, statusFilter]);

  const mudarPagina = (numeroPagina: number) => {
    setPaginaAtual(numeroPagina);
  };

  const livrosPaginados = livrosFiltrados.slice(
    (paginaAtual - 1) * livrosPorPagina,
    paginaAtual * livrosPorPagina
  );

  const totalPaginas = Math.ceil(livrosFiltrados.length / livrosPorPagina);

  return (
    <div className="py-1 text-black">
      <h1 className="text-4xl font-bold text-center mb-6">Catálogo de Livros</h1>

      <div className="flex justify-center items-center mb-10 px-4 text-black mt-15">
        <Pesquisa query={query} setQuery={setQuery} />
      </div>

      {error && <p className="text-center text-red-500">{error}</p>}

      {loading && <p className="text-center">Carregando livros...</p>}

      {!loading && !error && livrosPaginados.length === 0 && (
        <p className="text-center text-gray-500">Nenhum livro encontrado para a busca.</p>
      )}

      {!loading && !error && livrosPaginados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 px-4">
          {livrosPaginados.map((livro) => (
            <Link
              key={livro.isbn}
              href={`/funcionario/livros/${livro.isbn}`}
              className="bg-gray-200 text-gray-700 border flex flex-col items-center rounded-lg shadow-md p-4 hover:shadow-lg transition"
            >
              <div className="w-40 h-60">
                <img
                  src={livro.capa || "/path/to/default/image.jpg"}
                  alt={`Capa do livro ${livro.titulo}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <h2 className="text-xl font-bold mt-4 text-center">{livro.titulo}</h2>
              <p className="text-gray-500 text-center">Autor: {livro.autor}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6 text-black">
        <button
          onClick={() => mudarPagina(paginaAtual - 1)}
          disabled={paginaAtual === 1}
          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2 text-black">{paginaAtual} de {totalPaginas}</span>
        <button
          onClick={() => mudarPagina(paginaAtual + 1)}
          disabled={paginaAtual === totalPaginas}
          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
