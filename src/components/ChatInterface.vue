<template>
	<div class="chat-interface">
		<section class="chat-section" aria-labelledby="chat-heading">
			<div class="chat-header">
				<div class="chat-header-info">
					<h2 id="chat-heading">Mock AI Assistant</h2>
					<p class="chat-description">
						Send prompts and receive responses. Use the toolbar to configure the assistant behavior.
					</p>
				</div>

				<div class="chat-toolbar">
					<div class="control-group">
						<label for="model-select">Model:</label>
						<select id="model-select" class="model-select" v-model="selectedModel">
							<option value="model-v1">Model V1</option>
							<option value="model-v2">Model V2</option>
							<option value="model-v3">Model V3</option>
						</select>
					</div>

					<label class="error-toggle">
						<input type="checkbox" v-model="errorSimulationEnabled" />
						Enable error simulation
					</label>

					<button class="clear-button" type="button" @click="clearConversation">
						Clear conversation
					</button>

					<button
						type="button"
						class="settings-button"
						@click="settingsOpen = !settingsOpen"
						aria-label="Toggle settings"
						:aria-expanded="settingsOpen"
					>
						⚙️
					</button>
				</div>
			</div>

			<div v-if="settingsOpen" class="settings-panel" role="region" aria-labelledby="settings-heading">
				<h3 id="settings-heading">Settings</h3>
				<p class="settings-note">Additional preferences can be configured here.</p>
				<button type="button" class="close-settings" @click="settingsOpen = false">
					Close settings
				</button>
			</div>

			<div role="log" aria-live="polite" aria-label="Conversation history">
				<ul class="conversation-list" data-testid="message-list">
					<li
						v-for="message in messages"
						:key="message.id"
						:class="['message', message.role, message.state]"
						:aria-label="message.role === 'assistant' ? 'Assistant message' : 'User message'"
						:data-testid="message.role === 'assistant' ? 'assistant-message' : 'user-message'"
					>
						<div class="message-meta">
							<span class="message-role">
								{{ message.role === 'assistant' ? 'Assistant' : 'You' }}
							</span>

							<span v-if="message.state === 'error'" class="message-state">Error</span>
						</div>

						<p>{{ message.content }}</p>

						<button
							v-if="message.state === 'error'"
							type="button"
							class="retry-button"
							@click="retryMessage(message.id)"
						>
							Retry
						</button>
					</li>
				</ul>
			</div>
		</section>

		<form class="composer" @submit.prevent="handleSubmit">
			<label class="composer-label" for="prompt-input">Send a prompt</label>

			<textarea
				id="prompt-input"
				v-model="prompt"
				placeholder="Type your prompt here..."
				rows="4"
				:disabled="isLoading">
			</textarea>

			<div class="composer-actions">
				<button type="submit" class="send-button" :disabled="isSendDisabled">
					{{ isLoading ? 'Sending…' : 'Send' }}
				</button>
			</div>
		</form>
	</div>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { useChat } from '../composables/useChat';

	const settingsOpen = ref(false);

	const {
		prompt,
		isLoading,
		messages,
		isSendDisabled,
		selectedModel,
		errorSimulationEnabled,
		retryMessage,
		handleSubmit,
		clearConversation,
	} = useChat();
</script>

<style scoped>
	.chat-interface {
		display: grid;
		gap: 28px;
	}

	.chat-section {
		display: grid;
		gap: 20px;
	}

	.chat-header {
		display: grid;
		gap: 16px;
	}

	.chat-header-info {
		display: grid;
		gap: 4px;
	}

	.chat-header h2 {
		margin: 0;
	}

	.chat-description {
		color: #6b7280;
		font-size: 0.95rem;
		margin: 0;
	}

	.chat-toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		align-items: center;
		padding-top: 16px;
		border-top: 1px solid #e5e7eb;
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.control-group label {
		font-size: 0.9rem;
		font-weight: 600;
		color: #111827;
	}

	.model-select {
		padding: 8px 12px;
		border-radius: 8px;
		border: 1px solid #d1d5db;
		background: #ffffff;
		color: #111827;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.error-toggle {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.9rem;
		font-weight: 600;
		color: #111827;
		cursor: pointer;
	}

	.error-toggle input {
		cursor: pointer;
	}

	.clear-button {
		padding: 8px 14px;
		border-radius: 8px;
		border: 1px solid #d1d5db;
		background: #f3f4f6;
		color: #111827;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
	}

	.clear-button:hover {
		background: #e5e7eb;
	}

	.settings-button {
		padding: 8px;
		border-radius: 8px;
		border: 1px solid #d1d5db;
		background: #f3f4f6;
		color: #111827;
		font-size: 1rem;
		cursor: pointer;
	}

	.settings-button:hover {
		background: #e5e7eb;
	}

	.settings-panel {
		padding: 16px;
		border-radius: 12px;
		background: #f8fafc;
		border: 1px solid #e5e7eb;
		display: grid;
		gap: 12px;
	}

	.settings-panel h3 {
		margin: 0;
		font-size: 1.1rem;
	}

	.settings-note {
		color: #6b7280;
		font-size: 0.9rem;
		margin: 0;
	}

	.close-settings {
		padding: 8px 14px;
		border-radius: 8px;
		border: 1px solid #d1d5db;
		background: #ffffff;
		color: #111827;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		align-self: start;
	}

	.close-settings:hover {
		background: #f3f4f6;
	}

	.conversation-list {
		list-style: none;
		display: grid;
		gap: 14px;
		padding: 0;
		margin: 0;
	}

	.message {
		padding: 18px;
		border-radius: 20px;
		border: 1px solid #e5e7eb;
		background: #ffffff;
		display: grid;
		gap: 12px;
	}

	.message.assistant {
		border-color: #c7d2fe;
		background: #f8fafc;
	}

	.message.assistant.error {
		border-color: #fca5a5;
		background: #fef2f2;
	}

	.message.user {
		border-color: #d1fae5;
		background: #ffffff;
	}

	.message-meta {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.message-role {
		font-size: 0.9rem;
		font-weight: 700;
		color: #111827;
	}

	.message-state {
		font-size: 0.8rem;
		font-weight: 700;
		color: #dc2626;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.message p {
		margin: 0;
		color: #111827;
		line-height: 1.75;
	}

	.retry-button {
		align-self: start;
		padding: 8px 14px;
		border-radius: 8px;
		border: none;
		background: #f87171;
		color: white;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
	}

	.retry-button:hover {
		background: #ef4444;
	}

	.composer {
		display: grid;
		gap: 12px;
	}

	.composer-label {
		font-size: 1rem;
		font-weight: 600;
		color: #111827;
	}

	.composer-actions {
		display: flex;
		justify-content: flex-end;
	}

	.send-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 34px;
		padding: 0 18px;
		border-radius: 14px;
		border: none;
		background: #4338ca;
		color: white;
		font-size: 0.95rem;
		font-weight: 700;
		cursor: pointer;
		line-height: 1;
		min-height: 0;
	}

	.send-button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	@media (max-width: 640px) {
		.chat-toolbar {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
		}

		.send-button {
			width: 100%;
		}
	}
</style>
