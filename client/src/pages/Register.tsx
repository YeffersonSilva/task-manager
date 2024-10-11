import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contex/AuthContext";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  /**
   * Handles the registration form submission.
   * Uses the register function from AuthContext to create a new user.
   * Navigates to the login page upon successful registration.
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register(name, email, password);
      navigate("/login");
    } catch (error: any) {
      alert(error.message || "Registration failed");
    }
  };

  /**
   * Toggles between the login and registration form.
   * Updates the state and navigates to the respective route.
   */
  const toggleLoginRegister = () => {
    setIsLogin(!isLogin);
    navigate(isLogin ? "/register" : "/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-gray-400">
      <div className="w-full max-w-lg overflow-hidden transition-all duration-500 transform bg-white rounded-lg shadow-lg">
        <div className="p-8">
          {/* Display either "Entrar" or "Cadastrar-se" based on the current state */}

          <h2 className="mb-6 text-3xl font-bold text-center">
            {isLogin ? "Entrar" : "Cadastrar-se"}
          </h2>
          <p className="mb-4 text-center text-gray-500">
            {isLogin
              ? "Use seu e-mail e senha para acessar"
              : "Crie sua conta usando seu e-mail"}
          </p>
          {/* Registration form */}

          <form onSubmit={handleRegister}>
            {!isLogin && (
              <div className="mb-4">
                <label className="block mb-2 text-gray-700">Nome</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            {/* Email input field */}

            <div className="mb-4">
              <label className="block mb-2 text-gray-700">E-mail</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-gray-700">Senha</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 text-white transition duration-300 rounded-lg shadow-md bg-gradient-to-r from-purple-500 to-purple-700 hover:shadow-lg"
            >
              {isLogin ? "Entrar" : "Cadastrar-se"}
            </button>
          </form>
        </div>
        <div className="py-4 text-center bg-gray-100">
          <p className="text-gray-600">
            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
            <button
              onClick={toggleLoginRegister}
              className="text-purple-500 hover:underline"
            >
              {isLogin ? "Cadastre-se" : "Entrar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
