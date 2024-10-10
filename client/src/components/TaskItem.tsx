import React, { useContext } from "react";
import { ITask } from "../types/Task";
import { FiEdit, FiTrash, FiCheckCircle, FiCircle } from "react-icons/fi";
import { TaskContext } from "../contex/TaskContext";

interface TaskItemProps {
  task: ITask;
  onEdit: (task: ITask) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { deleteTask, updateTask } = useContext(TaskContext);

  const toggleCompleted = async () => {
    await updateTask({ ...task, completed: !task.completed });
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-500";
      case "medium":
        return "border-l-4 border-yellow-500";
      case "low":
        return "border-l-4 border-green-500";
      default:
        return "border-l-4 border-gray-300";
    }
  };

  return (
    <div
      className={`bg-white p-4 rounded shadow flex items-center justify-between ${getPriorityStyles(
        task.priority || "low"
      )}`}
    >
      <div className="flex items-center">
        <button
          aria-label={task.completed ? "mark as incomplete" : "mark as completed"}
          onClick={toggleCompleted}
          className="mr-2"
        >
          {task.completed ? (
            <FiCheckCircle className="text-green-500" />
          ) : (
            <FiCircle className="text-gray-500" />
          )}
        </button>
        <div>
          <h3
            className={`font-bold ${
              task.completed ? "line-through text-gray-500" : "text-gray-800"
            }`}
          >
            {task.title}
          </h3>
          <p className="text-sm text-gray-600">{task.description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button aria-label="edit" onClick={() => onEdit(task)}>
          <FiEdit className="text-gray-600 transition hover:text-gray-800" />
        </button>
        <button aria-label="delete" onClick={() => deleteTask(task._id || "")}>
          <FiTrash className="text-red-500 transition hover:text-red-700" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
