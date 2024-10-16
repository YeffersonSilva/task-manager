import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contex/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Handles the login form submission.
   * Uses the login function from AuthContext to authenticate the user.
   * Navigates to the '/tasks' page upon successful login.
   * Displays an error message if the login fails.
   */

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      setError(null);
      navigate("/tasks");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-gray-400">
      <div className="w-full max-w-lg overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="p-8">
          <h2 className="mb-6 text-3xl font-bold text-center">Entrar</h2>
          <p className="mb-4 text-center text-gray-500">
            Use seu e-mail e senha para acessar
          </p>
          {/* Display error message if there is any */}

          {error && (
            <div role="alert" className="mb-4 text-red-500">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-gray-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 text-white transition duration-300 rounded-lg shadow-md bg-gradient-to-r from-purple-500 to-purple-700 hover:shadow-lg"
            >
              Entrar
            </button>
          </form>
        </div>
        <div className="py-4 text-center bg-gray-100">
          <p className="text-gray-600">
            Não tem uma conta?{" "}
            <button
              onClick={goToRegister}
              className="text-primary-500 hover:underline"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
