import React, { useState } from 'react';
import { Emprestimo } from '../interface/emprestimos';
import { emprestimoApi } from '../api/emprestimoApi'; // Supondo que a função esteja aqui
import { toast } from 'react-toastify'; // Assumindo que você esteja usando o react-toastify

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  emprestimo: Emprestimo;
  onSave: (emprestimoAtualizado: Emprestimo) => void;
  onDevolver: (id: number) => Promise<void>; // Esperamos que a devolução seja assíncrona
}

const ModalDadosEmprestimo: React.FC<ModalProps> = ({ isOpen, onClose, emprestimo, onSave, onDevolver }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Se o modal não estiver aberto ou o empréstimo não existir, retornamos null
  if (!isOpen || !emprestimo) return null;

  // Acesso às informações do cliente
  const cliente = emprestimo.usuario;

  // Função de devolução de livro
  const handleDevolucao = async () => {
    setLoading(true); // Ativa o carregamento
    setError(null); // Reseta o erro
    setSuccessMessage(null); // Reseta a mensagem de sucesso

    try {
      await emprestimoApi.devolverEmprestimo(emprestimo.id); // Chama a função de devolução no componente pai
      setSuccessMessage('Livro devolvido com sucesso!');
      toast.success('Livro devolvido com sucesso!');
      onClose(); // Fecha o modal após a devolução
    } catch (err) {
      setError('Erro ao devolver o livro. Tente novamente.');
      toast.error('Erro ao devolver o livro. Tente novamente.');
    } finally {
      setLoading(false); // Desativa o carregamentao
    }
  };

  return (
    <div className="text-black fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold">Detalhes do Empréstimo</h2>
        <p><strong>Livro:</strong> {emprestimo.livro.titulo}</p>
        <p><strong>Nome:</strong> {cliente.nome}</p>
        <p><strong>Telefone:</strong> {cliente.telefone}</p>
        <p><strong>E-mail:</strong> {cliente.email}</p>
        <p><strong>Endereço:</strong> {cliente.endereco}</p>
        <p><strong>Status:</strong> {emprestimo.emprestimoAtivo ? 'Ativo' : 'Finalizado'}</p>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}

        <div className="mt-4 flex justify-between">
          <button
            onClick={handleDevolucao}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            disabled={loading} // Desabilita o botão durante o carregamento
          >
            {loading ? 'Devolvendo...' : 'Devolver Livro'}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white py-2 px-4 ml-2 rounded hover:bg-gray-700"
            disabled={loading} // Desabilita o botão de fechar durante o processo de devolução
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDadosEmprestimo;
