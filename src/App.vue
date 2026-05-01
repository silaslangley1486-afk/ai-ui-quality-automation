<template>
	<div class="app">
		<a href="#main-content" class="skip-link">Skip to main content</a>

		<header class="page-header">
			<div class="page-header-content">
				<p class="eyebrow">Portfolio Project</p>
				<h1>AI UI Quality Automation</h1>
				<p class="page-description">
					A mock AI assistant built as a controlled target for Playwright and accessibility testing. Interact with the assistant below to test UI interactions and accessibility compliance.
				</p>
			</div>
		</header>

		<main id="main-content" class="app-shell" tabindex="-1">
			<ChatInterface />
		</main>
	</div>
</template>

<script lang="ts" setup>
	import ChatInterface from './components/ChatInterface.vue';
</script>

<style scoped>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.skip-link {
		position: absolute;
		top: -40px;
		left: 6px;
		background: #4338ca;
		color: white;
		padding: 8px;
		text-decoration: none;
		border-radius: 4px;
		z-index: 1000;
	}

	.skip-link:focus {
		top: 6px;
	}

	.app-shell:focus {
		outline: none;
	}

	.page-header {
		padding: 30px;
		border-radius: 24px;
		background: #ffffff;
		border: 1px solid #e5e7eb;
		box-shadow: 0 18px 45px rgba(15, 23, 42, 0.05);
		margin: 0 auto 28px auto;
		max-width: 920px;
		width: 100%;
	}

	.page-header-content {
		max-width: 920px;
		margin: 0 auto;
	}

	.eyebrow {
		margin-bottom: 12px;
		font-size: 0.9rem;
		color: #6366f1;
		text-transform: uppercase;
		letter-spacing: 0.12em;
	}

	.page-header h1 {
		font-size: clamp(2rem, 4vw, 3rem);
		margin-bottom: 16px;
	}

	.page-description {
		max-width: 700px;
		color: #4b5563;
	}

	.app-shell {
		max-width: 920px;
		margin: 0 auto;
		flex: 1;
		display: grid;
		gap: 28px;
		width: 100%;
	}
</style>
