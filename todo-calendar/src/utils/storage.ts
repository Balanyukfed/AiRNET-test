export const loadTasks = (): { [key: string]: {text: string, completed: boolean}[] } => {
  const data = localStorage.getItem("tasks");
  return data ? JSON.parse(data) : {};
};

export const saveTasks = (tasks: { [key: string]: {text: string, completed: boolean}[] }) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};
