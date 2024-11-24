"use client";

import { useState, useEffect } from "react";
import { livroApi } from "../api/livroApi"; // Caminho para a API
import { Livros } from "../interface/livros";
import Link from "next/link"; // Componente Link para navegação
import { useAuth } from "../context/authContext"; // Importando o hook para usar o contexto de autenticação
import Pesquisa from "../components/common/barra"; // Importa o componente Pesquisa estilizado

export default function ClienteLivros() {
  const { user } = useAuth(); // Recupera os dados do usuário do contexto
  const [livros, setLivros] = useState<Livros[]>([]);
  const [livrosFiltrados, setLivrosFiltrados] = useState<Livros[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(""); // Estado para o valor de busca
  const [filter, setFilter] = useState("titulo"); // Estado para o tipo de filtro (título, categoria, autor)
  const [paginaAtual, setPaginaAtual] = useState(1); // Página atual
  const livrosPorPagina = 12; // Número de livros por página



  // Função para buscar livros com base no filtro e na busca
  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      let livrosData: Livros[] = [];

      if (query.trim() === "") {
        // Se a busca estiver vazia, exibe todos os livros
        livrosData = await livroApi.listarTodosLivros();
      } else {
        // Realiza a busca de acordo com o filtro selecionado
        switch (filter) {
          case "titulo":
            livrosData = await livroApi.buscarLivrosPorTitulo(query);
            break;
          case "autor":
            livrosData = await livroApi.buscarLivrosPorAutor(query);
            break;
          case "categoria":
            livrosData = await livroApi.buscarLivrosPorCategoria(query);
            break;
          default:
            livrosData = await livroApi.listarTodosLivros();
            break;
        }
      }

      setLivros(livrosData);
      setLivrosFiltrados(livrosData); // Atualiza os livros filtrados
    } catch (err: any) {
      setError("Erro ao buscar os livros. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  

  // Carregar todos os livros inicialmente
  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const livrosData = await livroApi.listarTodosLivros();
        setLivros(livrosData);
        setLivrosFiltrados(livrosData); // Inicializa com todos os livros
      } catch (err: any) {
        setError("Erro ao carregar os livros. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLivros();
  }, []);

  // Chama a função de pesquisa sempre que query ou filter mudar
  useEffect(() => {
    handleSearch();
  }, [query, filter]);

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

  // Verificando se o usuário está autenticado
  if (!user) {
    return <p className="text-center">Carregando dados do usuário...</p>;
  }

  return (
    <div className="py-1 ">
      <h1 className="text-4xl font-bold text-center mb-16 text-black">Catálogo de Livros</h1>

      {/* Renderiza a barra de pesquisa somente se o modal não estiver aberto */}
          {/* Renderiza a barra de pesquisa somente se o modal não estiver aberto */}
    {!isEditModalOpen ? (
      <div className="flex justify-center items-center mb-10 px-4 text-black mt-15">
        <Pesquisa query={query} setQuery={setQuery} isEditModalOpen={isEditModalOpen} />
      </div>
    ) : (
      <p>Modal aberto, barra de pesquisa desabilitada</p> // Simples para testar se o estado está sendo detectado corretamente
    )}
      {/* Lista de livros */}
      {!loading && !error && livrosPaginados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 px-4 ">
          {livrosPaginados.map((livro) => (
            <Link
              key={livro.isbn}
              href={`/cliente/livros/${livro.isbn}`} // Navega para a página do livro
              className="border flex flex-col items-center rounded-lg shadow-md p-4 hover:shadow-lg transition bg-gray-200 text-gray-700"
            >
              <div className="w-40 h-60">
                <img
                  src={livro.capa || "/path/to/default/image.jpg"}
                  alt={`Capa do livro ${livro.titulo}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <h2 className="text-xl font-bold mt-4 text-center">
                {livro.titulo}
              </h2>
              <p className="text-gray-500 text-center">Autor: {livro.autor}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Carregando */}
      {loading && <p className="text-center">Carregando livros...</p>}

      {/* Erro */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Paginação */}
      <div className="flex justify-center mt-6">
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
