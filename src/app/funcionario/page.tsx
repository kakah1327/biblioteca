'use client';

import { useEffect, useState } from "react";
import { livroApi } from "./../api/livroApi"; // Caminho para a API
import Link from "next/link"; // Componente Link para navegação
import { Livros } from "./interface/livros"; // Interface para os livros

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

    // Filtra os livros pelo status, se necessário
    if (statusFilter) {
      filtrados = filtrados.filter((livro) => livro.status === statusFilter);
    }

    // Filtra os livros pelo termo de pesquisa (Título, Autor ou Categoria)
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

  // Chama a função de filtragem toda vez que o query ou o statusFilter mudarem
  useEffect(() => {
    filtrarLivros();
  }, [query, statusFilter]);

  // Função para alterar a página
  const mudarPagina = (numeroPagina: number) => {
    setPaginaAtual(numeroPagina);
  };

  // Calcular o intervalo de livros para a página atual
  const livrosPaginados = livrosFiltrados.slice(
    (paginaAtual - 1) * livrosPorPagina,
    paginaAtual * livrosPorPagina
  );

  // Calcular o número total de páginas
  const totalPaginas = Math.ceil(livrosFiltrados.length / livrosPorPagina);

  return (
    <div className="py-1">
      <h1 className="text-4xl font-bold text-center mb-6">Catálogo de Livros</h1>

      {/* Barra de Pesquisa */}
      <div className="flex justify-center items-center mb-6 px-4 text-black">
        <input
          type="text"
          placeholder="Digite sua busca por título, autor ou categoria..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Atualiza o estado de busca
          className="border p-2 w-1/2 focus:outline-none rounded-lg"
        />
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
              className="border flex flex-col items-center rounded-lg shadow-md p-4 hover:shadow-lg transition"
            >
              {/* Container da imagem */}
              <div className="w-40 h-60">
                <img
                  src={livro.capa || "/path/to/default/image.jpg"} // Fallback para uma imagem padrão
                  alt={`Capa do livro ${livro.titulo}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <h2 className="text-xl font-bold mt-4 text-center">{livro.titulo}</h2>
              <p className="text-gray-500 text-center">Autor: {livro.autor}</p>

              {/* Botão alinhado */}
              <div className="flex justify-center mt-4 w-full">
                <Link href={`/funcionario/livros/${livro.isbn}`}>
                  <button
                    className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-700 transition"
                  >
                    Ver Detalhes
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => mudarPagina(paginaAtual - 1)}
          disabled={paginaAtual === 1}
          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2 text-white">{paginaAtual} de {totalPaginas}</span>
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
