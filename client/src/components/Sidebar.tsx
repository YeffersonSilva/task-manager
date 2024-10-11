import React, { useState, useContext } from "react";
import {
  RiMenuFill,
  RiCloseFill,
  RiLogoutBoxLine,
  RiFilter3Line,
  RiFilterLine,
} from "react-icons/ri";
import { TaskContext } from "../contex/TaskContext";
import { AuthContext } from "../contex/AuthContext";

// Definition of the interface for the context

const Sidebar: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const {
    setPriorityFilter,
    priorityFilter,
    setCompletionFilter,
    completionFilter,
  } = useContext(TaskContext);
  const { user, logout } = useContext(AuthContext);

  const priorities = ["Todas", "Baixa", "Média", "Alta"];
  const completions = ["Todas", "Concluída", "Pendente"];

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <div
        className={`bg-[#7209b7] min-h-screen h-full fixed lg:static w-[250px] transition-all z-50 duration-300 shadow-lg flex flex-col font-sans ${
          showMenu ? "left-0" : "-left-full"
        }`}
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {/* Perfil */}
        <div className="flex flex-col items-center justify-center gap-2 p-8 text-white">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#7209b7] text-2xl font-bold shadow-md">
            {user ? getInitials(user.name) : "U"}
          </div>
          <h1 className="text-xl font-semibold">{user ? user.name : "Usuário"}</h1>
        </div>
        {/* Filtros de Prioridade */}
        <nav className="flex-grow px-4 text-white">
          <h2 className="flex items-center mb-3 font-medium tracking-wide uppercase text-md">
            <RiFilter3Line className="mr-2" /> Prioridade
          </h2>
          <ul className="mb-6 space-y-2">
            {priorities.map((level) => (
              <li key={level}>
                <button
                  onClick={() => setPriorityFilter(level.toLowerCase())}
                  className={`w-full flex items-center py-2 px-3 rounded-md hover:bg-[#9a4fd3] transition-all duration-200 ease-in-out shadow-sm ${
                    priorityFilter === level.toLowerCase()
                      ? "bg-[#6a0eaa]"
                      : "bg-[#7209b7]"
                  } text-white`}
                >
                  <RiFilterLine className="mr-2" /> {level}
                </button>
              </li>
            ))}
          </ul>
          {/* Separador */}
          <div className="border-t border-[#9a4fd3] my-4"></div>
          {/* Filtros de Estado de Conclusão */}
          <h2 className="flex items-center mb-3 font-medium tracking-wide uppercase text-md">
            <RiFilter3Line className="mr-2" /> Status
          </h2>
          <ul className="mb-4 space-y-2">
            {completions.map((status) => (
              <li key={status}>
                <button
                  onClick={() => setCompletionFilter(status.toLowerCase())}
                  className={`w-full flex items-center py-2 px-3 rounded-md hover:bg-[#9a4fd3] transition-all duration-200 ease-in-out shadow-sm ${
                    completionFilter === status.toLowerCase()
                      ? "bg-[#6a0eaa]"
                      : "bg-[#7209b7]"
                  } text-white`}
                >
                  <RiFilterLine className="mr-2" /> {status}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {/* Botão de Logout */}
        <div className="px-4 mt-auto mb-6">
          <button
            onClick={logout}
            className="flex items-center justify-center w-full px-4 py-2 font-medium text-white transition duration-300 transform rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-purple-700 hover:shadow-xl hover:scale-105"
          >
            <RiLogoutBoxLine className="mr-2" /> Sair
          </button>
        </div>
      </div>
      {/* Botão do Menu Móvel */}
      <button
  aria-label="Toggle menu"
  onClick={() => setShowMenu(!showMenu)}
  className="lg:hidden fixed right-4 bottom-4 text-2xl bg-[#7209b7] p-2.5 rounded-full text-white shadow-lg hover:bg-[#9a4fd3] transition-all duration-200 ease-in-out z-50"
  style={{ fontFamily: "Arial, sans-serif" }}
>
  {showMenu ? <RiCloseFill /> : <RiMenuFill />}
</button>

    </>
  );
};

export default Sidebar;
