'use client';

import { useEffect, useState } from "react";
import { Emprestimo } from "../interface/emprestimo";

interface ModalDadosEmprestimoProps {
  isOpen: boolean;
  onClose: () => void;
  emprestimo: Emprestimo | null;
}

export default function ModalDadosEmprestimo({
  isOpen,
  onClose,
  emprestimo,
  
}: ModalDadosEmprestimoProps) {
  if (!isOpen || !emprestimo) return null; // Se o modal não estiver aberto ou não houver empréstimo selecionado, não exibe nada.

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-slate-900 p-6 rounded-lg w-1/3 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Detalhes do Empréstimo</h2>

        <div className="mb-4">
          <p><strong>Livro:</strong> {emprestimo.livro.titulo}</p>
          <p><strong>Usuário:</strong> {emprestimo.usuario.nome}</p>
          <p><strong>Data de Empréstimo:</strong> {new Date(emprestimo.dataEmprestimo).toLocaleDateString()}</p>
          <p><strong>Data de Devolução:</strong> {emprestimo.dataDevolucaoEfetiva ? new Date(emprestimo.dataDevolucaoEfetiva).toLocaleDateString() : "Não devolvido ainda"}</p>
        </div>

        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
