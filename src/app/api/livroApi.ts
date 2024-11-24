import api from './apiCentral'; // Importação do arquivo da API

export const livroApi = {
  
  // Função para listar todos os livros
  listarTodosLivros: async (): Promise<Livro[]> => {
    try {
      const response = await api.get('/livros'); // Endpoint para listar todos os livros
      return response.data; // Retorna os dados dos livros
    } catch (error) {
      if (error.response) {
        const message = error.response.data || 'Erro ao listar livros';
        throw new Error(message);
      }
      throw new Error('Erro de rede ou servidor');
    }
  },

  // Função para buscar livros por categoria
  buscarLivrosPorCategoria: async (categoria: string): Promise<Livro[]> => {
    try {
      const response = await api.get(`/livros/categoria/${categoria}`);
      return response.data; // Retorna a lista de livros filtrados pela categoria
    } catch (error) {
      if (error.response) {
        const message = error.response.data || 'Erro ao listar livros por categoria';
        throw new Error(message);
      }
      throw new Error('Erro de rede ou servidor');
    }
  },

  // Função para buscar livro por ISBN
  buscarLivroPorISBN: async (isbn: string) => {
    try {
      const response = await api.get(`/livros/isbn/${isbn}`);
      return response.data; // Retorna os dados do livro pelo ISBN
    } catch (error) {
      if (error.response) {
        const message = error.response.data || 'Erro ao listar livros por ISBN';
        throw new Error(message);
      }
      throw new Error('Erro de rede ou servidor');
    }
  },

  // Função para buscar livros por título
  buscarLivrosPorTitulo: async (titulo: string): Promise<Livro[]> => {
    try {
      const response = await api.get(`/livros/titulo/${titulo}`);
      return response.data; // Retorna livros que correspondem ao título
    } catch (error) {
      if (error.response) {
        const message = error.response.data || 'Erro ao listar livros por título';
        throw new Error(message);
      }
      throw new Error('Erro de rede ou servidor');
    }
  },

  // Função para buscar livros por autor
  buscarLivrosPorAutor: async (autor: string): Promise<Livro[]> => {
    try {
      const response = await api.get(`/livros/autor/${autor}`);
      return response.data; // Retorna livros encontrados por autor
    } catch (error) {
      if (error.response) {
        const message = error.response.data || 'Erro ao listar livros por autor';
        throw new Error(message);
      }
      throw new Error('Erro de rede ou servidor');
    }
  },

  // Função para salvar um livro
  salvarLivro: async (livro: Livro): Promise<string> => {
    try {
      const response = await api.post('/livros', livro); // Envia dados para criação do livro
      return response.data; // Retorna mensagem de sucesso
    } catch (error) {
      if (error.response) {
        const message = error.response.data || 'Erro ao salvar livro';
        throw new Error(message);
      }
      throw new Error('Erro de rede ou servidor');
    }
  },

  // Função para atualizar um livro
// Atualização da API para enviar resposta com dados ou confirmação de sucesso
atualizarLivro: async (isbn: string, livro: Livro): Promise<string> => {
  try {
    const response = await api.put(`/livros/${isbn}`, livro); // Envia dados para atualização
    if (response.status === 200) {
      return response.data; // Retorna mensagem de sucesso ou dados atualizados
    }
    throw new Error('Falha ao atualizar livro: ' + response.statusText);
  } catch (error) {
    if (error.response) {
      const message = error.response.data || 'Erro ao salvar livro';
      throw new Error(message);
    }
    throw new Error('Erro de rede ou servidor');
  }
},

  // Função para remover um livro
  removerLivro: async (isbn: string): Promise<string> => {
    try {
      const response = await api.delete(`/livros/${isbn}`); // Envia requisição para remover o livro
      return response.data; // Retorna mensagem de sucesso
    } catch (error) {
      if (error.response) {
        const message = error.response.data || 'Erro ao remover livros';
        throw new Error(message);
      }
      throw new Error('Erro de rede ou servidor');
    }
  },

};
