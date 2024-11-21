// app/layout.tsx
'use client'; // Diretiva para marcar o componente como cliente

import { ReactNode, useState } from "react";
import { AuthProvider } from "../context/authContext"; // Contexto de autenticação
import ModalLogin from "../modal/modalLogin"; // Modal de Login
import Header from "../components/common/header"; // Header
import Footer from "../components/common/footer"; // Footer

const Layout = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Funções para abrir e fechar o modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <AuthProvider> {/* Contexto de autenticação envolto no AuthProvider */}
      <div className="bg-black text-white min-h-screen">
        {/* Cabeçalho */}

        {/* Conteúdo principal */}
        <main className="container mx-auto py-6">{children}</main>

      </div>
    </AuthProvider>
  );
};

export default Layout;
