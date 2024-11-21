// import api from './apiCentral'; // Ou onde o seu arquivo api.ts estiver localizado

// export const login = async (username: string, password: string) => {
//   try {
//     const response = await api.post("/login", {
//       username,
//       senha: password, // Ajuste para o campo correto conforme sua API
//     });

//     if (response.status === 200) {
//       return response.data; // Retorna os dados recebidos da API
//     } else {
//       // Se a API retornar outro status que não seja 200, você pode lançar um erro.
//       throw new Error(`Erro: ${response.statusText}`);
//     }
//   } catch (error: any) {
//     // Log para depuração
//     console.error("Erro ao fazer login:", error);
    
//     // Você pode verificar o tipo de erro para um tratamento mais específico
//     if (error.response) {
//       // Se a API retornou um erro com resposta
//       console.error("Erro na resposta da API:", error.response.data);
//       throw new Error(`Erro da API: ${error.response.data.message || 'Erro desconhecido'}`);
//     } else if (error.request) {
//       // Se a requisição foi feita, mas não houve resposta
//       console.error("Erro na requisição, sem resposta do servidor:", error.request);
//       throw new Error("Erro de comunicação com o servidor.");
//     } else {
//       // Erro desconhecido
//       console.error("Erro desconhecido:", error.message);
//       throw new Error(error.message);
//     }
//   }
// };
