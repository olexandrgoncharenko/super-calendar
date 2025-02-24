import { useMemo } from 'react';
import { getNumberOfDaysInMonth } from '../utils/getNumberOfDaysInMonth';
import { getFirstDayOfMonth } from '../utils/getFirstDayOfMonth';
import { MonthWievDate } from '../types/MonthViewDate';

export const useGetDatesForCalendar = (
	activeYear: number,
	activMonth: number
): MonthWievDate[] => {
	return useMemo(() => {
		const numberOfDaysInCurrentMonth = getNumberOfDaysInMonth(
			activeYear,
			activMonth
		);
		const firstDayOfCurrentMonth = getFirstDayOfMonth(
			activeYear,
			activMonth
		);
		const daysBeforeFirstMonthDay = (firstDayOfCurrentMonth + 6) % 7;
		const daysInPreviousMonth = getNumberOfDaysInMonth(
			activeYear,
			activMonth - 1
		);
		const daysToDisplay: MonthWievDate[] = [];

		const addDays = (
			year: number,
			month: number,
			startDay: number,
			endDay: number,
			isCurrentMonth: boolean
		) => {
			for (let i = startDay; i <= endDay; i++) {
				const date = new Date(year, month, i);
				daysToDisplay.push({
					date,
					day: i,
					isCurrentMonth,
				});
			}
		};
		// Для предыдущего месяца
		addDays(
			activMonth === 0 ? activeYear - 1 : activeYear,
			activMonth === 0 ? 11 : activMonth - 1,
			daysInPreviousMonth - daysBeforeFirstMonthDay + 1,
			daysInPreviousMonth,
			false
		);
		// Для текущего месяца
		addDays(activeYear, activMonth, 1, numberOfDaysInCurrentMonth, true);
		// // Для следующего месяца
		const remainingDays = 42 - daysToDisplay.length;
		addDays(
			activMonth === 11 ? activeYear + 1 : activeYear,
			activMonth === 11 ? 0 : activMonth + 1, // для января (если месяц декабрь)
			1,
			remainingDays,
			false
		);
		return daysToDisplay;
	}, [activeYear, activMonth]);
};
