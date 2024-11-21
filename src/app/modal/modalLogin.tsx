"use client";

import React, { useState, useEffect } from "react";
import { api } from "../api/apiCentral";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";

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
      if (err.response) {
        setError(err.response.data.message || "Erro ao fazer login.");
      } else if (err.request) {
        setError("Erro de comunicação com o servidor.");
      } else {
        setError("Erro desconhecido.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-96 shadow-lg animate-scaleUp">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
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
        <button
          onClick={onClose}
          className="mt-4 p-3 bg-transparent border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ModalLogin;
