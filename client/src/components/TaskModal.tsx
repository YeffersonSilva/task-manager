import React, { useState, useContext, useEffect } from "react";
import { ITask } from "../types/Task";
import { TaskContext } from "../contex/TaskContext";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: ITask;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
  const { createTask, updateTask } = useContext(TaskContext);
  const [formData, setFormData] = useState<ITask>({
    title: "",
    description: "",
    priority: "low",
    completed: false,
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "low",
        completed: false,
      });
    }
  }, [task, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      const { checked } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task && task._id) {
      await updateTask({ ...formData, _id: task._id });
    } else {
      await createTask(formData);
    }
    setFormData({
      title: "",
      description: "",
      priority: "low",
      completed: false,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <form
        className="w-full max-w-md p-6 bg-white rounded shadow-md"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 className="mb-4 text-xl font-bold">
          {task ? "Editar Tarefa" : "Adicionar Tarefa"}
        </h2>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-1">
            Título
          </label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="priority" className="block mb-1">
            Prioridade
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>
        <div className="flex items-center mb-4">
          <input
            id="completed"
            type="checkbox"
            name="completed"
            checked={formData.completed || false}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="completed">Concluída</label>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: "",
                description: "",
                priority: "low",
                completed: false,
              });
              onClose();
            }}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-purple-600 rounded"
          >
            {task ? "Atualizar" : "Criar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskModal;
