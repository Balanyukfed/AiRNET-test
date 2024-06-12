import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { loadTasks, saveTasks } from "../utils/storage";
import { isHoliday } from "../utils/holidays";
import { format, getDaysInMonth, startOfMonth, getDay } from "date-fns";

Modal.setAppElement("#root");

const Calendar: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<null | number>(null);
  const [tasks, setTasks] = useState<{
    [key: string]: { text: string; completed: boolean }[];
  }>({});
  const [holidays, setHolidays] = useState<number[]>([]);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  useEffect(() => {
    const year = 2024;
    const month = 5;
    const days = getDaysInMonth(new Date(year, month));
    const daysArray = Array.from({ length: days }, (_, i) => i + 1);
    setDaysInMonth(daysArray);
    setTasks(loadTasks());
    fetchHolidays(year, month);
  }, []);

  const fetchHolidays = async (year: number, month: number) => {
    const holidayDays = [];
    for (let i = 1; i <= getDaysInMonth(new Date(year, month)); i++) {
      const date = format(new Date(year, month, i), "yyyyMMdd");
      if (await isHoliday(date)) {
        holidayDays.push(i);
      }
    }
    setHolidays(holidayDays);
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  const closeModal = () => {
    setSelectedDay(null);
  };

  const addTask = (task: string) => {
    if (selectedDay !== null) {
      const dayTasks = tasks[selectedDay] || [];
      const newTasks = {
        ...tasks,
        [String(selectedDay)]: [...dayTasks, { text: task, completed: false }],
      };
      setTasks(newTasks);
      saveTasks(newTasks);
    }
  };

  const toggleTaskCompleted = (day: number, index: number) => {
    const dayTasks = tasks[day];
    dayTasks[index].completed = !dayTasks[index].completed;
    const newTasks = { ...tasks, [String(day)]: dayTasks };
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const removeTask = (day: number, index: number) => {
    const dayTasks = tasks[day];
    dayTasks.splice(index, 1);
    const newTasks = { ...tasks, [String(day)]: dayTasks };
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const renderWeek = (startDay: number, firstDayOfWeek: number) => {
    const days = [];
    let dayOffset = startDay - firstDayOfMonth;

    for (let i = 0; i < 7; i++) {
      const day = dayOffset + i;
      if (day >= 1 && day <= daysInMonth.length) {
        days.push(
          <button
            key={day}
            onClick={() => handleDayClick(day)}
            className={`calendar__day ${
              holidays.includes(day) ? "calendar__day--holiday" : ""
            }`}
          >
            {day}
          </button>
        );
      } else {
        days.push(
          <div key={i} className="calendar__day calendar__day--empty" />
        );
      }
    }
    return (
      <div className="calendar__week" key={startDay}>
        {days}
      </div>
    );
  };

  const weeks = [];
  const firstDayOfMonth = (getDay(startOfMonth(new Date(2024, 5))) + 6) % 7;
  for (let i = 1; i <= daysInMonth.length; i += 7) {
    weeks.push(renderWeek(i, firstDayOfMonth));
  }

  return (
    <div className="calendar">
      <div className="calendar__grid">{weeks}</div>
      <Modal
        isOpen={selectedDay !== null}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div>
          <h2 className="modal__title">Список задач на {selectedDay} день</h2>
          <div className="modal__input-container">
            <input
              type="text"
              className="modal__input"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTask(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
            <button
              className="modal__add-btn"
              onClick={() => {
                const input = document.querySelector(
                  ".modal__input"
                ) as HTMLInputElement;
                if (input) {
                  addTask(input.value);
                  input.value = "";
                }
              }}
            >
              Добавить
            </button>
          </div>
          <ul className="modal__tasks">
            {selectedDay !== null &&
              tasks[selectedDay]?.map((task, index) => (
                <li
                  key={index}
                  className="modal__task"
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  <span className="modal__task-text">{task.text}</span>
                  <div className="modal__task-bnts">
                    <button
                      onClick={() => toggleTaskCompleted(selectedDay, index)}
                      className={`modal__task-btn ${
                        task.completed ? "modal__task-btn--completed" : ""
                      }`}
                    >
                      {task.completed ? "Отменить" : "Выполнено"}
                    </button>
                    <button
                      onClick={() => removeTask(selectedDay, index)}
                      className="modal__task-btn modal__task-btn--delete"
                    >
                      Удалить
                    </button>
                  </div>
                </li>
              ))}
          </ul>
          <button onClick={closeModal} className="modal__close-btn">
            Закрыть окно
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;
