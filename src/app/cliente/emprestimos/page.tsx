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
      setEmprestimos(emprestimosDoUsuario);
    } catch (err) {
      console.error("Erro ao carregar empréstimos:", err);
      setError("Não foi possível carregar seus empréstimos. Tente novamente mais tarde.");
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

  if (loading) {
    return <p className="text-center text-lg">Carregando seus empréstimos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w 9xl mx-auto mt-10 px-4">
      {/* Adicionando o ToastContainer que vai renderizar os toasts na página */}
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={true} 
        newestOnTop={true} 
        closeButton={true}
        draggable 
        pauseOnHover
      />

      <h1 className="text-4xl font-bold text-center mb-8">Meus Empréstimos</h1>
      {emprestimos.length === 0 ? (
        <p className="text-center text-gray-500">Você não possui empréstimos no momento.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Livro</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Autor</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">ISBN</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Tipo de Empréstimo</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Data de Empréstimo</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Devolução Prevista</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Ação</th>
              </tr>
            </thead>
            <tbody>
              {emprestimos.map((emprestimo) => (
                <tr key={emprestimo.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 text-sm text-black">{emprestimo.livro.titulo}</td>
                  <td className="py-3 px-6 text-sm text-black">{emprestimo.livro.autor}</td>
                  <td className="py-3 px-6 text-sm text-black">{emprestimo.livro.isbn}</td>
                  <td className="py-3 px-6 text-sm text-black">
                    {emprestimo.emprestimoFisico
                      ? "Físico"
                      : emprestimo.emprestimoDigital
                      ? "Digital"
                      : "Desconhecido"}
                  </td>
                  <td className="py-3 px-6 text-sm text-black">{new Date(emprestimo.dataEmprestimo).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-sm text-black">{new Date(emprestimo.dataDevolucaoPrevista).toLocaleDateString()}</td>
                  <td className="py-3 px-5 text-sm text-black">{getStatus(emprestimo)}</td>
                  <td className="py-3 px-6 text-sm text-black">
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
    </div>
  );
};

export default EmprestimoPage;
