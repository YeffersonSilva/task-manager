import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contex/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/tasks");
    } catch (error: any) {
      alert(error.message);
    }
  };


  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary-500 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
