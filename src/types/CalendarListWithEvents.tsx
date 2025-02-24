import { CalendarEvent } from './CalendarEvent';

export interface CalendarListWithEvents {
	id: string;
	title?: string;
	events: CalendarEvent[];
}
