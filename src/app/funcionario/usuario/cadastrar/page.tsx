'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usuarioApi } from '../../../api/usuarioApi';
import { Usuario } from '../interface/usuario';
import SalvarUsuario from '../../../components/common/botaoUsuario';

export default function CadastrarUsuario() {
  const [usuario, setUsuario] = useState<Usuario>({
    username: '',
    nome: '',
    senha: '',
    email: '',
    tipoUsuario: 'CLIENTE',
    cpf: '',
    endereco: '',
    telefone: '',
    usuarioAtivo: true,
  });

  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Formatação de CPF e telefone
    if (name === 'cpf') {
      const cpfFormatado = value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
      setUsuario((prevState) => ({ ...prevState, cpf: cpfFormatado }));
    } else if (name === 'telefone') {
      const telefoneFormatado = value
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      setUsuario((prevState) => ({ ...prevState, telefone: telefoneFormatado }));
    } else {
      setUsuario((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const salvarUsuario = async () => {
    setMensagem(null);
    setErro(null);

    try {
      const mensagemSucesso = await usuarioApi.salvarUsuario(usuario);
      setMensagem(mensagemSucesso);

      // Redireciona após 2 segundos
      setTimeout(() => {
        router.push('/funcionario/usuario');
      }, 2000);
    } catch (error: any) {
      const mensagemErro = error?.message || 'Erro ao cadastrar o usuário. Verifique os dados e tente novamente.';
      setErro(mensagemErro);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-200 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Cadastrar Novo Usuário</h1>

      {mensagem && <p className="text-center text-green-500 mb-4">{mensagem}</p>}
      {erro && <p className="text-center text-red-500 mb-4">{erro}</p>}

      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-black">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={usuario.username}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
          />
        </div>

        <div>
          <label htmlFor="nome" className="block text-black">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={usuario.nome}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
          />
        </div>

        <div className="relative">
          <label htmlFor="senha" className="block text-black mb-1">Senha:</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="senha"
              name="senha"
              value={usuario.senha}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black pr-12"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center"
            >
              <img
                src={`/imagens/${showPassword ? 'olho-aberto' : 'olho-fechado'}.ico`}
                alt={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-black">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={usuario.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
          />
        </div>

        <div>
          <label htmlFor="tipoUsuario" className="block text-black">Tipo de Usuário:</label>
          <select
            id="tipoUsuario"
            name="tipoUsuario"
            value={usuario.tipoUsuario}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
          >
            <option value="CLIENTE">Cliente</option>
            <option value="FUNCIONARIO">Funcionário</option>
          </select>
        </div>

        <div>
          <label htmlFor="cpf" className="block text-black">CPF:</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={usuario.cpf}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
          />
        </div>

        <div>
          <label htmlFor="endereco" className="block text-black">Endereço:</label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            value={usuario.endereco}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
          />
        </div>

        <div>
          <label htmlFor="telefone" className="block text-black">Telefone:</label>
          <input
            type="text"
            id="telefone"
            name="telefone"
            value={usuario.telefone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="usuarioAtivo"
            name="usuarioAtivo"
            checked={usuario.usuarioAtivo}
            onChange={(e) => setUsuario((prevState) => ({ ...prevState, usuarioAtivo: e.target.checked }))}
            className="mr-2"
          />
          <label htmlFor="usuarioAtivo" className="text-black">Usuário Ativo</label>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <SalvarUsuario
          onClick={salvarUsuario}
          className=""
        >
          Salvar Usuário
        </SalvarUsuario>
      </div>
    </div>
  );
}
