import React from 'react';
import styles from './Week.module.css';

const Week = () => {
  const datesForDisplay = [
    '2024-05-20T21:00:00.000Z',
    '2024-05-21T21:00:00.000Z',
    '2024-05-22T21:00:00.000Z',
    '2024-05-23T21:00:00.000Z',
    '2024-05-24T21:00:00.000Z',
    '2024-05-25T21:00:00.000Z',
    '2024-05-26T21:00:00.000Z',
  ];

  const handleCellClick = (date, time) => {
    console.log(`Выбранная дата: ${date}, время: ${time}`);
  };

  const timeSlots = [
    '00:00-01:00',
    '01:00-02:00',
    '02:00-03:00',
    '03:00-04:00',
    '04:00-05:00',
    '05:00-06:00',
    '06:00-07:00',
    '07:00-08:00',
    '08:00-09:00',
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-13:00',
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
    '17:00-18:00',
    '18:00-19:00',
    '19:00-20:00',
    '20:00-21:00',
    '21:00-22:00',
    '22:00-23:00',
    '23:00-00:00',
  ];

  return (
    <div className={styles.week}>
      <div className={styles.header}>
        <div className={styles.timeHeader}></div>
        <div className={styles.weekdays}>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
      </div>
      <div className={styles.body}>
        {timeSlots.map((timeSlot, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            <div className={styles.time}>{timeSlot}</div>
            <div className={styles.cells}>
              {datesForDisplay.map((dateStr, colIndex) => {
                const date = new Date(dateStr);
                const formattedDate = date.toLocaleDateString();

                return (
                  <div
                    key={colIndex}
                    className={styles.cell}
                    onClick={() => handleCellClick(formattedDate, timeSlot)}
                  >
                    cell
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Week;
