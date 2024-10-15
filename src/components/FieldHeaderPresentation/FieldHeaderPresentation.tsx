import { CalendarEvent } from './../../components/Field/DayOrWeekView/DayOrWeekView';

import React, { useEffect } from 'react';

interface FieldHeaderProps {
	fullDayEvents: CalendarEvent[];
}

const FieldHeaderPresentation: React.FC<FieldHeaderProps> = ({
	fullDayEvents,
}) => {
	console.log(`fullDayEvents: ${JSON.stringify(fullDayEvents)}`);
	const sortEventsByStartDate = (events: CalendarEvent[]) => {
		return events.sort((a, b) => {
			// Получаем дату начала для события "a" с проверкой на наличие данных
			const startA = new Date(
				a.start.dateTime ?? a.start.date ?? '1970-01-01T00:00:00'
			);
			// Получаем дату начала для события "b" с проверкой на наличие данных
			const startB = new Date(
				b.start.dateTime ?? b.start.date ?? '1970-01-01T00:00:00'
			);

			// Сравниваем даты
			return startA.getTime() - startB.getTime();
		});
	};

	useEffect(() => {
		const sortedEvents = sortEventsByStartDate(fullDayEvents);
		console.log(sortedEvents);
	}, [fullDayEvents]);

	// Пример использования:

	return <div>FHP</div>;
};

export default FieldHeaderPresentation;
