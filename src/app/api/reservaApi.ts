import api from './apiCentral'; // Certifique-se de que o caminho está correto

export const reservaApi = {


// Função para listar todas as reservas
listarTodasReservas: async (): Promise<Reserva[]> => {
  try {
    const response = await api.get('/reservas');
    return response.data; // Retorna a lista de todas as reservas
  } catch (error: any) {
    if (error.response?.status === 404) {
      // Retorna uma lista vazia se for um erro 404
      return [];
    }
    // Outros erros
    throw new Error(error.response?.data || 'Erro ao listar reservas');
  }
},


  // Função para listar reservas por nome de usuário
  listarReservasPorUsername: async (username: string): Promise<Reserva[]> => {
    try {
      const response = await api.get(`/reservas/username/${username}`);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao carregar reservas para o usuário ${username}:`, error.response || error);
      const message = error.response?.data?.message || 'Erro ao carregar reservas para o usuário.';
      throw new Error(message);      
    }
  },

  // Função para buscar uma reserva por ID
  buscarReservaPorId: async (id: number): Promise<Reserva | null> => {
    try {
      const response = await api.get(`/reservas/id/${id}`);
      return response.data; // Retorna a reserva com o ID especificado
    } catch (error: any) {
      console.error(`Erro ao carregar reservas para o ID ${id}:`, error.response || error);
      const message =
        error.response?.data?.message || 'Erro desconhecido ao carregar reservas.';
      throw new Error(message);
    }
  },

  // Função para listar reservas atrasadas
  listarReservasAtrasadas: async (): Promise<Reserva[]> => {
    try {
      const response = await api.get('/reservas/atrasadas');
      return response.data; // Retorna as reservas atrasadas
    } catch (error: any) {
      throw new Error(error.response?.data || 'Erro ao listar reservas atrasadas');
    }
  },

  // Função para realizar uma nova reserva
  realizarReserva: async (isbn: string, username: string): Promise<string> => {
    try {
      const response = await api.post('/reservas/realizar', null, { params: { isbn, username } });
      return response.data; // Retorna mensagem de sucesso
    } catch (error: any) {
      throw new Error(error.response?.data || 'Erro ao listar reservas');
    }
  },

  // Função para deletar uma reserva
  deletarReserva: async (id: number): Promise<string> => {
    try {
      const response = await api.delete(`/reservas/${id}`);
      return response.data; // Retorna mensagem de sucesso
    } catch (error: any) {
      throw new Error(error.response?.data || `Erro ao deletar reserva ${id}`);
    }
    },

  transformarReservaEmEmprestimo: async (reservaId: number): Promise<string> => {
    try {
      const response = await api.post(`/reservas/transformar/${reservaId}`);

      console.log('Resposta da API:', response); // Log de resposta para depuração
      return response.data; // Retorna mensagem de sucesso ou erro
    } catch (error: any) {
      console.error('Erro na API ao transformar a reserva em empréstimo:', error); // Log de erro detalhado
      throw new Error(error.response?.data || `Erro ao transformar a reserva ${reservaId} em empréstimo: ${error.message}`);
    }
  }

};
