import type { Message } from '../types/chat';

export const WELCOME_MESSAGE: Message = {
	id: 'assistant-welcome',
	role: 'assistant',
	content: 'Hello! I am a general AI assistant...',
	state: 'success',
};
