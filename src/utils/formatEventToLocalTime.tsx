// import { DateTime } from 'luxon';
// import { FetchedEvent } from '../types/FetchedEvent';

// export const formatEventToLocalTime = (event: FetchedEvent) => {
// 	let startDateTime, endDateTime;

// 	// Обрабатываем начало события
// 	if (event.start.dateTime) {
// 		startDateTime = DateTime.fromISO(
// 			event.start.dateTime,
// 			{ zone: event.start.timeZone || 'UTC' } // Если timeZone отсутствует, используем UTC
// 		).toLocal();
// 	} else if (event.start.date) {
// 		startDateTime = DateTime.fromISO(event.start.date).toLocal();
// 	}

// 	// Обрабатываем конец события
// 	if (event.end.dateTime) {
// 		endDateTime = DateTime.fromISO(event.end.dateTime, {
// 			zone: event.end.timeZone || 'UTC',
// 		}).toLocal();
// 	} else if (event.end.date) {
// 		endDateTime = DateTime.fromISO(event.end.date).toLocal();
// 	}

// 	// Возвращаем объект события с локальными датами
// 	return {
// 		id: event.id,
// 		summary: event.summary || 'Без названия',
// 		start: startDateTime
// 			? startDateTime.toFormat('yyyy-MM-dd HH:mm:ss') // Преобразование в строку
// 			: event.start,
// 		end: endDateTime
// 			? endDateTime.toFormat('yyyy-MM-dd HH:mm:ss') // Преобразование в строку
// 			: event.end,
// 	};
// };

// import { DateTime } from 'luxon';
// import { FetchedEvent } from '../types/FetchedEvent';

// /**
//  * Форматирование события в локальное время.
//  * @param event - Событие с сервера Google Calendar.
//  * @param format - Формат для вывода времени (по умолчанию 'yyyy-MM-dd HH:mm:ss').
//  * @returns Объект с локальными датами события.
//  */
// export const formatEventToLocalTime = (
// 	event: FetchedEvent,
// 	format: string = 'yyyy-MM-dd HH:mm:ss'
// ) => {
// 	let startDateTime, endDateTime;

// 	try {
// 		// Обрабатываем начало события
// 		if (event.start?.dateTime) {
// 			startDateTime = DateTime.fromISO(event.start.dateTime, {
// 				zone: event.start.timeZone || 'UTC',
// 			}).toLocal();
// 		} else if (event.start?.date) {
// 			// Для событий "весь день" оставляем дату
// 			startDateTime = DateTime.fromISO(event.start.date).toLocal();
// 		}

// 		// Обрабатываем конец события
// 		if (event.end?.dateTime) {
// 			endDateTime = DateTime.fromISO(event.end.dateTime, {
// 				zone: event.end.timeZone || 'UTC',
// 			}).toLocal();
// 		} else if (event.end?.date) {
// 			// Для событий "весь день" оставляем дату
// 			endDateTime = DateTime.fromISO(event.end.date).toLocal();
// 		}
// 	} catch (error) {
// 		console.error(
// 			`Ошибка обработки события ID ${event.id || 'неизвестно'}:`,
// 			error
// 		);
// 	}

// 	// Проверяем результат и возвращаем локализованные данные
// 	return {
// 		id: event.id || 'unknown',
// 		summary: event.summary || 'Без названия',
// 		start: startDateTime
// 			? startDateTime.toFormat(format)
// 			: 'Дата не указана',
// 		end: endDateTime ? endDateTime.toFormat(format) : 'Дата не указана',
// 	};
// };
import { DateTime } from 'luxon';
import { FetchedEvent } from '../types/FetchedEvent';

/**
 * Форматирование события в локальное время.
 * @param event - Событие с сервера Google Calendar.
 * @param format - (Необязательно) Формат для вывода времени.
 * @returns Объект с локальными датами события.
 */
export const formatEventToLocalTime = (
	event: FetchedEvent,
	format?: string
) => {
	let startDateTime, endDateTime;

	// Устанавливаем формат по умолчанию, если он не передан
	const defaultFormat = "yyyy-MM-dd'T'HH:mm:ss";

	try {
		// Обрабатываем начало события
		if (event.start?.dateTime) {
			startDateTime = DateTime.fromISO(event.start.dateTime, {
				zone: event.start.timeZone || 'UTC',
			}).toLocal();
		} else if (event.start?.date) {
			// Для событий "весь день" оставляем дату
			startDateTime = DateTime.fromISO(event.start.date).toLocal();
		}

		// Обрабатываем конец события
		if (event.end?.dateTime) {
			endDateTime = DateTime.fromISO(event.end.dateTime, {
				zone: event.end.timeZone || 'UTC',
			}).toLocal();
		} else if (event.end?.date) {
			// Для событий "весь день" оставляем дату
			endDateTime = DateTime.fromISO(event.end.date).toLocal();
		}
	} catch (error) {
		console.error(
			`Ошибка обработки события ID ${event.id || 'неизвестно'}:`,
			error
		);
	}

	// Проверяем результат и возвращаем локализованные данные
	return {
		id: event.id || 'unknown',
		summary: event.summary || 'Без названия',
		start: startDateTime
			? startDateTime.toFormat(format || defaultFormat)
			: 'Дата не указана',
		end: endDateTime
			? endDateTime.toFormat(format || defaultFormat)
			: 'Дата не указана',
	};
};
