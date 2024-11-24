import React from 'react';
import styled from 'styled-components';

interface BotaoXProps {
  onClose: () => void;  // Adicionando a função onClose como prop
}

const BotaoX: React.FC<BotaoXProps> = ({ onClose }) => {
  return (
    <StyledWrapper>
      <button className="button" onClick={onClose}>  {/* Adicionando onClick para fechar */}
        <span className="X" />
        <span className="Y" />
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    position: relative;
    width: 2.5em;  /* Diminuindo o tamanho do botão */
    height: 2.5em; /* Diminuindo o tamanho do botão */
    border: none;
    background: none;
    cursor: pointer;  /* Adicionando o cursor pointer para indicar que é clicável */
  }

  .X, .Y {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2em;
    height: 1.5px;
    background-color: black;
    transform-origin: center;
  }

  .X {
    transform: translate(-50%, -50%) rotate(45deg);  /* Centralizando a X */
  }

  .Y {
    transform: translate(-50%, -50%) rotate(-45deg); /* Centralizando a Y */
  }

  .button:hover {
    background-color: rgb(210, 0, 0);
  }

  .button:active {
    background-color: rgb(130, 0, 0);
  }
`;

export default BotaoX;
