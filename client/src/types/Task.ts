export interface ITask {
  _id?: string;
  title: string;
  description?: string;
  dueDate?: Date;
  status?: "active" | "inactive";
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  user?: string;
}
