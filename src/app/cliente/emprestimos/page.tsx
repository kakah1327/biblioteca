"use client";

import React, { useEffect, useState } from "react";
import { emprestimoApi } from "../../api/emprestimoApi"; // Importando a API de empréstimos
import { useAuth } from "../../context/authContext"; // Para pegar o username do contexto de autenticação
import { Emprestimos } from "../../interface/emprestimos";
import { toast, ToastContainer } from "react-toastify"; // Importando o Toastify
import "react-toastify/dist/ReactToastify.css"; // Estilos do Toastify

const EmprestimoPage: React.FC = () => {
  const { user } = useAuth(); // Pega o usuário autenticado
  const [emprestimos, setEmprestimos] = useState<Emprestimos[]>([]); // Armazena os empréstimos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para a paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const emprestimosPorPagina = 6; // Definindo 5 itens por página

  useEffect(() => {
    if (user?.username) {
      carregarEmprestimos(user.username);
    } else {
      setError("Usuário não autenticado. Por favor, faça login.");
    }
  }, [user]);

  const carregarEmprestimos = async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const emprestimosDoUsuario = await emprestimoApi.listarEmprestimosPorUsername(username);
      // Ordenando os empréstimos: ativos primeiro, depois os finalizados, mantendo a ordem por data dentro de cada grupo
      const emprestimosOrdenados = emprestimosDoUsuario.sort((a, b) => {
        if (a.emprestimoAtivo !== b.emprestimoAtivo) {
          return a.emprestimoAtivo ? -1 : 1; // Ativos vêm antes dos inativos
        }
        return new Date(b.dataEmprestimo).getTime() - new Date(a.dataEmprestimo).getTime(); // Ordena por data
      });
      setEmprestimos(emprestimosOrdenados);
    } catch (err) {
      console.error("Erro ao carregar empréstimos:", err);
    } finally {
      setLoading(false);
    }
  };

  const devolverEmprestimo = async (id: number) => {
    try {
      const mensagem = await emprestimoApi.devolverEmprestimo(id);
      toast.success(mensagem); // Exibe o toast de sucesso
      carregarEmprestimos(user?.username!); // Recarrega os empréstimos após a devolução
    } catch (err) {
      console.error("Erro ao devolver empréstimo:", err);
      toast.error("Erro ao devolver o empréstimo. Tente novamente."); // Exibe o toast de erro
    }
  };

  const getStatus = (emprestimo: Emprestimos) => {
    if (!emprestimo.emprestimoAtivo) {
      return "Empréstimo Finalizado";
    }

    if (emprestimo.atrasado) {
      return "Empréstimo Atrasado";
    }

    return "Empréstimo Ativo";
  };

  // Calculando os índices da página atual
  const indiceInicial = (paginaAtual - 1) * emprestimosPorPagina;
  const indiceFinal = indiceInicial + emprestimosPorPagina;
  const emprestimosPaginados = emprestimos.slice(indiceInicial, indiceFinal);

  const totalPaginas = Math.ceil(emprestimos.length / emprestimosPorPagina);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-200 rounded-lg shadow-md">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeButton
        draggable
        pauseOnHover
      />


<div className="flex justify-end">
                <button
                onClick={() => window.location.href = '/cliente'}
                className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600">Voltar</button>
              </div>
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Meus Empréstimos</h1>

      {loading && <p className="text-center text-black">Carregando seus empréstimos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {emprestimos.length === 0 ? (
        <p className="text-center text-gray-400">Você não possui empréstimos no momento.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-black">
            <thead>
              <tr>
                <th className="border-b py-2 px-4">Livro</th>
                <th className="border-b py-2 px-4">Autor</th>
                <th className="border-b py-2 px-4">ISBN</th>
                <th className="border-b py-2 px-4">Tipo de Empréstimo</th>
                <th className="border-b py-2 px-4">Data de Empréstimo</th>
                <th className="border-b py-2 px-4">Devolução Prevista</th>
                <th className="border-b py-2 px-4">Status</th>
                <th className="border-b py-2 px-4">Ação</th>
              </tr>
            </thead>
            <tbody>
              {emprestimosPaginados.map((emprestimo) => (
                <tr key={emprestimo.id} className="border-b border-gray-700">
                  <td className="py-2 px-4">{emprestimo.livro.titulo}</td>
                  <td className="py-2 px-4">{emprestimo.livro.autor}</td>
                  <td className="py-2 px-4">{emprestimo.livro.isbn}</td>
                  <td className="py-2 px-4">
                    {emprestimo.emprestimoFisico
                      ? "Físico"
                      : emprestimo.emprestimoDigital
                      ? "Digital"
                      : "Desconhecido"}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(emprestimo.dataEmprestimo).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(emprestimo.dataDevolucaoPrevista).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{getStatus(emprestimo)}</td>
                  <td className="py-2 px-4">
                    {emprestimo.emprestimoAtivo && (
                      <button
                        onClick={() => devolverEmprestimo(emprestimo.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Devolver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginação */}
      {emprestimos.length > emprestimosPorPagina && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaAtual === 1}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-black">
            {paginaAtual} de {totalPaginas}
          </span>
          <button
            onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={paginaAtual === totalPaginas}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default EmprestimoPage;
