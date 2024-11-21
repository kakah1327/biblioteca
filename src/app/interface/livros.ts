// app/interface/Livros.ts
 export interface Livros {
  id: number;
  titulo: string;
  autor: string;
  categoria: string;
  quantidadeEstoque: number; 
  isbn: string;
  capa: string;
  livroFisico: boolean;
  livroDigital: boolean;
  quantidadeLicencas: number;
  descricao: string;
  disponivelParaEmprestimo: boolean;
}

