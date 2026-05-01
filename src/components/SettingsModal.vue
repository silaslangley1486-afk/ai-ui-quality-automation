<template>
	<div
		class="settings-modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="settings-heading"
		aria-describedby="settings-description"
		tabindex="-1"
		ref="dialogRef"
		@keydown.esc.prevent="close"
		@keydown.tab="trapFocus"
	>
		<header class="settings-header">
			<div class="settings-header-text">
				<h2 id="settings-heading">Settings</h2>
				<p id="settings-description" class="settings-description">
					Configure appearance, accessibility, and testing controls.
				</p>
			</div>
		</header>

		<div class="settings-body">
			<fieldset class="settings-fieldset">
				<legend>Appearance</legend>

				<div class="field-row">
					<label for="theme-mode-select">Theme</label>
					<select
						id="theme-mode-select"
						:value="themeMode"
						@change="updateThemeMode"
					>
						<option value="light">Light</option>
						<option value="dark">Dark</option>
					</select>
				</div>
			</fieldset>

			<fieldset class="settings-fieldset">
				<legend>Accessibility</legend>

				<div class="field-checkbox">
					<input
						type="checkbox"
						id="reduced-motion-toggle"
						:checked="reducedMotionEnabled"
						@change="updateReducedMotion"
					/>
					<label for="reduced-motion-toggle">Reduce motion</label>
				</div>
			</fieldset>

			<fieldset class="settings-fieldset">
				<legend>Testing controls</legend>

				<div class="field-row">
					<label for="response-delay-select">Response delay</label>
					<select
						id="response-delay-select"
						:value="responseDelay"
						@change="updateResponseDelay"
					>
						<option :value="0">0ms</option>
						<option :value="300">300ms</option>
						<option :value="600">600ms</option>
					</select>
				</div>

				<div class="field-checkbox">
					<input
						type="checkbox"
						id="error-simulation-toggle"
						:checked="errorSimulationEnabled"
						@change="updateErrorSimulation"
					/>
					<label for="error-simulation-toggle">Simulate errors</label>
				</div>
			</fieldset>

			<section class="maintenance-section" aria-labelledby="maintenance-heading">
				<div>
					<h3 id="maintenance-heading">Maintenance</h3>
					<p>Reset the conversation, model, and settings to their defaults.</p>
				</div>

				<button type="button" class="reset-state-button" @click="reset">
					Reset application state
				</button>
			</section>
		</div>

		<footer class="settings-actions">
			<button type="button" class="close-settings" @click="close">
				Close settings
			</button>
		</footer>
	</div>
</template>

<script lang="ts" setup>
	import { onMounted, ref } from 'vue';
	import type { PropType } from 'vue';
	import { ThemeMode } from '../types/ui';
	import { useFocusTrap } from '../composables/useFocusTrap';

	defineProps({
		themeMode: { type: String as PropType<ThemeMode>, required: true },
		reducedMotionEnabled: { type: Boolean, required: true },
		responseDelay: { type: Number, required: true },
		errorSimulationEnabled: { type: Boolean, required: true },
	});
	const emit = defineEmits([
		'close',
		'reset',
		'update:themeMode',
		'update:reducedMotionEnabled',
		'update:responseDelay',
		'update:errorSimulationEnabled',
	]);

	const dialogRef = ref<HTMLElement | null>(null);
	const { focusFirstElement, trapFocus } = useFocusTrap(dialogRef);

	onMounted(() => {
		focusFirstElement();
	});

	const close = () => emit('close');
	const reset = () => emit('reset');

	const updateThemeMode = (event: Event) => {
		emit('update:themeMode', (event.target as HTMLSelectElement).value as ThemeMode);
	};

	const updateReducedMotion = (event: Event) => {
		emit('update:reducedMotionEnabled', (event.target as HTMLInputElement).checked);
	};

	const updateResponseDelay = (event: Event) => {
		emit('update:responseDelay', Number((event.target as HTMLSelectElement).value));
	};

	const updateErrorSimulation = (event: Event) => {
		emit('update:errorSimulationEnabled', (event.target as HTMLInputElement).checked);
	};
</script>

<style scoped>
	.settings-modal {
		display: grid;
		width: min(100%, 640px);
		max-height: 90vh;
		border-radius: 18px;
		background: var(--surface);
		border: 1px solid var(--border);
		box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
		outline: none;
		overflow: hidden;
	}

	.settings-modal:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
	}

	.settings-header {
		position: relative;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		padding: 22px 56px 18px 22px;
		border-bottom: 1px solid var(--border);
	}

	.settings-header-text {
		display: grid;
		gap: 6px;
	}

	.settings-header h2,
	.maintenance-section h3 {
		margin: 0;
		color: var(--text);
	}

	.settings-description,
	.maintenance-section p {
		margin: 0;
		color: var(--muted);
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.settings-body {
		display: grid;
		gap: 18px;
		padding: 22px;
		overflow-y: auto;
	}

	.settings-fieldset {
		display: grid;
		gap: 14px;
		margin: 0;
		padding: 16px;
		border: 1px solid var(--border);
		border-radius: 14px;
	}

	.settings-fieldset legend {
		padding: 0 8px;
		color: var(--text);
		font-weight: 700;
	}

	.field-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
	}

	.field-row label,
	.field-checkbox label {
		color: var(--text);
		font-size: 0.95rem;
		font-weight: 600;
	}

	.field-row select {
		min-width: 180px;
		padding: 8px 10px;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: var(--control-bg);
		color: var(--text);
		font: inherit;
	}

	.field-checkbox {
		display: inline-flex;
		align-items: center;
		justify-content: flex-start;
		gap: 10px;
		width: fit-content;
	}

	.field-checkbox input {
		width: 1.05rem;
		height: 1.05rem;
		margin: 0;
		flex: 0 0 auto;
	}

	.maintenance-section {
		display: grid;
		gap: 14px;
		padding: 16px;
		border: 1px solid var(--border);
		border-radius: 14px;
		background: color-mix(in srgb, var(--surface) 92%, var(--control-bg));
	}

	.reset-state-button {
		justify-self: end;
	}

	.settings-actions {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		padding: 16px 22px;
		border-top: 1px solid var(--border);
		background: color-mix(in srgb, var(--surface) 94%, var(--control-bg));
	}

	.reset-state-button,
	.close-settings {
		padding: 9px 16px;
		border-radius: 9px;
		border: 1px solid var(--border);
		background: var(--control-bg);
		color: var(--text);
		font-size: 0.95rem;
		font-weight: 700;
		cursor: pointer;
	}

	.reset-state-button:hover,
	.close-settings:hover {
		background: var(--control-hover);
	}

	select:focus-visible,
	input:focus-visible,
	button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	@media (max-width: 520px) {
		.settings-header {
			padding-right: 52px;
		}

		.field-row {
			align-items: stretch;
		}

		.field-row label,
		.field-row select {
			width: 100%;
		}

		.reset-state-button,
		.close-settings {
			width: 100%;
		}

		.reset-state-button {
			justify-self: stretch;
		}

		.settings-actions {
			justify-content: stretch;
		}
	}
</style>
