declare namespace gapi.client {
	interface Calendar {
		colors: {
			get: () => Promise<any>;
		};
	}
	interface GapiClient {
		calendar?: Calendar;
	}
}

interface GapiWindow extends Window {
	gapi: {
		client: gapi.client.GapiClient;
		auth2: any;
	};
}
declare const window: GapiWindow;
