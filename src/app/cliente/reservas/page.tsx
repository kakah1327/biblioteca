"use client";

import React, { useEffect, useState } from "react";
import { reservaApi } from "../../api/reservaApi"; // Certifique-se de ajustar o caminho
import { useAuth } from "../../context/authContext"; // Para pegar o username do contexto de autenticação
import { Reservas } from "../../interface/reservas";

const ReservasUsuario: React.FC = () => {
  const { user } = useAuth(); // Pega o usuário autenticado
  const [reservas, setReservas] = useState<Reservas[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err: any) {
      console.error("Erro ao carregar reservas:", err);
      setError("Não foi possível carregar suas reservas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const transformarReservaEmEmprestimo = async (reservaId: number) => {
    console.log("Chamando API para transformar reserva em empréstimo com ID:", reservaId);
    try {
      const resposta = await reservaApi.transformarReservaEmEmprestimo(reservaId);
      console.log("Resposta da API:", resposta);
      if (resposta.includes("transformada em empréstimo")) {
        alert(resposta);
      } else {
        throw new Error("Falha ao transformar reserva em empréstimo");
      }
    } catch (error) {
      console.error("Erro capturado:", error);
      alert(`Erro ao transformar reserva em empréstimo: ${error.message || "Erro desconhecido"}`);
    }
  };

  if (loading) {
    return <p className="text-center text-lg">Carregando suas reservas...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Minhas Reservas</h1>
      {reservas.length === 0 ? (
        <p className="text-center text-gray-500">Você não possui reservas no momento.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Livro</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Autor</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">ISBN</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Data da Reserva</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Data de Expiração</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Ação</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 text-sm text-black">{reserva.livro.titulo}</td>
                  <td className="py-3 px-6 text-sm text-black">{reserva.livro.autor}</td>
                  <td className="py-3 px-6 text-sm text-black">{reserva.livro.isbn}</td>
                  <td className="py-3 px-6 text-sm text-black">{new Date(reserva.dataReserva).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-sm text-black">{new Date(reserva.dataExpiracao).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-sm text-black">
                    <button
                      onClick={() => transformarReservaEmEmprestimo(reserva.id)} // Passando o id da reserva
                      className="bg-slate-500 text-white py-2 px-3 rounded hover:bg-slate-600 transition"
                    >
                      Transformar em Empréstimo
                    </button>
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

export default ReservasUsuario;
