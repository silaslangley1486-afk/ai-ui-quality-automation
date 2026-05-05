export type MessageRole = 'user' | 'assistant';

export type MessageState = 
	| 'success'
	| 'error'
	| 'loading'
	| 'fallback'
	| 'unsupported';

export type Message = {
	id: string;
	role: MessageRole;
	content: string;
	state?: MessageState;
	replyToMessageId?: string;
};
