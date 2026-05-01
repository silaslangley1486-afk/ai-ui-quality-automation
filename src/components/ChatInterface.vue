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

					<button class="clear-button" type="button" @click="clearConversation">
						Clear conversation
					</button>

					<button
						type="button"
						class="settings-button"
						@click="settingsOpen = !settingsOpen"
						aria-label="Open settings"
						:aria-expanded="settingsOpen"
						aria-controls="settings-panel"
						ref="settingsButton"
					>
						Settings
					</button>
				</div>
			</div>

			<div
				v-if="settingsOpen"
				class="modal-overlay"
				@click.self="closeSettings"
			>
				<SettingsModal
					id="settings-panel"
					v-model:themeMode="themeMode"
					v-model:reducedMotionEnabled="reducedMotionEnabled"
					v-model:responseDelay="responseDelay"
					v-model:errorSimulationEnabled="errorSimulationEnabled"
					@close="closeSettings"
					@reset="resetApplicationState"
				/>
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
						<div class="message-content">
							<template v-if="message.role === 'assistant' && message.state === 'loading'">
								<div
									role="status"
									aria-live="polite"
									class="assistant-loading"
									data-testid="loading-indicator"
								>
									<span v-if="!reducedMotionEnabled" class="spinner" aria-hidden="true"></span>
									<span>Processing your request…</span>
								</div>
							</template>

							<template v-else-if="message.role === 'assistant' && message.state === 'error'">
								<p>{{ message.content }}</p>

								<button
									type="button"
									class="retry-button"
									@click="retryMessage(message.id)"
								>
									Retry
								</button>
							</template>

							<template v-else>
								<p>{{ message.content }}</p>
							</template>
						</div>
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
	import { ref, watch } from 'vue';
	import { useChat } from '../composables/useChat';
	import SettingsModal from './SettingsModal.vue';

	const settingsOpen = ref(false);
	const settingsButton = ref<HTMLButtonElement | null>(null);

	const {
		prompt,
		isLoading,
		messages,
		isSendDisabled,
		selectedModel,
		errorSimulationEnabled,
		themeMode,
		reducedMotionEnabled,
		responseDelay,
		retryMessage,
		handleSubmit,
		clearConversation,
		resetApplicationState,
	} = useChat();

	const closeSettings = () => {
		settingsOpen.value = false;
	};

	watch(settingsOpen, (open) => {
		if (!open) {
			settingsButton.value?.focus();
		}
	});
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
		color: var(--text);
	}

	.model-select {
		padding: 8px 12px;
		border-radius: 8px;
		border: 1px solid var(--input-border);
		background: var(--input);
		color: var(--text);
		font-size: 0.9rem;
		cursor: pointer;
	}

	.clear-button {
		padding: 8px 14px;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: var(--control-bg);
		color: var(--text);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
	}

	.clear-button:hover {
		background: var(--control-hover);
	}

	.settings-button {
		padding: 8px 14px;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: var(--control-bg);
		color: var(--text);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
	}

	.settings-button:hover {
		background: var(--control-hover);
	}

	.settings-button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.modal-overlay {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: grid;
		place-items: center;
		padding: 24px;
		background: rgba(15, 23, 42, 0.55);
	}

	.clear-button:hover,
	.settings-button:hover {
		background: var(--control-hover);
	}

	.model-select:focus-visible,
	.field-row select:focus-visible,
	.clear-button:focus-visible,
	.settings-button:focus-visible,
	.close-settings:focus-visible,
	.reset-state-button:focus-visible,
	.retry-button:focus-visible,
	.send-button:focus-visible,
	textarea:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.conversation-list {
		list-style: none;
		display: grid;
		gap: 14px;
		padding: 0;
		margin: 0;
	}

	.assistant-loading {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--muted);
		font-size: 0.95rem;
	}

	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid var(--border);
		border-top-color: var(--accent);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.message {
		padding: 18px;
		border-radius: 20px;
		border: 1px solid var(--border);
		background: var(--surface);
		display: grid;
		gap: 12px;
	}

	.message.assistant {
		border-color: #c7d2fe;
		background: #eef2ff;
	}

	.message.assistant.error {
		border-color: #fca5a5;
		background: #fef2f2;
	}

	.message.user {
		border-color: #d1fae5;
		background: var(--surface);
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
		/* align-self: start;
		padding: 8px 14px;
		border-radius: 8px;
		border: none;
		background: #f87171;
		color: white;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer; */

		margin-top: 8px;
		padding: 7px 12px;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: var(--control-bg);
		color: var(--text);
		font-weight: 600;
		cursor: pointer;
	}

	.retry-button:hover {
		background: var(--control-hover);
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

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	html[data-reduced-motion="true"] .spinner {
		animation: none;
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
