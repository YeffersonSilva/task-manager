// src/context/TaskContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { ITask } from "../types/Task";
import { AuthContext } from "./AuthContext";

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
    if (!user) return; // Si no hay usuario, no buscar tareas.
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(Array.isArray(data) ? data : data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const createTask = async (task: ITask) => {
    try {
      const response = await fetch(`${API_URL}/task/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating task:', errorData.message);
        // Muestra el error en el frontend si es necesario
        return;
      }
      
      await fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };
  

  const updateTask = async (task: ITask) => {
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
  };

  const deleteTask = async (id: string) => {
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
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
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
