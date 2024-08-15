import { getNumberOfDaysInMonth } from './../utils/getNumberOfDaysInMonth';
import { getFirstDayOfMonth } from './../utils/getFirstDayOfMonth';

interface DaysToDisplay {
	date: Date;
	day: number;
	isCurrentMonth: boolean;
}

export const useDaysToShowInCalendar = (date: Date): DaysToDisplay[] => {
	const currentYear = date.getFullYear();
	const currentMonth = date.getMonth();
	const numberOfDaysInCurrentMonth = getNumberOfDaysInMonth(
		currentYear,
		currentMonth
	);
	const firstDayOfCurrentMonth = getFirstDayOfMonth(
		currentYear,
		currentMonth
	);
	const daysBeforeFirstMonthDay = (firstDayOfCurrentMonth + 6) % 7;
	const daysInPreviousMonth = getNumberOfDaysInMonth(
		currentYear,
		currentMonth - 1
	);
	const daysToDisplay: DaysToDisplay[] = [];

	const addDays = (
		year: number,
		month: number,
		startDay: number,
		endDay: number,
		isCurrentMonth: boolean
	) => {
		for (let i = startDay; i <= endDay; i++) {
			const correctedMonth = month < 0 ? 11 : month; // Корректировка для месяца (декабрь, если month < 0)
			const correctedYear = month < 0 ? year - 1 : year; // Корректировка для года (если месяц декабрь)
			const date = new Date(correctedYear, correctedMonth, i);
			daysToDisplay.push({
				date,
				day: i,
				isCurrentMonth,
			});
		}
	};

	addDays(
		currentYear,
		currentMonth === 0 ? 11 : currentMonth - 1, // Корректировка для января
		daysInPreviousMonth - daysBeforeFirstMonthDay + 1,
		daysInPreviousMonth,
		false
	);

	addDays(currentYear, currentMonth, 1, numberOfDaysInCurrentMonth, true);

	const remainingDays = 42 - daysToDisplay.length;
	addDays(
		currentYear,
		currentMonth === 11 ? 0 : currentMonth + 1, // Корректировка для декабря
		1,
		remainingDays,
		false
	);

	return daysToDisplay;
};
