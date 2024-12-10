export interface FetchedEvent {
	id: string;
	summary: string;
	start: {
		dateTime?: string;
		date?: string;
		timeZone?: string;
	};
	end: {
		dateTime?: string;
		date?: string;
		timeZone?: string;
	};
	// [key: string]: any;
}
