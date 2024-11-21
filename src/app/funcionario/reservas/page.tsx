'use client';

import React, { useEffect, useState } from 'react';
import { reservaApi } from '../../api/reservaApi'; // Importe sua API de reservas
import { Reservas } from '../../interface/reservas';



const ListaReservas: React.FC = () => {
  const [reservas, setReservas] = useState<Reservas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const reservasData = await reservaApi.listarTodasReservas();
        setReservas(reservasData);
      } catch (err: any) {
        console.error('Erro ao carregar reservas:', err);
        setError('Erro ao carregar reservas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const handleTransformarEmEmprestimo = async (reservaId: number) => {
    try {
      const mensagem = await reservaApi.transformarReservaEmEmprestimo(reservaId);
      alert(mensagem);

      // Remove a reserva transformada da lista
      setReservas((prev) => prev.filter((reserva) => reserva.id !== reservaId));
    } catch (err: any) {
      console.error('Erro ao transformar reserva em empréstimo:', err);
      alert(`Erro ao transformar reserva em empréstimo: ${err.message || 'Erro desconhecido'}`);
    }
  };

  if (loading) return <p>Carregando reservas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">Lista de Reservas</h1>
      {reservas.length === 0 ? (
        <p className="text-center text-gray-400">Nenhuma reserva encontrada.</p>
      ) : (
        <table className="w-full text-left border-collapse text-white">
          <thead>
            <tr>
              <th className="border-b py-2 px-4">Livro</th>
              <th className="border-b py-2 px-4">Usuário</th>
              <th className="border-b py-2 px-4">Data da Reserva</th>
              <th className="border-b py-2 px-4">Data de Expiração</th>
              <th className="border-b py-2 px-4">Ações</th>
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
                    onClick={() => handleTransformarEmEmprestimo(reserva.id)}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
                  >
                    Transformar em Empréstimo
                  </button>
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
