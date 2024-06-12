import React from 'react';

const Calendar: React.FC = () => {
  return (
    <div className="calendar">
      {Array.from({ length: 30 }, (_, i) => (
        <button key={i}>{i + 1}</button>
      ))}
    </div>
  );
};

export default Calendar;