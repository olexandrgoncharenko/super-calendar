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
	// backgroundColor?: string; // Цвет фона (если переопределён)
	// foregroundColor?: string; // Цвет текста (если переопределён)
	colorId?: string; // ID цвета события
	// [key: string]: any;
}
