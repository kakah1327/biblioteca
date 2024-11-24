'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { livroApi } from '../../../api/livroApi';
import { emprestimoApi } from '../../../api/emprestimoApi';
import { reservaApi } from '../../../api/reservaApi'; // Importe a reservaApi
import ModalEditarLivro from '../../../modal/modalEditarLivro'; // Importe o modal

const LivroPageFuncionario: React.FC = () => {
  const [livro, setLivro] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Mensagem de sucesso
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Mensagem de erro
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controle do modal de editar livro
  const [isModalEmprestarOpen, setIsModalEmprestarOpen] = useState(false); // Estado para controle do modal de emprestar
  const [isModalReservarOpen, setIsModalReservarOpen] = useState(false); // Estado para controle do modal de reservar
  const [clienteNome, setClienteNome] = useState(""); // Estado para o nome do cliente
  const { isbn } = useParams();

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModalEmprestar = () => {
    setIsModalEmprestarOpen(true);
  };

  const handleCloseModalEmprestar = () => {
    setIsModalEmprestarOpen(false);
  };

  const handleOpenModalReservar = () => {
    setIsModalReservarOpen(true);
  };

  const handleCloseModalReservar = () => {
    setIsModalReservarOpen(false);
  };

  const handleSaveLivro = async (livroEditado: any) => {
    try {
      // Garante que a capa atual será preservada se não houver edição
      const livroAtualizado = {
        ...livro, // Dados atuais
        ...livroEditado, // Dados editados
        capa: livroEditado.capa || livro.capa, // Preserva a capa original se não for alterada
      };
  
      const response = await livroApi.atualizarLivro(livro.isbn, livroAtualizado);
      console.log('Resposta da API:', response);
  
      if (!response) {
        setSuccessMessage(null);
        console.error('Resposta inesperada ao salvar o livro:', response);
        setErrorMessage('A atualização foi concluída, mas houve um comportamento inesperado.');
        return;
      }
  
      // Atualiza o estado com os novos dados
      setLivro(livroAtualizado);
      setErrorMessage(null);
      setSuccessMessage('Livro atualizado com sucesso!');
      
      // Fecha o modal após salvar, apenas em caso de sucesso
      handleCloseModal();
    } catch (error: any) {
      setSuccessMessage(null);
      console.error('Erro ao atualizar o livro:', error);
      setErrorMessage(`Erro ao atualizar o livro: ${error.message || 'Erro desconhecido'}`);
    }
  };
  

  const handleEmprestarLivro = async (tipoEmprestimo: 'fisico' | 'digital') => {
    try {
      let response;
      if (tipoEmprestimo === 'fisico') {
        response = await emprestimoApi.realizarEmprestimoFisico(livro.isbn, clienteNome);
      } else {
        // Para livros digitais, verifica se há licenças disponíveis
        if (livro.licencas > 0) {
          response = await emprestimoApi.realizarEmprestimoDigital(livro.isbn, clienteNome);
        } else {
          setErrorMessage('Não há licenças disponíveis para este livro digital.');
          return;
        }
      }

      console.log('Resposta da API ao emprestar livro:', response);

      if (response) {
        setErrorMessage(null);
        setSuccessMessage(`${tipoEmprestimo === 'fisico' ? 'Empréstimo físico' : 'Empréstimo digital'} realizado com sucesso!`);
      } else {
        setSuccessMessage(null);
        setErrorMessage(`Erro ao realizar o empréstimo ${tipoEmprestimo === 'fisico' ? 'físico' : 'digital'}`);
      }

      handleCloseModalEmprestar();
    } catch (error: any) {
      setSuccessMessage(null);
      console.error('Erro ao emprestar o livro:', error);
      setErrorMessage(`Erro ao emprestar o livro: ${error.message || 'Erro desconhecido'}`);
      handleCloseModalEmprestar();  // Fecha o modal em caso de erro
    }
  };

  const handleReservarLivro = async () => {
    try {
      // Chama a API para realizar a reserva
      const response = await reservaApi.realizarReserva(livro.isbn, clienteNome);
      console.log('Resposta da API ao realizar reserva:', response);

      if (response) {
        setErrorMessage(null);
        setSuccessMessage('Reserva realizada com sucesso!');
      } else {
        setSuccessMessage(null);
        setErrorMessage('Erro ao realizar a reserva!');
      }

      handleCloseModalReservar();
    } catch (error: any) {
      setSuccessMessage(null);
      console.error('Erro ao reservar o livro:', error);
      setErrorMessage(`Erro ao reservar o livro: ${error.message || 'Erro desconhecido'}`);
      handleCloseModalReservar(); 
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto bg-gray-200 p-6 rounded-lg shadow-md">
      {livro ? (
        <>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-full md:w-1/5">
              <img
                src={livro.capa}
                alt={`Capa do livro ${livro.titulo}`}
                className="rounded-lg shadow-md object-cover w-full"
                style={{ aspectRatio: '2/3' }}
              />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold mb-4">{livro.titulo}</h1>
              <p><strong>Descrição:</strong> {livro.descricao}</p>
              <p><strong>Autor:</strong> {livro.autor}</p>
              <p><strong>Categoria:</strong> {livro.categoria}</p>
              <p><strong>Quantidade em Estoque:</strong> {livro.quantidadeEstoque}</p>
            
              <p><strong>Licenças Disponíveis:</strong> {livro.quantidadeLicencas}</p>
              

              {/* Exibição de mensagens de erro ou sucesso */}
              {errorMessage && (
                <p className="text-red-500 mt-4">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-500 mt-4">{successMessage}</p>
              )}

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleOpenModal}
                  className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                >
                  Editar livro
                </button>
                <button
                  onClick={handleOpenModalEmprestar}
                  className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                >
                  Emprestar livro
                </button>
                <button
                  onClick={handleOpenModalReservar}
                  className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                >
                  Reservar livro
                </button>
              </div>
              <div className="mt-28 flex justify-end">
                <button
                onClick={() => window.location.href = '/funcionario'}
                className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600">Voltar</button>
              </div>
            </div>
          </div>

          {/* Modal de edição */}
          <ModalEditarLivro
            livro={livro}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveLivro} // Passa a função de salvamento
          />

          {/* Modal de Emprestar */}
          {isModalEmprestarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-gray-200 rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">Emprestar Livro</h2>
                <div>
                  <label className="block font-medium">Nome ou Username do Cliente:</label>
                  <input
                    type="text"
                    value={clienteNome}
                    onChange={(e) => setClienteNome(e.target.value)}
                    className="w-full p-2 border rounded-md text-black"
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button onClick={handleCloseModalEmprestar} className="px-4 py-2 bg-gray-400 text-white rounded-lg">
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleEmprestarLivro('fisico')}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                  >
                    Confirmar Empréstimo Físico
                  </button>
                  {livro.tipo === 'digital' && (
                    <button
                      onClick={() => handleEmprestarLivro('digital')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Confirmar Empréstimo Digital
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modal de Reservar */}
          {isModalReservarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-gray-200 rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">Reservar Livro</h2>
                <div>
                  <label className="block font-medium">Nome ou Username do Cliente:</label>
                  <input
                    type="text"
                    value={clienteNome}
                    onChange={(e) => setClienteNome(e.target.value)}
                    className="w-full p-2 border rounded-md text-black"
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button onClick={handleCloseModalReservar} className="px-4 py-2 bg-gray-400 text-white rounded-lg">
                    Cancelar
                  </button>
                  <button
                    onClick={handleReservarLivro}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                  >
                    Confirmar Reserva
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Livro não encontrado.</p>
      )}
    </div>
  );
};

export default LivroPageFuncionario;
