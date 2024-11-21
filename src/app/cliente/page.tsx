"use client";

import { useEffect, useState } from "react";
import { livroApi } from "../api/livroApi"; // Caminho para a API
import Link from "next/link"; // Componente Link para navegação
import { Livros } from "../interface/livros";
import { useAuth } from "../context/authContext"; // Importando o hook para usar o contexto de autenticação

export default function ClienteLivros() {
  const { user } = useAuth(); // Recupera os dados do usuário do contexto
  const [livros, setLivros] = useState<Livros[]>([]);
  const [livrosFiltrados, setLivrosFiltrados] = useState<Livros[]>([]); // Estado para armazenar livros filtrados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(""); // Estado para o valor de busca
  const [filter, setFilter] = useState("titulo"); // Estado para o tipo de filtro (título, categoria, autor)

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1); // Página atual
  const [livrosPorPagina, setLivrosPorPagina] = useState(12); // Número de livros por página

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
    <div className="py-1">
      {/* Saudação personalizada com o nome do usuário */}
      <h1 className="text-4xl font-bold text-center mb-6">
        Bem-vindo, {user.username}
      </h1>
      <h1 className="text-4xl font-bold text-center mb-6">Catálogo de Livros</h1>

      {/* Barra de Pesquisa */}
      <div className="flex justify-center items-center mb-6 px-4 text-black">
        <input
          type="text"
          placeholder="Digite sua busca..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Atualiza a query de busca
          className="border p-2 w-1/2 focus:outline-none rounded-lg"
        />
      </div>

      {/* Mensagem caso não existam livros */}
      {!loading && !error && livrosPaginados.length === 0 && (
        <p className="text-center text-gray-500">
          Nenhum livro disponível no momento.
        </p>
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
              <h2 className="text-xl font-bold mt-4 text-center">
                {livro.titulo}
              </h2>
              <p className="text-gray-500 text-center">Autor: {livro.autor}</p>
              
              {/* Botão alinhado */}
              <div className="flex justify-center mt-4 w-full">
                <Link href={`/cliente/livros/${livro.isbn}`}>
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
