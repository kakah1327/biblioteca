'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { livroApi } from '../../../api/livroApi';
import { reservaApi } from '../../../api/reservaApi';
import { emprestimoApi } from '../../../api/emprestimoApi';
import { useAuth } from '../../../context/authContext';
import { toast, ToastContainer } from 'react-toastify'; // Certifique-se de importar o ToastContainer

const LivroPage: React.FC = () => {
  const [livro, setLivro] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isbn } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (isbn) {
      const fetchLivro = async () => {
        try {
          const livroData = await livroApi.buscarLivroPorISBN(isbn as string);
          setLivro(livroData);
        } catch (err) {
          console.error('Erro ao carregar o livro:', err);
          toast.error('Erro ao carregar o livro. Tente novamente.');
          setError('Erro ao carregar o livro.');
        } finally {
          setLoading(false);
        }
      };

      fetchLivro();
    }
  }, [isbn]);

  const handleReservar = async () => {
    if (!livro || !user?.username) {
      toast.error('Erro: Não foi possível realizar a reserva. Verifique se você está autenticado.');
      return;
    }

    try {
      const reservaMessage = await reservaApi.realizarReserva(livro.isbn, user.username);
      toast.success(reservaMessage);
      router.push('/cliente/reservas');
    } catch (err) {
      console.error('Erro ao realizar reserva:', err);
      toast.error('Erro ao realizar a reserva. Tente novamente.');
    }
  };

  const handleEmprestarFisico = async () => {
    if (!livro || !user?.username) {
      toast.error('Erro: Não foi possível realizar o empréstimo. Verifique se você está autenticado.');
      return;
    }

    try {
      const emprestimoMessage = await emprestimoApi.realizarEmprestimoFisico(livro.isbn, user.username);
      toast.success(emprestimoMessage);
      router.push('/cliente/emprestimos');
    } catch (err: any) {
      console.error('Erro ao realizar empréstimo físico:', err);

      if (err?.response?.data?.message === 'Usuário já possui um empréstimo em aberto para este livro.') {
        toast.error('Você já possui um empréstimo em aberto para este livro.');
      } else {
        toast.error('Você já possui um empréstimo em aberto para este livro.');
      }
    }
  };

  const handleEmprestarDigital = async () => {
    if (!livro || !user?.username) {
      toast.error('Erro: Não foi possível realizar o empréstimo. Verifique se você está autenticado.');
      return;
    }

    if (livro.quantidadeLicencas <= 0) {
      toast.error('Não há licenças disponíveis para o empréstimo deste livro digital.');
      return;
    }

    try {
      const emprestimoMessage = await emprestimoApi.realizarEmprestimoDigital(livro.isbn, user.username);
      toast.success(emprestimoMessage);
      router.push('/cliente/emprestimos');
    } catch (err: any) {
      console.error('Erro ao realizar empréstimo digital:', err);

      if (err?.response?.data?.message === 'Usuário já possui um empréstimo em aberto para este livro.') {
        toast.error('Você já possui um empréstimo em aberto para este livro.');
      } else {
        toast.error('Você já possui um empréstimo em aberto para este livro.');
      }
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto bg-gray-200 p-6 rounded-lg shadow-md">
      {livro ? (
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-full md:w-1/5">
            <img
              src={livro.capa}
              alt={`Capa do livro ${livro.titulo}`}
              className="rounded-lg shadow-md object-cover w-full"
              style={{ aspectRatio: '2/3' }}
            />
          </div>
          <div className="flex-1 text-black">
            <h1 className="text-3xl font-bold mb-4">{livro.titulo}</h1>
            <p><strong>Descrição:</strong> {livro.descricao}</p>
            <p><strong>Autor:</strong> {livro.autor}</p>
            <p><strong>Categoria:</strong> {livro.categoria}</p>
            <p><strong>Quantidade em Estoque:</strong> {livro.quantidadeEstoque}</p>
            <p><strong>Quantidade de Licenças:</strong> {livro.quantidadeLicencas}</p>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleReservar}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
              >
                Reservar
              </button>
              <button
                onClick={handleEmprestarFisico}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
              >
                Emprestar livro físico
              </button>
              <button
                onClick={handleEmprestarDigital}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
              >
                Emprestar livro digital
              </button>
            </div>
            <div className="mt-28 flex justify-end">
              <button
                onClick={() => window.location.href = '/cliente'}
                className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Livro não encontrado.</p>
      )}
      <ToastContainer /> {/* Adicionando o container de toasts */}
    </div>
  );
};

export default LivroPage;

