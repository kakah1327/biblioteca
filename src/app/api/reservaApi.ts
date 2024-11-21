import api from './apiCentral'; // Certifique-se de que o caminho está correto

export const reservaApi = {

  // Função para listar todas as reservas
  listarTodasReservas: async (): Promise<Reserva[]> => {
    try {
      const response = await api.get('/reservas');
      return response.data; // Retorna a lista de todas as reservas
    } catch (error) {
      throw new Error('Erro ao carregar reservas');
    }
  },

  // Função para listar reservas por nome de usuário
  listarReservasPorUsername: async (username: string): Promise<Reserva[]> => {
    try {
      const response = await api.get(`/reservas/username/${username}`);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao carregar reservas para o usuário ${username}:`, error.response || error);
      const message =
        error.response?.data?.message || 'Erro desconhecido ao carregar reservas.';
      throw new Error(message);
    }
  },

  // Função para buscar uma reserva por ID
  buscarReservaPorId: async (id: number): Promise<Reserva | null> => {
    try {
      const response = await api.get(`/reservas/id/${id}`);
      return response.data; // Retorna a reserva com o ID especificado
    } catch (error) {
      throw new Error(`Erro ao carregar reserva com ID ${id}`);
    }
  },

  // Função para listar reservas atrasadas
  listarReservasAtrasadas: async (): Promise<Reserva[]> => {
    try {
      const response = await api.get('/reservas/atrasadas');
      return response.data; // Retorna as reservas atrasadas
    } catch (error) {
      throw new Error('Erro ao carregar reservas atrasadas');
    }
  },

  // Função para realizar uma nova reserva
  realizarReserva: async (isbn: string, username: string): Promise<string> => {
    try {
      const response = await api.post('/reservas/realizar', null, { params: { isbn, username } });
      return response.data; // Retorna mensagem de sucesso
    } catch (error) {
      throw new Error('Erro ao realizar reserva');
    }
  },

  // Função para deletar uma reserva
  deletarReserva: async (id: number): Promise<string> => {
    try {
      const response = await api.delete(`/reservas/${id}`);
      return response.data; // Retorna mensagem de sucesso
    } catch (error) {
      throw new Error(`Erro ao remover reserva com ID ${id}`);
    }
  },

  transformarReservaEmEmprestimo: async (reservaId: number): Promise<string> => {
    try {
      const response = await api.post(`/reservas/transformar/${reservaId}`);

      console.log('Resposta da API:', response); // Log de resposta para depuração
      return response.data; // Retorna mensagem de sucesso ou erro
    } catch (error: any) {
      console.error('Erro na API ao transformar a reserva em empréstimo:', error); // Log de erro detalhado
      throw new Error(`Erro ao transformar a reserva ${reservaId} em empréstimo: ${error.message}`);
    }
  }

};
