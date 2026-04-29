export type MessageRole = 'user' | 'assistant';
export type MessageState = 'success' | 'error';

export type Message = {
	id: string;
	role: MessageRole;
	content: string;
	state?: MessageState;
	replyToMessageId?: string;
};

export const WELCOME_MESSAGE: Message = {
	id: 'assistant-welcome',
	role: 'assistant',
	content: 'Hello! I am a general AI assistant. Ask me anything and I will reply with a sample response.',
	state: 'success',
};
