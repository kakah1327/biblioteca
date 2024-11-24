import api from './apiCentral'; // Certifique-se de que o caminho está correto

export const usuarioApi = {

  // Função para listar todos os usuários
  listarTodosUsuarios: async (): Promise<Usuario[]> => {
    try {
      const response = await api.get('/usuarios');
      return response.data; // Retorna a lista de todos os usuários
    } catch (error) {
      if (error.response) {
        // Se a resposta de erro existir, usamos o erro específico da API
        const message = error.response.data || 'Erro ao carregar usuários';
        throw new Error(message); // Passa a mensagem do erro para o front
      }
      throw new Error('Erro de rede ou servidor');
    }
  },

  // Função para buscar usuários por nome
  buscarUsuariosPorNome: async (nome: string): Promise<Usuario[]> => {
    try {
      const response = await api.get(`/usuarios/nome/${nome}`);
      return response.data; // Retorna os usuários filtrados pelo nome
    } catch (error) {
      if (error.response) {
        const message = error.response.data || 'Erro ao carregar usuários por nome';
        throw new Error(message);
      }
      throw new Error('Erro de rede ou servidor');
    }
  },

  // Função para buscar um usuário por username
  buscarUsuarioPorUsername: async (username: string): Promise<Usuario | null> => {
    try {
      const response = await api.get(`/usuarios/username/${username}`);
      return response.data; // Retorna o usuário com o username
    } catch (error) {
      if (error.response) {
        const message = error.response.data || 'Erro ao carregar usuário por username';
        throw new Error(message);
      }
      throw new Error('Erro de rede ou servidor');
    }
  },

  // Função para buscar usuários por CPF
  buscarUsuariosPorCpf: async (cpf: string): Promise<Usuario[]> => {
    try {
      const response = await api.get(`/usuarios/cpf/${cpf}`);
      return response.data; // Retorna os usuários filtrados pelo CPF
    } catch (error) {
      if (error.response) {
        const message = error.response.data || 'Erro ao carregar usuários por CPF';
        throw new Error(message);
      }
      throw new Error('Erro de rede ou servidor');
    }
  },

  // Função para salvar um usuário
  salvarUsuario: async (usuario: Usuario): Promise<string> => {
    try {
      const response = await api.post('/usuarios', usuario);
      return response.data; // Retorna mensagem de sucesso
    } catch (error) {
      if (error.response) {
        const message = error.response.data || 'Erro ao salvar usuário';
        throw new Error(message); // Passa o erro detalhado da API para o front
      }
      throw new Error('Erro de rede ou servidor');
    }
  },

  // Função para atualizar um usuário
  atualizarUsuario: async (username: string, usuario: Usuario): Promise<Usuario> => {
    try {
      const response = await api.put(`/usuarios/${username}`, usuario);
      return response.data; // Retorna mensagem de sucesso
    } catch (error) {
      if (error.response) {
        const message = error.response.data || 'Erro ao atualizar usuário';
        throw new Error(message);
      }
      throw new Error('Erro de rede ou servidor');
    }
  },

  // Função para remover um usuário
  removerUsuario: async (username: string): Promise<string> => {
    try {
      const response = await api.delete(`/usuarios/${username}`);
      return response.data; // Retorna mensagem de sucesso
    } catch (error) {
      if (error.response) {
        const message = error.response.data || 'Erro ao remover usuário';
        throw new Error(message);
      }
      throw new Error('Erro de rede ou servidor');
    }
  },

};
