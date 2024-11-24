'use client';

import React, { useEffect, useState } from 'react';
import { reservaApi } from '../../api/reservaApi'; // Importe sua API de reservas
import { Reservas } from '../../interface/reservas';
import { toast } from "react-toastify";
import BotaoDelete from "../../components/common/botaoDelete"; // Importe o BotaoDelete

const ListaReservas: React.FC = () => {
  const [reservas, setReservas] = useState<Reservas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado para mensagem de sucesso

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const reservasData = await reservaApi.listarTodasReservas();
        setReservas(reservasData);
        setError(null);
      } catch (err: any) {
        console.error('Erro ao carregar reservas:', err);
        setError('Erro ao carregar reservas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const handleReservaAction = async (reservaId: number, action: 'transformar' | 'excluir') => {
    try {
      let mensagem = '';
      if (action === 'transformar') {
        mensagem = await reservaApi.transformarReservaEmEmprestimo(reservaId);
      } else if (action === 'excluir') {
        mensagem = await reservaApi.deletarReserva(reservaId);
      }

      // Atualiza a mensagem de sucesso
      setSuccessMessage(mensagem);
      setReservas((prev) => prev.filter((reserva) => reserva.id !== reservaId));

      // Exibe toast de sucesso
      toast.success(mensagem);

    } catch (err: any) {
      console.error('Erro ao realizar ação na reserva:', err);
      setError(`Erro ao realizar a ação na reserva: ${err.message || 'Erro desconhecido'}`);
      toast.error('Erro ao processar a reserva');
    }
  };

  if (loading) return <p>Carregando reservas...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-200 rounded-lg shadow-md">
      <div className="flex justify-end">
        <button
          onClick={() => window.location.href = '/funcionario'}
          className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600">Voltar</button>
      </div>
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Lista de Reservas</h1>

      {/* Exibe a mensagem de sucesso ou erro */}
      {successMessage && (
        <div className="bg-green-500 text-white p-3 rounded-md mb-4">
          {successMessage}
        </div>
      )}

      {error && reservas.length === 0 ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <table className="w-full text-left border-collapse text-black">
          <thead>
            <tr>
              <th className="border-b py-2 px-4">Livro</th>
              <th className="border-b py-2 px-4">Usuário</th>
              <th className="border-b py-2 px-4">Data da Reserva</th>
              <th className="border-b py-2 px-4">Data de Expiração</th>
              <th className="border-b py-2 px-4">Ações</th>
              <th className="border-b py-2 px-4">Excluir Reserva</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id} className="border-b border-gray-700">
                <td className="py-2 px-4">
                  <strong>{reserva.livro.titulo}</strong>
                  <br />
                  <small>{reserva.livro.autor}</small>
                </td>
                <td className="py-2 px-4">
                  <strong>{reserva.usuario.nome}</strong>
                  <br />
                  <small>@{reserva.usuario.username}</small>
                </td>
                <td className="py-2 px-4">{new Date(reserva.dataReserva).toLocaleDateString()}</td>
                <td className="py-2 px-4">{new Date(reserva.dataExpiracao).toLocaleDateString()}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleReservaAction(reserva.id, 'transformar')}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
                  >
                    Transformar em Empréstimo
                  </button>
                </td>
                <td className="py-2 px-4">
                  <BotaoDelete onClick={() => handleReservaAction(reserva.id, 'excluir')} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaReservas;
