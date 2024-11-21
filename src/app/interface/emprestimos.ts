// app/interface/emprestimos.ts

import { Livros } from './livros';  // Importando a interface Livro
import { Usuarios } from './usuarios';  // Importando a interface Usuario

export interface Emprestimos {
  id: number;
  livros: Livros;  // Um objeto do tipo Livro
  usuarios: Usuarios;  // Um objeto do tipo Usuario
  dataEmprestimo: Date;  // Data do empréstimo
  dataDevolucaoPrevista: Date;  // Data prevista para devolução
  dataDevolucaoEfetiva: Date | null;  // Data efetiva de devolução ou null se ainda não devolvido
  emprestimoFisico: boolean;
  emprestimoDigital: boolean;
  emprestimoAtivo: boolean;
  atrasado: boolean;
}
