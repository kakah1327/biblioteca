'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/authContext'; // Contexto de autenticação
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Hook useRouter
import ModalDados from '../../modal/modalDados';
import BotaoLogin from './botaoLogin';
import BotaoLogout from './botaoLogout'

interface HeaderProps {
  openModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openModal }) => {
  const { user, logout } = useAuth(); // Contexto de autenticação
  const router = useRouter(); // Navegação
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  // Abrir o modal
  const handleOpenEditModal = () => {
    console.log("Abrindo Modal");
    setEditModalOpen(true); // Certifique-se de que isso está sendo chamado ao abrir o modal
  };

  // Fechar o modal
  const handleCloseEditModal = () => {
    console.log("Fechando Modal");
    setEditModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleNavigation = (path: string) => router.push(path);

  return (
    <header className="bg-slate-900 text-white py-6">
  {/* Header para usuário autenticado */}
  {user ? (
    <div className="container mx-auto flex justify-between items-center">
      {/* Nome da biblioteca */}
      <h1
        onClick={() =>
          handleNavigation(user.tipoUsuario === 'CLIENTE' ? '/cliente' : '/funcionario')
        }
        className="text-3xl font-bold cursor-pointer"
      >
        Biblioteca
      </h1>

      {/* Menu de navegação */}
      <nav>
        <ul className="flex space-x-6 items-center">
          {user.tipoUsuario === 'CLIENTE' && (
            <>
              <li>
                <button onClick={handleOpenEditModal} className="hover:underline">
                  Alterar Dados
                </button>
              </li>
              <li>
                <Link href="/cliente/reservas" className="hover:underline">
                  Reservas
                </Link>
              </li>
              <li>
                <Link href="/cliente/emprestimos" className="hover:underline">
                  Empréstimos
                </Link>
              </li>
            </>
          )}
          {user.tipoUsuario === 'FUNCIONARIO' && (
            <>
              <li>
                <Link href="/funcionario/usuario" className="hover:underline">
                  Usuários
                </Link>
              </li>
              <li>
                <Link href="/funcionario/livros/cadastro" className="hover:underline">
                  Cadastrar novo livro
                </Link>
              </li>
              <li>
                <Link href="/funcionario/emprestimos" className="hover:underline">
                  Empréstimos
                </Link>
              </li>
              <li>
                <Link href="/funcionario/reservas" className="hover:underline">
                  Reservas
                </Link>
              </li>
            </>
          )}
          <li>
            <BotaoLogout onClick={handleLogout} className="hover:underline">
              Logout
            </BotaoLogout>
          </li>
        </ul>
      </nav>
    </div>
  ) : (
    // Header para usuários não autenticados
    <div className="container mx-auto flex justify-between items-center">
      {/* Nome da biblioteca */}
      <h1 className="text-3xl font-bold">Biblioteca</h1>

      {/* Botão de login */}
      <nav>
        <ul className="flex">
          <li>
            <BotaoLogin onClick={openModal} className="hover:underline">
              Login
            </BotaoLogin>
          </li>
        </ul>
      </nav>
    </div>
  )}

  {/* Modal de edição de dados */}
  {isEditModalOpen && (
    <ModalDados
      isOpen={isEditModalOpen} // O modal depende deste estado
      onClose={handleCloseEditModal} // Fecha o modal
      user={user}
      onSave={(updatedUser) => {
        console.log('Dados atualizados:', updatedUser);
        handleCloseEditModal(); // Garante que o modal será fechado após salvar
      }}
    />
  )}
</header>

  );
};

export default Header;
