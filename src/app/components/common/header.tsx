'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/authContext'; // Importar o contexto de autenticação
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Importar o hook useRouter
import ModalDados from '../../modal/modalDados';

interface HeaderProps {
  openModal: () => void;
}


const Header: React.FC<HeaderProps> = ({ openModal }) => {
  const { user, logout } = useAuth(); // Obter o usuário e a função de logout do contexto de autenticação
  const router = useRouter(); // Instanciar o router
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Estado para controle do modal de edição de dados

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleLogout = () => {
    logout(); // Realiza o logout pelo contexto de autenticação
    router.push('/'); // Redireciona para a página principal
  };

  const returnCliente = () => {
    router.push('/cliente')
  }
  const returnFuncionario = () => {
    router.push('/funcionario')
  }

  return (
    <header className="bg-slate-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center"> 
        {
        user?.tipoUsuario === "CLIENTE" && (
        <h1 onClick={returnCliente} className="text-2xl font-bold cursor-pointer">Biblioteca</h1>
        )} {
          user?.tipoUsuario === "FUNCIONARIO" && (
            <h1 onClick={returnFuncionario} className="text-2xl font-bold cursor-pointer">Biblioteca</h1>
            )
        }
        <nav>
          <ul className="flex space-x-4">
            {/* Se o usuário for CLIENTE */}
            {user?.tipoUsuario === 'CLIENTE' && (
              <>
                <li>
                  <button
                    onClick={handleOpenEditModal}
                    className="hover:underline"
                  >
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
                <li>
                  <button
                    onClick={handleLogout} // Chama a função de logout que redireciona
                    className="hover:underline"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
            {user?.tipoUsuario === 'FUNCIONARIO' && (
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
                <li>
                  <button
                    onClick={handleLogout} // Chama a função de logout que redireciona
                    className="hover:underline"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* Se o usuário não estiver autenticado */}
          </ul>
        </nav>
      </div>
            {!user && (
          <div className="container mx-auto flex justify-between items-center"> 
          <h1 className="text-2xl font-bold">Biblioteca</h1>
          <nav>
          <ul className="flex justify-end items-end max-w-full">
              <li className="">
                <button
                  onClick={openModal} // Utiliza a função passada por props para abrir o modal de login
                  className="hover:underline"
                >
                  Login
                </button>
              </li>
            </ul>
          </nav>
        </div>
            )}

      {/* Modal para editar os dados do usuário */}
      {isEditModalOpen && (
        <ModalDados
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          user={user} // Passa o usuário logado como props
          onSave={(updatedUser) => {
            console.log('Dados atualizados:', updatedUser);
            handleCloseEditModal();
          }}
        />
      )}
    </header>
  );
};

export default Header;
