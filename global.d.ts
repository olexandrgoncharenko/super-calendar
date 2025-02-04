// interface OAuth2TokenResponse {
//     access_token?: string;
//     expires_in?: number;
//     error?: string;
// }

export declare global {
	interface Window {
		google?: {
			accounts: {
				id: {
					initialize: (config: {
						client_id: string;
						callback: (response: { credential: string }) => void;
					}) => void;
					// renderButton: (
					//     container: HTMLElement,
					//     options: { theme: string; size: string }
					// ) => void;
					prompt: () => void;
				};
				oauth2?: {
					initTokenClient: (config: {
						client_id: string;
						scope: string;
						callback: (response: OAuth2TokenResponse) => void;
						prompt?: string;
					}) => {
						requestAccessToken: (options?: {
							prompt?: string;
						}) => void;
					};
				};
			};
		};
	}
}

// export declare global {
// 	interface Window {
// 		google?: {
// 			accounts: {
// 				id: {
// 					initialize: (config: {
// 						client_id: string;
// 						callback: (response: { credential: string }) => void;
// 					}) => void;
// 					renderButton: (
// 						container: HTMLElement,
// 						options: { theme: string; size: string }
// 					) => void;
// 					prompt: () => void;
// 				};
// 				oauth2?: {
// 					initTokenClient: (config: {
// 						client_id: string;
// 						scope: string;
// 						// redirect_uri: string;
// 						callback: (response: {
// 							access_token: string;
// 							refresh_token: string;
// 							expires_in: number;
// 						}) => void;
// 						// access_type: string;
// 						prompt?: string;
// 					}) => {
// 						requestAccessToken: (options?: {
// 							prompt?: string;
// 						}) => void;
// 					};
// 				};
// 			};
// 		};
// 	}
// }

// export declare global {
// 	interface Window {
// 		google?: {
// 			accounts: {
// 				id: {
// 					initialize: (config: {
// 						client_id: string;
// 						callback: (response: { credential: string }) => void;
// 					}) => void;
// 					renderButton: (
// 						container: HTMLElement,
// 						options: { theme: string; size: string }
// 					) => void;
// 					prompt: () => void;
// 				};
// 			};
// 		};
// 	}
// }

// declare namespace google {
// 	namespace accounts {
// 		namespace oauth2 {
// 			function initTokenClient(config: {
// 				client_id: string;
// 				scope: string;
// 				callback: (response: { access_token: string }) => void;
// 			}): {
// 				requestAccessToken: (options?: { prompt?: string }) => void;
// 			};
// 		}
// 	}
// }
