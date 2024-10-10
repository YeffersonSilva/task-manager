import React, { useContext } from "react";
import { TaskContext } from "../contex/TaskContext";

const TaskSidebar: React.FC = () => {
  const { priorityFilter, setPriorityFilter } = useContext(TaskContext);

  const priorities = ["All", "Low", "Medium", "High"];

  return (
    <div className="bg-white p-4 shadow-md h-full">
      <h2 className="text-lg font-bold mb-4">Priority Filters</h2>
      <ul>
        {priorities.map((level) => (
          <li key={level} className="mb-2">
            <button
              onClick={() => setPriorityFilter(level.toLowerCase())}
              className={`w-full text-left py-2 px-4 rounded hover:bg-gray-100 ${
                priorityFilter === level.toLowerCase() ? "bg-gray-200" : ""
              }`}
            >
              {level}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskSidebar;
