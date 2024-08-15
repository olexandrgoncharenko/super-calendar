export const getFirstDayOfMonth = (year: number, month: number): number => {
	return new Date(year, month, 1).getDay(); // Возвращает день недели (0 - воскресенье)
};
