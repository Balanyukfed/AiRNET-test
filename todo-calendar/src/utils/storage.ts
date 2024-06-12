export const loadTasks = ():{ [key: string]: string[] } => {
    const data = localStorage.getItem('tasks');
    return data ? JSON.parse(data) : {};
}

export const saveTasks = (tasks : { [key: string]: string[] }) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}