import React, { useState } from 'react';
import styles from './Calendar.module.css';
import MonthFilter from '../MonthFilter/MonthFilter';

const Calendar = () => {
    const dateNow = new Date();
    const currentYear = dateNow.getFullYear();
    const currentMonth = dateNow.getMonth();
    const currentDate = dateNow.getDate();

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfCurrentMonth = getFirstDayOfMonth(
        currentYear,
        currentMonth
    );

    const startDay = (firstDayOfCurrentMonth + 6) % 7;
    const daysInPreviousMonth = getDaysInMonth(currentYear, currentMonth - 1);

    const [selectedDate, setSelectedDate] = useState(null);

    const handleDayClick = (date) => {
        setSelectedDate(new Date(date));
    };

    const calendarDays = [];

    console.log(calendarDays);

    for (let i = startDay; i > 0; i--) {
        const date = new Date(
            currentYear,
            currentMonth - 1,
            daysInPreviousMonth - i + 1
        );
        calendarDays.push({
            date,
            day: daysInPreviousMonth - i + 1,
            isCurrentMonth: false,
        });
    }
    for (let i = 1; i <= daysInCurrentMonth; i++) {
        const date = new Date(currentYear, currentMonth, i);
        calendarDays.push({
            date,
            day: i,
            isCurrentMonth: true,
        });
    }
    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(currentYear, currentMonth + 1, i);
        calendarDays.push({
            date,
            day: i,
            isCurrentMonth: false,
        });
    }

    return (
        <>
            <MonthFilter dateNow={dateNow} currentYear={currentYear} />

            {/* <h2 className={styles.title}>
                {dateNow.toLocaleString('default', { month: 'long' })}{' '}
                <span>{currentYear}</span>
            </h2> */}
            <div className={styles.calendar}>
                <div className={styles.weekdays}>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                    <div>Sun</div>
                </div>
                <div className={styles.days}>
                    {calendarDays.map((day, index) => (
                        <div
                            key={index}
                            className={`${styles.day} ${
                                day.isCurrentMonth
                                    ? styles.currentMonth
                                    : styles.otherMonth
                            }`}
                            onClick={() => handleDayClick(day.date)}
                        >
                            {day.day}
                        </div>
                    ))}
                </div>
            </div>
            {selectedDate && (
                <p style={{ color: '#fff' }}>
                    Выбранная дата: {selectedDate.toLocaleDateString()}
                </p>
            )}
        </>
    );
};

export default Calendar;
