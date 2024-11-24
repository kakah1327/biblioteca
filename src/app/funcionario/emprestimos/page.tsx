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
  const [excluirError, setExcluirError] = useState<string | null>(null); // Estado para erro de exclusão

  // Estado para paginação
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const itensPorPagina = 5; // Número de itens por página

  // Estado para o número de anos (para excluir empréstimos antigos)
  const [anosParaExcluir, setAnosParaExcluir] = useState<number>(0);

  const carregarEmprestimos = async () => {
    try {
      const data = await emprestimoApi.listarTodosEmprestimos();
      const emprestimosOrdenados = data.sort((a, b) => {
        if (a.emprestimoAtivo && !b.emprestimoAtivo) return -1;  // Ativos vem primeiro
        if (!a.emprestimoAtivo && b.emprestimoAtivo) return 1;   // Não ativos vem depois
        return 0;
      });
  
      setEmprestimos(data);
      setEmprestimosFiltrados(data);
      setEmprestimos(emprestimosOrdenados);
      setEmprestimosFiltrados(emprestimosOrdenados);
    } catch (err) {
      setError("Erro ao carregar empréstimos. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (emprestimo: Emprestimo) => {
    if (!emprestimo.emprestimoAtivo) return "Finalizado";
    if (emprestimo.atrasado) return "Atrasado";
    return "Ativo";
  };

  const excluirEmprestimosAntigos = async () => {
    if (anosParaExcluir <= 0) {
      setExcluirError("Por favor, insira um número de anos válido.");
      return;
    }
    try {
      const responseMessage = await emprestimoApi.excluirEmprestimosAntigos(anosParaExcluir);
  
      // Mensagem do backend, seja de sucesso ou aviso
      setExcluirError(responseMessage);  // Aqui você pode tratar a mensagem de forma apropriada
      carregarEmprestimos(); // Recarrega a lista após a exclusão
    } catch (err) {
      setExcluirError("Erro ao excluir empréstimos antigos: " + (err.message || "Tente novamente mais tarde."));
      console.error(err);
    }
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
    carregarEmprestimos(); // Recarrega a lista após fechar o modal
  };

  const salvarAlteracoes = (emprestimoAtualizado: Emprestimo) => {
    setEmprestimos((prev) =>
      prev.map((emprestimo) =>
        emprestimo.id === emprestimoAtualizado.id ? emprestimoAtualizado : emprestimo
      )
    );
    fecharModal(); // Fecha o modal após salvar as alterações
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

    setPaginaAtual(1); // Volta para a primeira página após a filtragem
    setEmprestimosFiltrados(filtrados);
  };

  const totalPaginas = Math.ceil(emprestimosFiltrados.length / itensPorPagina);

  const emprestimosExibidos = emprestimosFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-200 rounded-lg shadow-md">
      
      <div className="flex justify-end">
                <button
                onClick={() => window.location.href = '/funcionario'}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-slate-600">Voltar</button>
              </div>
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Lista de Empréstimos</h1>
    
      {/* Estado de Carregamento e Erros */}
      {loading && <p className="text-center text-black">Carregando empréstimos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      
      {/* Exibição da mensagem de erro ou sucesso */}
      {excluirError && (
        <div className="text-center text-red-500 mt-4">
          {excluirError}
        </div>
      )}

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
      {/* Filtro de Status */}

      {/* Campo de anos para exclusão */}
      <div className="flex justify-center mb-5">
        <button
          onClick={excluirEmprestimosAntigos}
          className="mr-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Excluir Empréstimos Antigos
        </button>
        
        <input
          type="number"
          value={anosParaExcluir}
          onChange={(e) => setAnosParaExcluir(Number(e.target.value))}
          placeholder="Anos para excluir"
          className="border border-gray-300 rounded-lg px-4 py-2 w-1/12 max-w-md text-black"
        />
      </div>

      {/* Nenhum Resultado */}
      {!loading && !error && emprestimosFiltrados.length === 0 && (
        <p className="text-center text-gray-400">Nenhum empréstimo encontrado.</p>
      )}

      {/* Tabela de Empréstimos */}
      {!loading && !error && emprestimosExibidos.length > 0 && (
        <div>
          <table className="w-full text-left border-collapse text-black">
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
              {emprestimosExibidos.map((emprestimo) => (
                <tr key={emprestimo.id} className="border-b border-gray-700">
                  <td className="py-2 px-4">{emprestimo.id}</td>
                  <td className="py-2 px-4">{emprestimo.livro.titulo}</td>
                  <td className="py-2 px-4">{emprestimo.usuario.nome}</td>
                  <td className="py-2 px-4">
                    {emprestimo.emprestimoFisico ? "Físico" : "Digital"}
                  </td>
                  <td className="py-2 px-4">{new Date(emprestimo.dataEmprestimo).toLocaleDateString("pt-BR")}</td>
                  <td className="py-2 px-4">{new Date(emprestimo.dataDevolucaoPrevista).toLocaleDateString("pt-BR")}</td>
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

          {/* Paginação */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaAtual === 1}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-black">{paginaAtual} de {totalPaginas}</span>
            <button
              onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaAtual === totalPaginas}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
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
