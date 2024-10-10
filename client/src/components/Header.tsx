import React, { useContext } from "react";
import { RiSearch2Line } from "react-icons/ri";
import { TaskContext } from "../contex/TaskContext";

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  const { searchTerm, setSearchTerm } = useContext(TaskContext);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-2xl md:text-3xl font-bold">
        Faza sua Tarefa, <span className="text-primary-100">{userName}</span>
      </h1>
      <form className="w-full md:w-auto">
        <div className="relative">
          <RiSearch2Line className="absolute top-1/2 -translate-y-1/2 left-2" />
          <input
            type="text"
            className="bg-gray-200 outline-none py-2 pl-8 pr-4 rounded-xl w-full md:w-auto"
            placeholder="Search for tasks"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </form>
    </header>
  );
};

export default Header;
