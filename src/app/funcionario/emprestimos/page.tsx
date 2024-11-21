"use client";

import { useEffect, useState } from "react";
import { emprestimoApi } from "../../api/emprestimoApi";
import { Emprestimo } from "../interface/emprestimos";
import ModalDadosEmprestimo from "../../modal/modalEmprestimo";

export default function ListaEmprestimos() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [emprestimosFiltrados, setEmprestimosFiltrados] = useState<Emprestimo[]>([]);
  const [pesquisa, setPesquisa] = useState<string>("");
  const [statusFiltro, setStatusFiltro] = useState<string>(""); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState<Emprestimo | null>(null);

  const carregarEmprestimos = async () => {
    try {
      const data = await emprestimoApi.listarTodosEmprestimos();
      setEmprestimos(data);
      setEmprestimosFiltrados(data);
    } catch (err) {
      setError("Erro ao carregar empréstimos. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (emprestimo: Emprestimo) => {
    if (!emprestimo.emprestimoAtivo) return 'Finalizado';
    if (emprestimo.atrasado) return 'Atrasado';
    return 'Ativo';
  };

  useEffect(() => {
    carregarEmprestimos();
  }, []);

  const abrirModal = (emprestimo: Emprestimo) => {
    setEmprestimoSelecionado(emprestimo);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setEmprestimoSelecionado(null);
    setModalAberto(false);
  };

  const salvarAlteracoes = (emprestimoAtualizado: Emprestimo) => {
    setEmprestimos((prev) => 
      prev.map((emprestimo) =>
        emprestimo.id === emprestimoAtualizado.id ? emprestimoAtualizado : emprestimo
      )
    );
    fecharModal();
  };

  const filtrarEmprestimos = (termo: string, status: string) => {
    setPesquisa(termo);
    setStatusFiltro(status);

    let filtrados = emprestimos;

    if (status) {
      filtrados = filtrados.filter((e) => getStatus(e) === status);
    }

    if (termo.trim()) {
      const termoLower = termo.toLowerCase();
      filtrados = filtrados.filter(
        (e) =>
          e.livro?.titulo.toLowerCase().includes(termoLower) ||
          e.usuario.nome.toLowerCase().includes(termoLower)
      );
    }

    setEmprestimosFiltrados(filtrados);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">Lista de Empréstimos</h1>

      {/* Barra de Pesquisa */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={pesquisa}
          onChange={(e) => filtrarEmprestimos(e.target.value, statusFiltro)}
          placeholder="Pesquise por livro ou nome"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md text-black"
        />
      </div>

      {/* Filtro de Status */}
      <div className="flex justify-center mb-6">
        <select
          value={statusFiltro}
          onChange={(e) => filtrarEmprestimos(pesquisa, e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-black"
        >
          <option value="">Todos os Status</option>
          <option value="Ativo">Ativo</option>
          <option value="Atrasado">Atrasado</option>
          <option value="Finalizado">Finalizado</option>
        </select>
      </div>

      {/* Estado de Carregamento e Erros */}
      {loading && <p className="text-center text-white">Carregando empréstimos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Nenhum Resultado */}
      {!loading && !error && emprestimosFiltrados.length === 0 && (
        <p className="text-center text-gray-400">Nenhum empréstimo encontrado.</p>
      )}

      {/* Tabela de Empréstimos */}
      {!loading && !error && emprestimosFiltrados.length > 0 && (
        <table className="w-full text-left border-collapse text-white">
          <thead>
            <tr>
              <th className="border-b py-2 px-4">ID</th>
              <th className="border-b py-2 px-4">Livro</th>
              <th className="border-b py-2 px-4">Nome</th>
              <th className="border-b py-2 px-4">Tipo</th>
              <th className="border-b py-2 px-4">Data de Empréstimo</th>
              <th className="border-b py-2 px-4">Data Prevista de Devolução</th>
              <th className="border-b py-2 px-4">Status</th>
              <th className="border-b py-2 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {emprestimosFiltrados.map((emprestimo) => (
              <tr key={emprestimo.id} className="border-b border-gray-700">
                <td className="py-2 px-4">{emprestimo.id}</td>
                <td className="py-2 px-4">{emprestimo.livro.titulo}</td>
                <td className="py-2 px-4">{emprestimo.usuario.nome}</td>
                <td className="py-2 px-4">
                  {emprestimo.emprestimoFisico
                    ? "Físico"
                    : emprestimo.emprestimoDigital
                    ? "Digital"
                    : "Desconhecido"}
                </td>
                <td className="py-2 px-4">
                  {new Date(emprestimo.dataEmprestimo).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  {new Date(emprestimo.dataDevolucaoPrevista).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">{getStatus(emprestimo)}</td>
                <td className="py-2 px-4">
                  <button
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
                    onClick={() => abrirModal(emprestimo)}
                  >
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de Detalhes */}
      {emprestimoSelecionado && (
        <ModalDadosEmprestimo
          isOpen={modalAberto}
          onClose={fecharModal}
          emprestimo={emprestimoSelecionado}
          onSave={salvarAlteracoes}
        />
      )}
    </div>
  );
}
