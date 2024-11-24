import React, { useState, useEffect } from 'react';
import { livroApi } from '../api/livroApi';

interface ModalEditarLivroProps {
  livro: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (livroEditado: any) => void;
}

const ModalEditarLivro: React.FC<ModalEditarLivroProps> = ({ livro, isOpen, onClose, onSave }) => {
  const [isbn, setIsbn] = useState(livro?.isbn || '');
  const [titulo, setTitulo] = useState(livro?.titulo || '');
  const [autor, setAutor] = useState(livro?.autor || '');
  const [categoria, setCategoria] = useState(livro?.categoria || '');
  const [quantidadeEstoque, setQuantidadeEstoque] = useState(livro?.quantidadeEstoque || 0);
  const [livroFisico, setLivroFisico] = useState(livro?.livroFisico || false); 
  const [livroDigital, setLivroDigital] = useState(livro?.livroDigital || false);
  const [quantidadeLicencas, setQuantidadeLicencas] = useState(livro?.quantidadeLicencas || 0);
  const [descricao, setDescricao] = useState(livro?.descricao || '');
  const [capa, setCapa] = useState(livro?.capa || '');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);  // Estado para mensagem de erro
  const [successMessage, setSuccessMessage] = useState<string | null>(null);  // Estado para mensagem de sucesso

  // Resetando os estados quando o modal é fechado
  useEffect(() => {
    if (!isOpen) {
      setIsbn(livro?.isbn || '');
      setTitulo(livro?.titulo || '');
      setAutor(livro?.autor || '');
      setCategoria(livro?.categoria || '');
      setQuantidadeEstoque(livro?.quantidadeEstoque || 0);
      setLivroFisico(livro?.livroFisico || false);
      setLivroDigital(livro?.livroDigital || false);
      setQuantidadeLicencas(livro?.quantidadeLicencas || 0);
      setDescricao(livro?.descricao || '');
      setCapa(livro?.capa || '');
      setErrorMessage(null);  // Limpa mensagem de erro ao fechar o modal
      setSuccessMessage(null);  // Limpa mensagem de sucesso ao fechar o modal
    }
  }, [isOpen, livro]);

  if (!isOpen) return null;

  const handleSaveLivro = async () => {
    // Validação: Se for livro digital e a quantidade de licenças for menor ou igual a 0
    if (livroDigital && quantidadeLicencas < 0) {
      setErrorMessage('Por favor, insira uma quantidade de licenças válida para livros digitais.');
      return;
    }

    // Não faz a validação de quantidade de licenças se o livro não for digital
    setIsSaving(true);

    const livroEditado = {
      isbn,
      titulo,
      autor,
      categoria,
      quantidadeEstoque,
      livroFisico,
      livroDigital,
      quantidadeLicencas,
      descricao,
      capa: capa || livro?.capa, // Se não for enviada uma nova capa, mantém a capa atual
    };

    try {
      const response = await livroApi.atualizarLivro(isbn, livroEditado);
      console.log('Resposta da API:', response);

      if (!response) {
        console.error('Resposta inesperada ao salvar o livro:', response);
        setErrorMessage('A atualização foi concluída, mas houve um comportamento inesperado.');
      } else {
        setSuccessMessage('Livro atualizado com sucesso!');
        onSave(livroEditado);  // Passa os dados atualizados para o componente pai
        onClose();  // Fecha o modal
      }
    } catch (error: any) {
      console.error('Erro ao atualizar o livro:', error);
      setErrorMessage(`Erro ao atualizar o livro: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Função para atualizar o estado da capa
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapa(reader.result as string); // Atualiza a capa com a imagem em Base64
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">
  <div className="bg-gray-200 rounded-lg p-6 w-[50%] max-h-[90vh] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Livro</h2>
        
        {/* Exibição das mensagens de erro ou sucesso */}
        {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
        {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Inputs para os campos de edição */}
          <div>
            <label className="block font-medium">ISBN:</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="w-full p-2 border rounded-md text-black"
            />
          </div>
          <div>
            <label className="block font-medium">Título:</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full p-2 border rounded-md text-black"
            />
          </div>
          <div>
            <label className="block font-medium">Autor:</label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              className="w-full p-2 border rounded-md text-black"
            />
          </div>
          <div>
            <label className="block font-medium">Categoria:</label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full p-2 border rounded-md text-black"
            />
          </div>
          <div>
            <label className="block font-medium">Quantidade em Estoque:</label>
            <input
              type="number"
              value={quantidadeEstoque}
              onChange={(e) => setQuantidadeEstoque(Number(e.target.value))}
              className="w-full p-2 border rounded-md text-black"
            />
          </div>
          <div>
            <label className="block font-medium">Tipo de Livro:</label>
            <div className="space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={livroFisico}
                  onChange={(e) => setLivroFisico(e.target.checked)}
                  className="form-checkbox"
                />
                <span className="ml-2">Físico</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={livroDigital}
                  onChange={(e) => setLivroDigital(e.target.checked)}
                  className="form-checkbox"
                />
                <span className="ml-2">Digital</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block font-medium">Quantidade de Licenças:</label>
            <input
              type="number"
              value={quantidadeLicencas}
              onChange={(e) => setQuantidadeLicencas(Number(e.target.value))}
              className="w-full p-2 border rounded-md text-black"
              disabled={!livroDigital}
            />
            {livroDigital && (
              <p className="text-sm text-gray-500">Este campo é relevante apenas para livros digitais.</p>
            )}
          </div>
          <div>
            <label className="block font-medium">Descrição:</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full p-2 border rounded-md text-black h-32"
            />
          </div>
          <div>
            <label className="block font-medium">Capa do Livro:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md text-black"
            />
            {capa && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Prévia da capa:</p>
                <img src={capa} alt="Capa do livro" className="w-40 h-56 object-cover border border-gray-300 rounded-md" />
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-lg">
            Cancelar
          </button>
          <button
            onClick={handleSaveLivro}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSaving}
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarLivro;
