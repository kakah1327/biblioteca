'use client';

import React, { useState } from 'react';
import { livroApi } from '../../../api/livroApi'; // API para salvar livro
import { useRouter } from 'next/navigation'; // Para navegação após o cadastro
import { ToastContainer, toast } from 'react-toastify'; // Importando o Toastify
import 'react-toastify/dist/ReactToastify.css'; // Estilos do Toastify
import BotaoCadastro from '../../../components/common/botaoCadastro'

const CadastroLivro: React.FC = () => {
  const [livro, setLivro] = useState({
    titulo: '',
    autor: '',
    categoria: '',
    isbn: '',
    capa: '', // Aqui armazenamos a capa em Base64
    livroFisico: false,
    livroDigital: false,
    quantidadeDownloads: 0,
    quantidadeEstoque: 0,
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
      // Validação simples de campos
      if (!livro.titulo || !livro.autor || !livro.categoria || !livro.isbn) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      await livroApi.salvarLivro(livro); // Envia o objeto livro para a API
      toast.success('Livro cadastrado com sucesso!'); // Exibe a notificação de sucesso
      router.push('/funcionario'); // Redireciona para a lista de livros após cadastro
    } catch (err) {
      setError('Erro ao cadastrar livro.');
      console.error(err);
      toast.error('Erro ao cadastrar livro.'); // Exibe a notificação de erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-200 p-8 rounded-lg shadow-lg">
        <div className="flex justify-end">
          <button
            onClick={() => router.push('/funcionario')} // Navegação para a página de funcionários
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition duration-300 ease-in-out"
          >
            Voltar
          </button>
        </div>
        <h1 className="text-3xl font-bold text-center text-black mb-8">Cadastrar Livro</h1>

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Título do Livro */}
          <div className="mb-6">
            <label htmlFor="titulo" className="block text-lg font-medium text-black">Título do Livro</label>
            <input
              id="titulo"
              type="text"
              name="titulo"
              value={livro.titulo}
              onChange={handleInputChange}
              className="text-black mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
              required
            />
          </div>

          {/* Autor */}
          <div className="mb-6">
            <label htmlFor="autor" className="block text-lg font-medium text-black">Autor</label>
            <input
              id="autor"
              type="text"
              name="autor"
              value={livro.autor}
              onChange={handleInputChange}
              className="text-black mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
              required
            />
          </div>

          {/* Categoria */}
          <div className="mb-6">
            <label htmlFor="categoria" className="block text-lg font-medium text-black">Categoria</label>
            <input
              id="categoria"
              type="text"
              name="categoria"
              value={livro.categoria}
              onChange={handleInputChange}
              className="text-black mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
              required
            />
          </div>

          {/* ISBN */}
          <div className="mb-6">
            <label htmlFor="isbn" className="block text-lg font-medium text-black">ISBN</label>
            <input
              id="isbn"
              type="text"
              name="isbn"
              value={livro.isbn}
              onChange={handleInputChange}
              className="text-black mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
              required
            />
          </div>

          {/* Capa do Livro */}
          <div className="mb-6 flex items-center space-x-4">
            <div className="flex flex-col w-1/2">
              <label htmlFor="capa" className="block text-lg font-medium text-black">Capa do Livro</label>
              <input
                id="capa"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-black mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
              />
            </div>
            {livro.capa && (
              <div className="w-1/8 flex justify-center">
                <img src={livro.capa} alt="Prévia da Capa" className="w-40 h-56 object-cover border border-gray-300 rounded-md shadow-sm" />
              </div>
            )}
          </div>

          {/* Descrição do Livro */}
          <div className="mb-6">
            <label htmlFor="descricao" className="block text-lg font-medium text-black">Descrição do Livro</label>
            <textarea
              id="descricao"
              name="descricao"
              value={livro.descricao}
              onChange={handleInputChange}
              rows={4}
              className="text-black mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
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
            <label htmlFor="livroFisico" className="text-lg font-medium text-black">Livro Físico</label>
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
            <label htmlFor="livroDigital" className="text-lg font-medium text-black">Livro Digital</label>
          </div>

          {/* Quantidade de Downloads */}
          <div className="mb-6">
            <label htmlFor="quantidadeDownloads" className="block text-lg font-medium text-black">Quantidade de Downloads</label>
            <input
              id="quantidadeDownloads"
              type="number"
              name="quantidadeDownloads"
              value={livro.quantidadeDownloads}
              onChange={handleInputChange}
              className="text-black mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
              required
            />
          </div>

          {/* Quantidade em Estoque */}
          <div className="mb-6">
            <label htmlFor="quantidadeEstoque" className="block text-lg font-medium text-black">Quantidade em Estoque</label>
            <input
              id="quantidadeEstoque"
              type="number"
              name="quantidadeEstoque"
              value={livro.quantidadeEstoque}
              onChange={handleInputChange}
              className="text-black mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
              required
            />
          </div>

          {/* Botão de Submissão */}
          <BotaoCadastro
            type="submit"
            className={`w-full py-3 px-6 bg-slate-800 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-slate-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            
          </BotaoCadastro>
        </form>
      </div>

      {/* Toast container para renderizar as notificações */}
      <ToastContainer />
    </div>
  );
};

export default CadastroLivro;
