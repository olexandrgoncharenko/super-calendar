export const getDatesForWeek = (date: string): string[] => {
	const dateNow = new Date(date);
	dateNow.setHours(0, 0, 0, 0);
	const numberOfDayWeek = dateNow.getDay();
	const daysFromMonday = (numberOfDayWeek + 6) % 7;
	const mondayDate = new Date(dateNow);
	mondayDate.setDate(dateNow.getDate() - daysFromMonday);
	const weekDates: string[] = [];

	for (let i = 1; i <= 7; i++) {
		const nextDate = new Date(mondayDate);
		nextDate.setDate(mondayDate.getDate() + i);
		weekDates.push(nextDate.toISOString().split('T')[0]);
	}

	return weekDates;
};
