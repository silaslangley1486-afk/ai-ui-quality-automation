import { nextTick, type Ref } from 'vue';

const focusableSelector = [
	'a[href]',
	'button:not([disabled])',
	'textarea:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(',');

export const useFocusTrap = (containerRef: Ref<HTMLElement | null>) => {
	const isFocusable = (element: HTMLElement) => {
		const styles = window.getComputedStyle(element);

		return (
			styles.display !== 'none' &&
			styles.visibility !== 'hidden' &&
			!element.hasAttribute('disabled') &&
			element.getAttribute('aria-hidden') !== 'true'
		);
	};

	const getFocusableElements = () => {
		if (!containerRef.value) return [];

		return Array.from(
			containerRef.value.querySelectorAll<HTMLElement>(focusableSelector),
		).filter(isFocusable);
	};

	const focusFirstElement = async () => {
		await nextTick();

		const focusableElements = getFocusableElements();
		focusableElements[0]?.focus();
	};

	const trapFocus = (event: KeyboardEvent) => {
		const focusableElements = getFocusableElements();

		if (focusableElements.length === 0) {
			event.preventDefault();
			containerRef.value?.focus();
			return;
		}

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		if (!event.shiftKey && document.activeElement === lastElement) {
			event.preventDefault();
			firstElement.focus();
			return;
		}

		if (event.shiftKey && document.activeElement === firstElement) {
			event.preventDefault();
			lastElement.focus();
		}
	};

	return {
		focusFirstElement,
		trapFocus,
	};
};
