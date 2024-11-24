'use client'; // Diretiva para marcar o componente como cliente

import './globals.css';
import { ReactNode, useState } from 'react';
import { Roboto } from 'next/font/google';
import { AuthProvider } from './context/authContext';
import ModalLogin from './modal/modalLogin'; // Modal de Login
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// Importar os novos componentes Header e Footer
import Header from './components/common/header';
import Footer from './components/common/footer';

// Fonte personalizada (opcional)
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'], // Regular e Bold
});

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);  // Função para abrir o modal
  const closeModal = () => setIsModalOpen(false); // Função para fechar o modal

  return (
    <html lang="pt-BR" className="bg-white">
      <body className={`${roboto.className} bg-white text-white`}>
      <ToastContainer />
        <AuthProvider>
          {/* Passa openModal para o Header */}
          <Header openModal={openModal} />  {/* O Header agora tem o openModal como prop */}

          {/* Modal de Login */}
          <ModalLogin isOpen={isModalOpen} onClose={closeModal} />

          {/* Conteúdo Principal */}
          <main className="container mx-auto py-6">{children}</main>

          {/* Rodapé */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
