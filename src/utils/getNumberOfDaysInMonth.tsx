export const getNumberOfDaysInMonth = (year: number, month: number): number => {
	return new Date(year, month + 1, 0).getDate(); // Возвращает количество дней в месяце
};
