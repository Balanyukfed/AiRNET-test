import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {loadTasks, saveTasks} from "../utils/storage";

const Calendar: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<null | number>(null);
  const [tasks, setTasks] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  const closeModal = () => {
    setSelectedDay(null);
  };

  const addTask = (task: string) => {
    if (selectedDay !== null) {
      const dayTasks = tasks[selectedDay] || [];
      const newTasks = { ...tasks, [String(selectedDay)]: [...dayTasks, task] };
      setTasks(newTasks);
      saveTasks(newTasks);
    }
  };

  return (
    <div className="calendar">
      {Array.from({ length: 30 }, (_, i) => (
        <button key={i} onClick={() => handleDayClick(i + 1)}>
          {i + 1}
        </button>
      ))}
      <Modal isOpen={selectedDay !== null} onRequestClose={closeModal}>
        <h2>Список задач на {selectedDay} день</h2>
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTask(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
        <ul>
            {selectedDay !== null && tasks[selectedDay]?.map((task, index) => (
                <li key={index}>{task}</li>
            ))}
        </ul>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default Calendar;
