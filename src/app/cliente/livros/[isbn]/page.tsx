'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // useRouter para navegação programática
import { livroApi } from '../../../api/livroApi';
import { reservaApi } from '../../../api/reservaApi'; // Certifique-se de importar a API de reservas
import { useAuth } from '../../../context/authContext'; // Supondo que useAuth é o hook de contexto de autenticação
import { emprestimoApi } from '../../../api/emprestimoApi'


const LivroPage: React.FC = () => {
  const [livro, setLivro] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isbn } = useParams(); // UseParams captura diretamente o valor do parâmetro
  const router = useRouter(); // Usando useRouter para redirecionamento
  const { user } = useAuth(); // Pega o usuário autenticado

  useEffect(() => {
    if (isbn) {
      const fetchLivro = async () => {
        try {
          const livroData = await livroApi.buscarLivroPorISBN(isbn as string);
          setLivro(livroData);
        } catch (err) {
          console.error('Erro ao carregar o livro:', err);
          setError('Erro ao carregar o livro');
        } finally {
          setLoading(false);
        }
      };

      fetchLivro();
    }
  }, [isbn]);

  const handleReservar = async () => {
    if (!livro || !user?.username) {
      setError('Erro: Não foi possível realizar a reserva. Verifique se você está autenticado.');
      return;
    }

    try {
      const reservaMessage = await reservaApi.realizarReserva(livro.isbn, user.username);
      alert(reservaMessage);
      router.push('/cliente/reservas');
    } catch (err) {
      console.error('Erro ao realizar reserva:', err);
      alert('Erro ao realizar a reserva. Tente novamente.');
    }
  };

  const handleEmprestarFisico = async () => {
    if (!livro || !user?.username) {
      setError('Erro: Não foi possível realizar o empréstimo. Verifique se você está autenticado.');
      return;
    }
  
    console.log('Tentando realizar empréstimo físico:', { isbn: livro.isbn, username: user.username });
  
    try {
      const emprestimoMessage = await emprestimoApi.realizarEmprestimoFisico(livro.isbn, user.username);
      console.log('Mensagem da API:', emprestimoMessage);
      alert(emprestimoMessage);
      router.push('/cliente/emprestimos');
    } catch (err) {
      console.error('Erro ao realizar empréstimo físico:', err);
      alert('Erro ao realizar o empréstimo físico. Tente novamente.');
    }
  };

  const handleEmprestarDigital = async () => {
    if (!livro || !user?.username) {
      setError('Erro: Não foi possível realizar o empréstimo. Verifique se você está autenticado.');
      return;
    }
  
    console.log('Tentando realizar empréstimo físico:', { isbn: livro.isbn, username: user.username });
  
    try {
      const emprestimoMessage = await emprestimoApi.realizarEmprestimoDigital(livro.isbn, user.username);
      console.log('Mensagem da API:', emprestimoMessage);
      alert(emprestimoMessage);
      router.push('/cliente/emprestimos');
    } catch (err) {
      console.error('Erro ao realizar empréstimo digital:', err);
      alert('Erro ao realizar o empréstimo digital. Tente novamente.');
    }
  };
  
  


  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto bg-gray-700 p-6 rounded-lg shadow-md">
      {livro ? (
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Imagem do Livro */}
          <div className="w-full md:w-1/5">
            <img
              src={livro.capa} // Base64 retornado da API
              alt={`Capa do livro ${livro.titulo}`}
              className="rounded-lg shadow-md object-cover w-full"
              style={{ aspectRatio: '2/3' }} // Mantém a proporção 2:3
            />
          </div>

          {/* Detalhes do Livro */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{livro.titulo}</h1>
            <p><strong>Descrição:</strong> {livro.descricao}</p>
            <p><strong>Autor:</strong> {livro.autor}</p>
            <p><strong>Categoria:</strong> {livro.categoria}</p>
            <p><strong>Quantidade em Estoque:</strong> {livro.quantidadeEstoque}</p>
            <p><strong>Quantidade de Licenças:</strong> {livro.quantidadeLicencas}</p>

            {/* Botões para ação */}
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleReservar}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-blue-600"
              >
                Reservar
              </button>
              <button
                onClick={handleEmprestarFisico}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-green-600"
              >
                Emprestar livro físico
              </button>
              <button
                onClick={handleEmprestarDigital}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-green-600"
              >
                Emprestar livro digital
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Livro não encontrado.</p>
      )}
    </div>
  );
};

export default LivroPage;
