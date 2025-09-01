export interface AIChatSettings {
	nodeLocation?: string;
	claudeLocation?: string;
	debugContext?: boolean;
}

export const DEFAULT_SETTINGS: AIChatSettings = {
	nodeLocation: '',
	claudeLocation: '',
	debugContext: false
}