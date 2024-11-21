import api from './apiCentral'; // Certifique-se de que o caminho está correto

export const usuarioApi = {

  // Função para listar todos os usuários
  listarTodosUsuarios: async (): Promise<Usuario[]> => {
    try {
      const response = await api.get('/usuarios');
      return response.data; // Retorna a lista de todos os usuários
    } catch (error) {
      throw new Error('Erro ao carregar usuários');
    }
  },

  // Função para buscar usuários por nome
  buscarUsuariosPorNome: async (nome: string): Promise<Usuario[]> => {
    try {
      const response = await api.get(`/usuarios/nome/${nome}`);
      return response.data; // Retorna os usuários filtrados pelo nome
    } catch (error) {
      throw new Error('Erro ao carregar usuários por nome');
    }
  },

  // Função para buscar um usuário por username
  buscarUsuarioPorUsername: async (username: string): Promise<Usuario | null> => {
    try {
      const response = await api.get(`/usuarios/username/${username}`);
      return response.data; // Retorna o usuário com o username
    } catch (error) {
      throw new Error('Erro ao carregar usuário por username');
    }
  },

  // Função para buscar usuários por CPF
  buscarUsuariosPorCpf: async (cpf: string): Promise<Usuario[]> => {
    try {
      const response = await api.get(`/usuarios/cpf/${cpf}`);
      return response.data; // Retorna os usuários filtrados pelo CPF
    } catch (error) {
      throw new Error('Erro ao carregar usuários por CPF');
    }
  },

  // Função para salvar um usuário
  salvarUsuario: async (usuario: Usuario): Promise<string> => {
    try {
      const response = await api.post('/usuarios', usuario);
      return response.data; // Retorna mensagem de sucesso
    } catch (error) {
      throw new Error('Erro ao salvar usuário');
    }
  },

  // Função para atualizar um usuário
  atualizarUsuario: async (username: string, usuario: Usuario): Promise<Usuario> => {
    try {
      const response = await api.put(`/usuarios/${username}`, usuario);
      return response.data; // Retorna mensagem de sucesso
    } catch (error) {
      throw new Error('Erro ao atualizar usuário');
    }
  },

  // Função para remover um usuário
  removerUsuario: async (username: string): Promise<string> => {
    try {
      const response = await api.delete(`/usuarios/${username}`);
      return response.data; // Retorna mensagem de sucesso
    } catch (error) {
      throw new Error('Erro ao remover usuário');
    }
  },

};
