import React from 'react';
import styled from 'styled-components';

interface PesquisaProps {
  query: string;
  setQuery: (query: string) => void;
  isEditModalOpen: boolean; // Nova prop para verificar se o modal está aberto
}

const Pesquisa: React.FC<PesquisaProps> = ({ query, setQuery, isEditModalOpen }) => {
  console.log('isEditModalOpen:', isEditModalOpen); // Verifique o valor da prop aqui

  return (
    <StyledWrapper>
      <div className="searchBox">
        <input
          className="searchInput"
          type="text"
          placeholder="Pesquise por Título, Autor ou Categoria"
          value={query} // Valor controlado
          onChange={(e) => setQuery(e.target.value)} // Atualiza o estado
        />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .searchBox {
    display: flex;
    width: 600px; /* Ajusta a largura do contêiner para ser responsivo */
    max-width: 900px; /* Define um limite máximo */
    align-items: center;
    background: #e5e7eb;
    border-radius: 500px;
    padding: 16px 30px; /* Garante espaçamento interno */
    margin: 0 auto; /* Centraliza a caixa */
  }

  .searchInput {
    flex-grow: 1; /* Faz com que o input ocupe todo o espaço disponível */
    border: none;
    background: none;
    outline: none;
    color: black;
    font-size: 16px; /* Tamanho de fonte ajustado para melhor legibilidade */
    line-height: 1.5; /* Melhora o espaçamento vertical do texto */
    padding: 0; /* Remove espaçamento interno desnecessário */
    min-width: 0; /* Evita que o input ultrapasse o tamanho da caixa */
  }

  .searchInput::placeholder {
    color: #5e6063; /* Placeholder com cor sutil */
  }

  .searchBox:hover {
    background: #bbbdbf; /* Efeito ao passar o mouse */
  }
`;

export default Pesquisa;
