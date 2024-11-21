'use client';

import React, { useState } from 'react';
import { livroApi } from '../../../api/livroApi'; // API para salvar livro
import { useRouter } from 'next/navigation'; // Para navegação após o cadastro

const CadastroLivro: React.FC = () => {
  const [livro, setLivro] = useState({
    titulo: '',
    autor: '',
    categoria: '',
    quantidadeEstoque: 0,
    isbn: '',
    capa: '', // Aqui armazenamos a capa em Base64
    livroFisico: false,
    livroDigital: false,
    quantidadeDownloads: 0,
    descricao: '', // Novo campo para descrição
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Função para atualizar os dados do livro
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setLivro({ ...livro, [name]: checked });
    } else {
      setLivro({ ...livro, [name]: value });
    }
  };

  // Função para converter a imagem para Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLivro({ ...livro, capa: reader.result as string }); // Atualiza a capa com a imagem em Base64
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await livroApi.salvarLivro(livro); // Envia o objeto livro para a API
      alert('Livro cadastrado com sucesso!');
      router.push('/funcionario'); // Redireciona para a lista de livros após cadastro
    } catch (err) {
      setError('Erro ao cadastrar livro.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Cadastrar Livro</h1>

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Título do Livro */}
          <div className="mb-6">
            <label htmlFor="titulo" className="block text-lg font-medium text-gray-700">Título do Livro</label>
            <input
              id="titulo"
              type="text"
              name="titulo"
              value={livro.titulo}
              onChange={handleInputChange}
              className="text-black mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Autor */}
          <div className="mb-6">
            <label htmlFor="autor" className="block text-lg font-medium text-gray-700">Autor</label>
            <input
              id="autor"
              type="text"
              name="autor"
              value={livro.autor}
              onChange={handleInputChange}
              className="text-black mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Categoria */}
          <div className="mb-6">
            <label htmlFor="categoria" className="block text-lg font-medium text-gray-700">Categoria</label>
            <input
              id="categoria"
              type="text"
              name="categoria"
              value={livro.categoria}
              onChange={handleInputChange}
              className="text-black mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* ISBN */}
          <div className="mb-6">
            <label htmlFor="isbn" className="block text-lg font-medium text-gray-700">ISBN</label>
            <input
              id="isbn"
              type="text"
              name="isbn"
              value={livro.isbn}
              onChange={handleInputChange}
              className="text-black mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          

          {/* Capa do Livro */}
          <div className="mb-6 flex items-center space-x-4">
            <div className="flex flex-col w-1/2">
              <label htmlFor="capa" className="block text-lg font-medium text-gray-700">Capa do Livro</label>
              <input
                id="capa"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-black mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {livro.capa && (
              <div className="w-1/2 flex justify-center">
                <img src={livro.capa} alt="Prévia da Capa" className="w-32 h-48 object-cover border border-gray-300 rounded-md shadow-sm" />
              </div>
            )}
          </div>

          {/* Descrição do Livro */}
          <div className="mb-6">
            <label htmlFor="descricao" className="block text-lg font-medium text-gray-700">Descrição do Livro</label>
            <textarea
              id="descricao"
              name="descricao"
              value={livro.descricao}
              onChange={handleInputChange}
              rows={4}
              className="text-black mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Livro Físico */}
          <div className="mb-6 flex items-center">
            <input
              id="livroFisico"
              type="checkbox"
              name="livroFisico"
              checked={livro.livroFisico}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="livroFisico" className="text-lg font-medium text-gray-700">Livro Físico</label>
          </div>

          {/* Livro Digital */}
          <div className="mb-6 flex items-center">
            <input
              id="livroDigital"
              type="checkbox"
              name="livroDigital"
              checked={livro.livroDigital}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="livroDigital" className="text-lg font-medium text-gray-700">Livro Digital</label>
          </div>

          {/* Quantidade de Downloads */}
          <div className="mb-6">
            <label htmlFor="quantidadeDownloads" className="block text-lg font-medium text-gray-700">Quantidade de Downloads</label>
            <input
              id="quantidadeDownloads"
              type="number"
              name="quantidadeDownloads"
              value={livro.quantidadeLicencas}
              onChange={handleInputChange}
              className="text-black mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Quantidade em Estoque */}
          <div className="mb-6">
            <label htmlFor="quantidadeEstoque" className="block text-lg font-medium text-gray-700">Quantidade em Estoque</label>
            <input
              id="quantidadeEstoque"
              type="number"
              name="quantidadeEstoque"
              value={livro.quantidadeEstoque}
              onChange={handleInputChange}
              className="text-black mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Botão de Submissão */}
          <button
            type="submit"
            className={`w-full py-3 px-6 bg-slate-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Livro'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroLivro;
