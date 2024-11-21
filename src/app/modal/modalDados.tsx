'use client';

import React, { useState, useEffect } from 'react';
import { usuarioApi } from '../api/usuarioApi';
import { useAuth } from '../context/authContext';
import { useRouter } from 'next/navigation';
import { Usuarios } from '../interface/usuarios';

interface ModalDadosProps {
  isOpen: boolean;
  onClose: () => void;
  user: Usuarios;
  onSave: (updatedUser: Usuarios) => void;
}

const ModalDados: React.FC<ModalDadosProps> = ({ isOpen, onClose, user, onSave }) => {
  const { setUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<Usuarios>({
    ...user, // Carrega os dados iniciais do usuário
    senha: '', // Adiciona o campo "senha" para edição
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Controla o scroll da página quando o modal está aberto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Atualiza os valores do formulário conforme o usuário edita os campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Salva os dados atualizados
  const handleSave = async () => {
    // Validação básica para campos obrigatórios
    if (!formData.nome || !formData.email || !formData.endereco || !formData.telefone) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedUser = await usuarioApi.atualizarUsuario(user.username, formData); // Chama a API para salvar
      setUser(updatedUser); // Atualiza o contexto do usuário
      onSave(updatedUser); // Callback para o componente pai
      onClose(); // Fecha o modal
      router.push(updatedUser.tipoUsuario === 'CLIENTE' ? '/cliente' : '/funcionario'); // Redireciona
    } catch (err) {
      console.error('Erro ao salvar os dados:', err);
      setError('Ocorreu um erro ao salvar os dados.');
    } finally {
      setLoading(false);
    }
  };

  // Alterna a visibilidade do campo de senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 transition-opacity">
      <div className="bg-black p-6 rounded-lg shadow-md w-[800px] h-[550px] text-white">
        <h2 className="text-xl font-bold mb-4">Alterar Dados</h2>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {/* Campos do formulário */}
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              value={user.username}
              readOnly
              className="w-full p-2 border rounded bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">CPF</label>
            <input
              type="text"
              value={user.cpf}
              readOnly
              className="w-full p-2 border rounded bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Endereço</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Telefone</label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-800 text-white"
              placeholder="(DDD) 00000-0000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-800 text-white"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <img
                  src={`/imagens/${showPassword ? 'olho-aberto' : 'olho-fechado'}.ico`}
                  alt={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  width="20"
                  height="20"
                />
              </button>
            </div>
          </div>
        </div>
        {/* Exibe erros, se houver */}
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDados;
