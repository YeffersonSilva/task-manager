import React, { createContext, useState, useEffect, useContext } from "react";
import { ITask } from "../types/Task";
import { AuthContext } from "./AuthContext";

// Definición de la interfaz para el contexto
interface TaskContextProps {
  tasks: ITask[];
  fetchTasks: () => Promise<void>;
  createTask: (task: ITask) => Promise<void>;
  updateTask: (task: ITask) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  priorityFilter: string;
  setPriorityFilter: React.Dispatch<React.SetStateAction<string>>;
  completionFilter: string;
  setCompletionFilter: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

// Creación del contexto con valores predeterminados
export const TaskContext = createContext<TaskContextProps>({
  tasks: [],
  fetchTasks: async () => {},
  createTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  priorityFilter: "todas",
  setPriorityFilter: () => {},
  completionFilter: "todas",
  setCompletionFilter: () => {},
  searchTerm: "",
  setSearchTerm: () => {},
});

// Proveedor del contexto para encapsular los componentes que lo usan
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string>("todas");
  const [completionFilter, setCompletionFilter] = useState<string>("todas");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { user } = useContext(AuthContext); 
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchTasks = async () => {
    if (!user) return; 

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        if (Array.isArray(data)) {
          setTasks(data);
        } else if (Array.isArray(data.tasks)) {
          setTasks(data.tasks);
        } else {
          console.error("Unexpected data structure:", data);
        }
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user, API_URL]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        fetchTasks,
        createTask: async (task) => {
          try {
            const response = await fetch(`${API_URL}/task/create`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(task),
            });
            if (response.ok) {
              await fetchTasks();
            }
          } catch (error) {
            console.error("Error creating task:", error);
          }
        },
        updateTask: async (task) => {
          try {
            const response = await fetch(`${API_URL}/task/${task._id}`, {
              method: "PATCH",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(task),
            });
            if (response.ok) {
              await fetchTasks();
            }
          } catch (error) {
            console.error("Error updating task:", error);
          }
        },
        deleteTask: async (id) => {
          try {
            const response = await fetch(`${API_URL}/task/${id}`, {
              method: "DELETE",
              credentials: "include",
            });
            if (response.ok) {
              await fetchTasks();
            }
          } catch (error) {
            console.error("Error deleting task:", error);
          }
        },
        priorityFilter,
        setPriorityFilter,
        completionFilter,
        setCompletionFilter,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
