'use client';

import React, { useState, useEffect } from 'react';
import { usuarioApi } from '../api/usuarioApi';
import { Usuarios } from '../interface/usuarios';

interface ModalDadosFuncionarioProps {
  isOpen: boolean;
  onClose: () => void;
  user: Usuarios;
  onSave: (updatedUser: Usuarios) => void;
}

const ModalDadosFuncionario: React.FC<ModalDadosFuncionarioProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState<Usuarios>({
    ...user,
    senha: '', // Campo para edição da senha
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.email || !formData.username || !formData.cpf) {
      setError('Todos os campos obrigatórios devem ser preenchidos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedUser = await usuarioApi.atualizarUsuario(user.username, formData);
      onSave(updatedUser); // Callback para o componente pai
      onClose(); // Fecha o modal
    } catch (err) {
      console.error('Erro ao salvar os dados:', err);
      setError('Ocorreu um erro ao salvar os dados.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 transition-opacity">
      <div className="bg-white p-6 rounded-lg shadow-md w-[800px] h-[600px] text-black">
        <h2 className="text-xl font-bold mb-4">Alterar Dados do Usuário</h2>
        <div className="space-y-4 max-h-[450px] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">CPF</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100"
              placeholder="000.000.000-00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Endereço</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Telefone</label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100"
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
                className="w-full p-2 border rounded bg-gray-100"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Tipo de Usuário</label>
            <select
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100"
            >
              <option value="CLIENTE">Cliente</option>
              <option value="FUNCIONARIO">Funcionário</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Usuário Ativo</label>
            <select
              name="usuarioAtivo"
              value={formData.usuarioAtivo ? 'true' : 'false'}
              onChange={(e) =>
                setFormData({ ...formData, usuarioAtivo: e.target.value === 'true' })
              }
              className="w-full p-2 border rounded bg-gray-100"
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
          >
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

export default ModalDadosFuncionario;
