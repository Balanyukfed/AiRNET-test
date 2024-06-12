import React, { useState } from "react";
import Modal from "react-modal";

const Calendar: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<null | number>(null);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  const closeModal = () => {
    setSelectedDay(null);
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
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default Calendar;
