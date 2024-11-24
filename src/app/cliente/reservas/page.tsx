"use client";

import React, { useEffect, useState } from "react";
import { reservaApi } from "../../api/reservaApi"; // Certifique-se de ajustar o caminho
import { useAuth } from "../../context/authContext"; // Para pegar o username do contexto de autenticação
import { Reservas } from "../../interface/reservas";
import { toast } from "react-toastify";
import BotaoDelete from "../../components/common/botaoDelete"; // Importe o BotaoDelete

const ReservasUsuario: React.FC = () => {
  const { user } = useAuth(); // Pega o usuário autenticado
  const [reservas, setReservas] = useState<Reservas[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReservas = reservas.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(reservas.length / itemsPerPage);

  useEffect(() => {
    if (user?.username) {
      carregarReservas(user.username);
    } else {
      setError("Usuário não autenticado. Por favor, faça login.");
    }
  }, [user]);

  const carregarReservas = async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const reservasDoUsuario = await reservaApi.listarReservasPorUsername(username);
      setReservas(reservasDoUsuario);
      toast.success("Reservas carregadas com sucesso!"); // Toast de sucesso
    } catch (err: any) {
      console.error("Erro ao carregar reservas:", err);
      toast.error("Erro ao carregar as reservas. Tente novamente."); // Toast de erro
    } finally {
      setLoading(false);
    }
  };

  const transformarReservaEmEmprestimo = async (reservaId: number) => {
    try {
      const resposta = await reservaApi.transformarReservaEmEmprestimo(reservaId);
      toast.success(resposta); // Toast de sucesso com a mensagem da API

      // Atualiza a lista de reservas removendo a transformada
      setReservas((prev) => prev.filter((reserva) => reserva.id !== reservaId));
    } catch (error: any) {
      console.error("Erro ao transformar reserva em empréstimo:", error);
      toast.error(`Erro ao transformar reserva em empréstimo: ${error.message || "Erro desconhecido"}`); // Toast de erro
    }
  };

  const deletarReserva = async (reservaId: number) => {
    try {
      await reservaApi.deletarReserva(reservaId);
      toast.success("Reserva excluída com sucesso!"); // Toast de sucesso

      // Remove a reserva excluída da lista
      setReservas((prev) => prev.filter((reserva) => reserva.id !== reservaId));
    } catch (error: any) {
      console.error("Erro ao excluir reserva:", error);
      toast.error("Erro ao excluir a reserva. Tente novamente."); // Toast de erro
    }
  };

  if (loading) {
    return <p className="text-center text-lg">Carregando suas reservas...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-200 rounded-lg shadow-md">
      <div className="flex justify-end">
        <button
          onClick={() => window.location.href = '/cliente'}
          className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
        >
          Voltar
        </button>
      </div>
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Minhas Reservas</h1>

      {reservas.length === 0 ? (
        <p className="text-center text-black">Você não possui reservas no momento.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-black">
            <thead>
              <tr>
                <th className="border-b py-2 px-4">Livro</th>
                <th className="border-b py-2 px-4">Autor</th>
                <th className="border-b py-2 px-4">ISBN</th>
                <th className="border-b py-2 px-4">Data da Reserva</th>
                <th className="border-b py-2 px-4">Data de Expiração</th>
                <th className="border-b py-2 px-4">Ação</th>
                <th className="border-b py-2 px-4">Deletar Reserva</th>
              </tr>
            </thead>
            <tbody>
              {currentReservas.map((reserva) => (
                <tr key={reserva.id} className="border-b border-gray-700">
                  <td className="py-2 px-4">
                    <strong>{reserva.livro.titulo}</strong>
                    <br />
                    <small>{reserva.livro.autor}</small>
                  </td>
                  <td className="py-2 px-4">{reserva.livro.autor}</td>
                  <td className="py-2 px-4">{reserva.livro.isbn}</td>
                  <td className="py-2 px-4">{new Date(reserva.dataReserva).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{new Date(reserva.dataExpiracao).toLocaleDateString()}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => transformarReservaEmEmprestimo(reserva.id)}
                      className="px-4 py-2 bg-gray-400 text-black rounded-lg hover:bg-slate-700 transition"
                    >
                      Transformar em Empréstimo
                    </button>
                  </td>
                  <td className="py-2 px-4">
                    <BotaoDelete onClick={() => deletarReserva(reserva.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginação */}
          <div className="flex justify-center items-center mt-4 text-white space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === 1
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-slate-600 hover:bg-slate-700"
              }`}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className="px-4 py-2 bg-gray-700 rounded-lg">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === totalPages
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-slate-600 hover:bg-slate-700"
              }`}
              disabled={currentPage === totalPages}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservasUsuario;

