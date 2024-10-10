import React, { useContext } from "react";
import { TaskContext } from "../contex/TaskContext";
import { RadialBarChart, RadialBar, Legend } from "recharts";

const RadialChart: React.FC = () => {
  const { tasks } = useContext(TaskContext);

  // Asegúrate de que tasks esté definido antes de usarlo
  if (!tasks) {
    return <div>Cargando tareas...</div>;
  }

  // Calcular tareas completadas y pendientes
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  // Datos para la gráfica
  const data = [
    { name: "Completed", value: completedTasks, fill: "#8BCE89" },
    { name: "Pending", value: pendingTasks, fill: "#EB4E31" },
  ];

  return (
    <RadialBarChart
      width={300}
      height={300}
      innerRadius="10%"
      outerRadius="80%"
      data={data}
      startAngle={90}
      endAngle={-270}
    >
      <RadialBar
        label={{ position: "insideStart", fill: "#fff" }} // Ajusta la posición y estilo de las etiquetas
        background
        dataKey="value"
      />
      <Legend
        iconSize={10}
        layout="horizontal"
        verticalAlign="bottom"
        align="center"
      />
    </RadialBarChart>
  );
};

export default RadialChart;
