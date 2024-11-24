'use client';

import { useEffect, useState } from "react";
import { livroApi } from "./api/livroApi"; // Caminho para a API
import Link from "next/link"; // Componente Link para navegação
import { Livros } from "./interface/livros"; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pesquisa from "./components/common/barra"; // Importa o componente Pesquisa estilizado

export default function FuncionarioLivros() {
  const [livros, setLivros] = useState<Livros[]>([]);
  const [livrosFiltrados, setLivrosFiltrados] = useState<Livros[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [livrosPorPagina, setLivrosPorPagina] = useState(12);

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
        const livrosData = await livroApi.listarTodosLivros();
        setLivros(livrosData);
        setLivrosFiltrados(livrosData);
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
    <div className="py-10">
      <h1 className="text-black text-4xl font-serif text-center mb-16">Catálogo de Livros</h1>

      {/* Barra de Pesquisa */}
      <div className="flex justify-center items-center mb-6 px-4 text-black mt-10">
        <Pesquisa query={query} setQuery={setQuery} />
      </div>

      {/* Mensagem de erro */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Carregando livros */}
      {loading && <p className="text-center">Carregando livros...</p>}

      {/* Mensagem caso não existam livros */}
      {!loading && !error && livrosPaginados.length === 0 && (
        <p className="text-center text-gray-500">Nenhum livro encontrado para a busca.</p>
      )}

      {/* Lista de livros */}
      {!loading && !error && livrosPaginados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 px-4">
          {livrosPaginados.map((livro) => (
            <div
              key={livro.isbn}
              className="bg-gray-200 text-gray-700 border flex flex-col items-center rounded-lg shadow-md p-4 hover:shadow-lg transition"
            >
              {/* Container da imagem */}
              <div className="w-40 h-60">
                <img
                  src={livro.capa || "/path/to/default/image.jpg"}
                  alt={`Capa do livro ${livro.titulo}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <h2 className="text-xl font-bold mt-4 text-center">{livro.titulo}</h2>
              <p className="text-gray-500 text-center">Autor: {livro.autor}</p>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      <div className="flex justify-center mt-6 ">
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
          className="px-4 py-2 bg-slate-600  rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
