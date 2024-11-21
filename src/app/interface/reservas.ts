// app/interface/reservas
import { Livros } from './livros';  // Importando a interface Livro
import { Usuarios } from './usuarios';  // Importando a interface Usuario


export interface Reservas {
    id: number;
    livros: Livros;  // Um objeto do tipo Livro
    usuarios: Usuarios;  // Um objeto do tipo Usuario
    dataReserva: Date;  // Data do empréstimo
    dataExpiracao: Date;  // Data prevista para devolução
}