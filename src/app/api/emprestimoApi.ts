import api from './apiCentral'; // Certifique-se de que o caminho está correto

export const emprestimoApi = {

  // Função para listar todos os empréstimos
  listarTodosEmprestimos: async (): Promise<Emprestimo[]> => {
    try {
      const response = await api.get('/emprestimos');
      return response.data; // Retorna a lista de todos os empréstimos
    } catch (error: any) {
      throw new Error(error.response?.data || 'Erro ao carregar empréstimos');
    }
  },
  
  excluirEmprestimosAntigos: async (anos: number): Promise<string> => {
    try {
      const response = await api.delete(`/emprestimos/anos/${anos}`);
      
      if (response.status === 204) {
        return `Nenhum empréstimo encontrado para exclusão com mais de ${anos} anos.`;
      }
      return response.data; // Retorna a mensagem de sucesso se houver dados
    } catch (error: any) {
      // Lida com erros (como erro de validação, servidor, etc)
      throw new Error(error.response?.data || `Erro ao excluir empréstimos antigos: ${error.message}`);
    }
  },
  

  // Função para realizar empréstimo físico
  realizarEmprestimoFisico: async (isbn: string, username: string): Promise<string> => {
    try {
      const response = await api.post('/emprestimos/realizar/fisico', null, {
        params: { isbn, username }
      });
      return response.data; // Retorna a mensagem com o ID do empréstimo
    } catch (error: any) {
      throw new Error(error.response?.data || 'Erro ao realizar empréstimo físico');
    }
  },

  // Função para realizar empréstimo digital
  realizarEmprestimoDigital: async (isbn: string, username: string): Promise<string> => {
    try {
      const response = await api.post('/emprestimos/realizar/digital', null, {
        params: { isbn, username }
      });
      return response.data; // Retorna a mensagem com o ID do empréstimo
    } catch (error: any) {
      throw new Error(error.response?.data || 'Erro ao realizar empréstimo digital');
    }
  },

  // Função para listar empréstimos de um usuário por username
  listarEmprestimosPorUsername: async (username: string): Promise<Emprestimo[]> => {
    try {
      const response = await api.get(`/emprestimos/username/${username}`);
      return response.data; // Retorna a lista de empréstimos do usuário
    } catch (error: any) {
      throw new Error(error.response?.data || 'Erro ao listar empréstimos por username');
    }
  },

  // Função para buscar empréstimo por ID
  buscarEmprestimoPorId: async (id: number): Promise<Emprestimo | null> => {
    try {
      const response = await api.get(`/emprestimos/id/${id}`);
      return response.data; // Retorna o empréstimo com o ID
    } catch (error: any) {
      throw new Error(error.response?.data || 'Erro ao buscar empréstimo por ID');
    }
  },

  // Função para listar empréstimos físicos
  listarEmprestimosFisicos: async (): Promise<Emprestimo[]> => {
    try {
      const response = await api.get('/emprestimos/fisico');
      return response.data; // Retorna a lista de empréstimos físicos
    } catch (error: any) {
      throw new Error(error.response?.data || 'Erro ao listar empréstimos físicos');
    }
  },

  // Função para listar empréstimos digitais
  listarEmprestimosDigitais: async (): Promise<Emprestimo[]> => {
    try {
      const response = await api.get('/emprestimos/digital');
      return response.data; // Retorna a lista de empréstimos digitais
    } catch (error: any) {
      throw new Error(error.response?.data || 'Erro ao listar empréstimos digitais');
    }
  },

  // Função para listar empréstimos atrasados
  listarEmprestimosAtrasados: async (): Promise<Emprestimo[]> => {
    try {
      const response = await api.get('/emprestimos/atrasados');
      return response.data; // Retorna a lista de empréstimos atrasados
    } catch (error: any) {
      throw new Error(error.response?.data || 'Erro ao listar empréstimos atrasados');
    }
  },

  // Função para listar empréstimos ativos
  listarEmprestimosAtivos: async (): Promise<Emprestimo[]> => {
    try {
      const response = await api.get('/emprestimos/ativos');
      return response.data; // Retorna a lista de empréstimos ativos
    } catch (error: any) {
      throw new Error(error.response?.data || 'Erro ao listar empréstimos ativos');
    }
  },

  // Função para listar empréstimos finalizados
  listarEmprestimosFinalizados: async (): Promise<Emprestimo[]> => {
    try {
      const response = await api.get('/emprestimos/finalizados');
      return response.data; // Retorna a lista de empréstimos finalizados
    } catch (error: any) {
      throw new Error(error.response?.data || 'Erro ao listar empréstimos finalizados');
    }
  },

  // Função para devolver um empréstimo
  devolverEmprestimo: async (id: number): Promise<string> => {
    try {
      const response = await api.put(`/emprestimos/devolver/${id}`);
      return response.data; // Retorna mensagem de sucesso
    } catch (error: any) {
      throw new Error(error.response?.data || 'Erro ao devolver o empréstimo');
    }
  },

  // Função para remover um empréstimo (não está em uso)
  removerEmprestimo: async (id: number): Promise<string> => {
    try {
      const response = await api.delete(`/emprestimos/${id}`);
      return response.data; // Retorna mensagem de sucesso
    } catch (error: any) {
      throw new Error(error.response?.data || 'Erro ao remover empréstimo');
    }
  },

};
