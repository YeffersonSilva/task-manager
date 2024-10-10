import React, { useState, useContext } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";
import { TaskContext } from "../contex/TaskContext";
import { AuthContext } from "../contex/AuthContext";
import { ITask } from "../types/Task";
import { RiAddLine } from "react-icons/ri";

// Mapa de traducción de prioridades
const priorityMap: Record<string, string> = {
  todas: "", // Esto permitirá que "todas" muestre todas las prioridades.
  baixa: "low",
  média: "medium",
  alta: "high",
};

const Tasks: React.FC = () => {
  const {
    tasks,
    priorityFilter,
    completionFilter,
    searchTerm,
  } = useContext(TaskContext);
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | undefined>();

  const openModalForAdd = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const openModalForEdit = (task: ITask) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Filtrado de tareas basado en prioridad, estado de completitud y término de búsqueda
  const filteredTasks = tasks.filter((task) => {
    const mappedPriority = priorityMap[priorityFilter.toLowerCase()];
    const matchesPriority =
      priorityFilter === "todas" || task.priority === mappedPriority;

    const matchesCompletion =
      completionFilter === "todas" ||
      (completionFilter === "concluída" && task.completed) ||
      (completionFilter === "pendente" && !task.completed);

    const matchesSearchTerm =
      searchTerm === "" ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPriority && matchesCompletion && matchesSearchTerm;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-scroll bg-gray-100">
        <Header userName={user?.name || "Usuário"} />
        {/* Lista de Tarefas */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Suas Tarefas</h2>
            <button
              onClick={openModalForAdd}
              className="flex items-center px-4 py-2 text-white transition duration-300 transform rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-purple-700 hover:shadow-xl hover:scale-105"
            >
              <RiAddLine className="mr-2" /> Adicionar Tarefa
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskItem key={task._id} task={task} onEdit={openModalForEdit} />
              ))
            ) : (
              <p className="text-center text-gray-500">Nenhuma tarefa encontrada.</p>
            )}
          </div>
        </section>
      </main>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
      />
    </div>
  );
};

export default Tasks;
