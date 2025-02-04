import { CalendarEvent } from './CalendarEvent';

export interface CalendarListWithEvents {
	id: string;
	title: string | undefined;
	events: CalendarEvent[];
}
