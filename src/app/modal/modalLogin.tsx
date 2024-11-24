"use client";

import React, { useState, useEffect } from "react";
import { api } from "../api/apiCentral";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import BotaoX from '../components/common/botaoX';  // Importando o BotaoX

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalLogin: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recupera o usuário do localStorage ao carregar a aplicação
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData); // Atualiza o contexto com os dados salvos
      if (userData.tipoUsuario === "CLIENTE") {
        router.push("/cliente");
      } else if (userData.tipoUsuario === "FUNCIONARIO") {
        router.push("/funcionario");
      }
    }
  }, [setUser, router]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await api.post("/login", null, {
        params: {
          username: username,
          senha: password,
        },
      });
  
      const userData = response.data;
  
      // Salva o usuário no contexto e no localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
  
      // Redireciona com base no tipo de usuário
      const tipoUsuario = userData.tipoUsuario;
      if (tipoUsuario === "CLIENTE") {
        router.push("/cliente");
      } else if (tipoUsuario === "FUNCIONARIO") {
        router.push("/funcionario");
      } else {
        console.error("Tipo de usuário inválido:", tipoUsuario);
      }
  
      onClose(); // Fecha o modal após login
    } catch (err: any) {
      // Verifica se o erro contém uma resposta da API
      if (err.response) {
        // Aqui lidamos com os erros que vieram da API
        const statusCode = err.response.status;
        let errorMessage = "Erro desconhecido.";
  
        switch (statusCode) {
          case 400:
            errorMessage = "Campos inválidos. Por favor, preencha todos os campos corretamente.";
            break;
          case 401:
            errorMessage = err.response.data || "Credenciais inválidas ou Usuário inativo.";
            break;
          case 404:
            errorMessage = err.response.data || "Usuário não encontrado.";
            break;
          case 500:
            errorMessage = "Erro interno no servidor. Tente novamente mais tarde.";
            break;
          default:
            errorMessage = err.response.data.message || "Erro desconhecido.";
        }
  
        setError(errorMessage); // Define a mensagem de erro para ser exibida
      } else if (err.request) {
        // Se não houve resposta da API
        setError("Erro de comunicação com o servidor. Tente novamente.");
      } else {
        // Qualquer outro tipo de erro
        setError("Erro desconhecido. Por favor, tente novamente.");
      }
    } finally {
      setLoading(false); // Desativa o estado de carregamento independentemente do sucesso ou falha
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-96 shadow-lg animate-scaleUp flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
          {/* Substituindo o botão de fechar pelo BotaoX */}
          <BotaoX onClose={onClose} />
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border rounded-lg text-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ color: "black" }}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border rounded-lg text-lg border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ color: "black" }}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <img src="/imagens/olho-fechado.ico" alt="Ocultar senha" width="20" height="20" />
              ) : (
                <img src="/imagens/olho-aberto.ico" alt="Mostrar senha" width="20" height="20" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="p-3 text-white rounded-lg text-lg hover:bg-indigo-700 transition-colors"
            style={{ backgroundColor: "rgb(2 6 23)" }}
            disabled={loading}
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ModalLogin;
