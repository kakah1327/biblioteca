import React, { useState } from 'react';
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
  const [livroFisico, setLivroFisico] = useState(livro?.livroFisico || false); // Se o livro é físico ou digital
  const [livroDigital, setLivroDigital] = useState(livro?.livroDigital || false); // Se o livro é digital
  const [quantidadeLicencas, setQuantidadeLicencas] = useState(livro?.quantidadeLicencas || 0);
  const [descricao, setDescricao] = useState(livro?.descricao || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSaveLivro = async () => {
    // Validação para garantir que o campo 'quantidadeLicencas' seja preenchido apenas para livros digitais
    if (livroDigital && quantidadeLicencas <= 0) {
      alert('Por favor, insira uma quantidade de licenças válida para livros digitais.');
      return;
    }

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
    };

    try {
      const response = await livroApi.atualizarLivro(isbn, livroEditado);
      console.log('Resposta da API:', response);

      if (!response) {
        console.error('Resposta inesperada ao salvar o livro:', response);
        alert('A atualização foi concluída, mas houve um comportamento inesperado.');
      }

      onSave(livroEditado);
      onClose();
    } catch (error: any) {
      console.error('Erro ao atualizar o livro:', error);
      alert(`Erro ao atualizar o livro: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-black rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Livro</h2>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto"> {/* Adiciona a rolagem aqui */}
          {/* ISBN */}
          <div>
            <label className="block font-medium">ISBN:</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="w-full p-2 border rounded-md text-black"
            />
          </div>
          {/* Título */}
          <div>
            <label className="block font-medium">Título:</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full p-2 border rounded-md text-black"
            />
          </div>
          {/* Autor */}
          <div>
            <label className="block font-medium">Autor:</label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              className="w-full p-2 border rounded-md text-black"
            />
          </div>
          {/* Categoria */}
          <div>
            <label className="block font-medium">Categoria:</label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full p-2 border rounded-md text-black"
            />
          </div>
          {/* Quantidade em Estoque */}
          <div>
            <label className="block font-medium">Quantidade em Estoque:</label>
            <input
              type="number"
              value={quantidadeEstoque}
              onChange={(e) => setQuantidadeEstoque(Number(e.target.value))}
              className="w-full p-2 border rounded-md text-black"
            />
          </div>
          {/* Tipo de Livro: Físico ou Digital */}
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
          {/* Quantidade de Licenças */}
          <div>
            <label className="block font-medium">Quantidade de Licenças:</label>
            <input
              type="number"
              value={quantidadeLicencas}
              onChange={(e) => setQuantidadeLicencas(Number(e.target.value))}
              className="w-full p-2 border rounded-md text-black"
              disabled={!livroDigital} // Desabilita se o livro não for digital
            />
            {livroDigital && (
              <p className="text-sm text-gray-500">Este campo é relevante apenas para livros digitais.</p>
            )}
          </div>
          {/* Descrição */}
          <div>
            <label className="block font-medium">Descrição:</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full p-2 border rounded-md text-black"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-lg">
            Cancelar
          </button>
          <button
            onClick={handleSaveLivro}
            className={`px-4 py-2 rounded-lg text-white ${isSaving ? 'bg-gray-600' : 'bg-slate-600 hover:bg-slate-700'}`}
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
