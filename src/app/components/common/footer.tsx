// app/layout/components/Footer.tsx

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4">
      <p>© {new Date().getFullYear()} Sistema de Biblioteca. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;
