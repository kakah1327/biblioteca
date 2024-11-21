'use client';

import { useEffect, useState } from "react";
import { usuarioApi } from "../../api/usuarioApi";
import { Usuario } from "../interface/usuario";
import ModalDadosFuncionario from "../../modal/modalUsuario";

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pesquisa, setPesquisa] = useState(""); // Estado da barra de pesquisa
  const [statusFiltro, setStatusFiltro] = useState<string>(""); // Filtro de status
  
  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1); // Página atual
  const [usuariosPorPagina] = useState(10); // Número de usuários por página

  // Carregar todos os usuários ao montar o componente
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await usuarioApi.listarTodosUsuarios();
        setUsuarios(data);
        setUsuariosFiltrados(data);
      } catch (err) {
        setError("Erro ao carregar usuários. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // Função para abrir o modal
  const abrirModal = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setModalAberto(true);
  };

  // Função para fechar o modal
  const fecharModal = () => {
    setUsuarioSelecionado(null);
    setModalAberto(false);
  };

  // Callback para salvar as alterações no usuário
  const salvarAlteracoes = (usuarioAtualizado: Usuario) => {
    setUsuarios((usuariosAnteriores) =>
      usuariosAnteriores.map((u) =>
        u.username === usuarioAtualizado.username ? usuarioAtualizado : u
      )
    );
    fecharModal();
  };

  // Função para filtrar os usuários
  const filtrarUsuarios = (termo: string, status: string) => {
    setPesquisa(termo);
    setStatusFiltro(status);

    let filtrados = usuarios;

    if (status) {
      filtrados = filtrados.filter((usuario) =>
        status === "Ativo" ? usuario.usuarioAtivo : !usuario.usuarioAtivo
      );
    }

    if (termo.trim()) {
      const termoLower = termo.toLowerCase();
      filtrados = filtrados.filter(
        (usuario) =>
          usuario.nome.toLowerCase().includes(termoLower) ||
          usuario.username.toLowerCase().includes(termoLower) ||
          usuario.email.toLowerCase().includes(termoLower) ||
          usuario.cpf.includes(termo) // CPF não precisa de .toLowerCase(), pois é numérico
      );
    }

    setUsuariosFiltrados(filtrados);
  };

  // Função para alterar a página
  const mudarPagina = (numeroPagina: number) => {
    setPaginaAtual(numeroPagina);
  };

  // Calcular o intervalo de usuários para a página atual
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaAtual - 1) * usuariosPorPagina,
    paginaAtual * usuariosPorPagina
  );

  // Calcular o número total de páginas
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">Lista de Usuários</h1>

      {/* Barra de Pesquisa */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={pesquisa}
          onChange={(e) => filtrarUsuarios(e.target.value, statusFiltro)}
          placeholder="Pesquise por nome, username, email ou CPF"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md text-black"
        />
      </div>

      {/* Filtro de Status */}
      <div className="flex justify-center mb-6">
        <select
          value={statusFiltro}
          onChange={(e) => filtrarUsuarios(pesquisa, e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-black"
        >
          <option value="">Todos os Status</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>

      {/* Estado de Carregamento e Erros */}
      {loading && <p className="text-center text-white">Carregando usuários...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Nenhum Resultado */}
      {!loading && !error && usuariosPaginados.length === 0 && (
        <p className="text-center text-gray-500">Nenhum usuário encontrado.</p>
      )}

      {/* Tabela de Usuários */}
      {!loading && !error && usuariosPaginados.length > 0 && (
        <table className="w-full text-left border-collapse text-white">
          <thead>
            <tr>
              <th className="border-b py-2 px-4">Username</th>
              <th className="border-b py-2 px-4">Nome</th>
              <th className="border-b py-2 px-4">CPF</th>
              <th className="border-b py-2 px-4">Email</th>
              <th className="border-b py-2 px-4">Situação</th>
              <th className="border-b py-2 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPaginados.map((usuario) => (
              <tr key={usuario.username} className="hover:bg-gray-600">
                <td className="border-b py-2 px-4">{usuario.username}</td>
                <td className="border-b py-2 px-4">{usuario.nome}</td>
                <td className="border-b py-2 px-4">{usuario.cpf}</td>
                <td className="border-b py-2 px-4">{usuario.email}</td>
                <td className="border-b py-2 px-4">
                  {usuario.usuarioAtivo ? "Ativo" : "Inativo"}
                </td>
                <td className="border-b py-2 px-4">
                  <button
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
                    onClick={() => abrirModal(usuario)}
                  >
                    Alterar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Paginação */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => mudarPagina(paginaAtual - 1)}
          disabled={paginaAtual === 1}
          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2 text-white">{paginaAtual} de {totalPaginas}</span>
        <button
          onClick={() => mudarPagina(paginaAtual + 1)}
          disabled={paginaAtual === totalPaginas}
          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
        >
          Próxima
        </button>
      </div>

      {/* Modal de Edição */}
      {usuarioSelecionado && (
        <ModalDadosFuncionario
          isOpen={modalAberto}
          onClose={fecharModal}
          user={usuarioSelecionado}
          onSave={salvarAlteracoes}
        />
      )}
    </div>
  );
}
