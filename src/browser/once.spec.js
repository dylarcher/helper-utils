import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { once } from './once.js';

// Mock EventTarget for testing
class MockEventTarget {
	constructor() {
		this.listeners = new Map();
	}

	addEventListener(eventType, listener, options) {
		if (!this.listeners.has(eventType)) {
			this.listeners.set(eventType, []);
		}
		this.listeners.get(eventType).push({ listener, options });
	}

	dispatchEvent(evt) {
		const listeners = this.listeners.get(evt.type) || [];
		const listenersToRemove = [];

		// Execute all listeners first
		listeners.forEach(({ listener, options }) => {
			listener.call(this, evt);
			// Mark for removal if once
			if (options && options.once) {
				listenersToRemove.push(listener);
			}
		});

		// Remove once listeners after execution
		listenersToRemove.forEach((listener) => {
			this.removeEventListener(evt.type, listener);
		});
	}

	removeEventListener(eventType, listener) {
		const listeners = this.listeners.get(eventType) || [];
		const index = listeners.findIndex((l) => l.listener === listener);
		if (index !== -1) {
			listeners.splice(index, 1);
		}
	}
}

describe('once(element, eventType, listener, options)', () => {
	let mockElement;
	let callCount;
	let lastEvent;

	beforeEach(() => {
		mockElement = new MockEventTarget();
		callCount = 0;
		lastEvent = null;
	});

	it('should add event listener with once option', () => {
		const listener = (evt) => {
			callCount++;
			lastEvent = evt;
		};

		once(mockElement, 'click', listener);

		const listeners = mockElement.listeners.get('click');
		assert.strictEqual(listeners.length, 1);
		assert.strictEqual(listeners[0].listener, listener);
		assert.strictEqual(listeners[0].options.once, true);
	});

	it('should fire listener only once', () => {
		const listener = () => {
			callCount++;
		};

		once(mockElement, 'click', listener);

		// First click
		mockElement.dispatchEvent({ type: 'click' });
		assert.strictEqual(callCount, 1);

		// Second click should not fire
		mockElement.dispatchEvent({ type: 'click' });
		assert.strictEqual(callCount, 1);
	});

	it('should preserve existing options and add once', () => {
		const listener = () => {
			callCount++;
		};
		const customOptions = { passive: true, capture: false };

		once(mockElement, 'scroll', listener, customOptions);

		const listeners = mockElement.listeners.get('scroll');
		assert.strictEqual(listeners[0].options.once, true);
		assert.strictEqual(listeners[0].options.passive, true);
		assert.strictEqual(listeners[0].options.capture, false);
	});

	it('should handle boolean options parameter', () => {
		const listener = () => {
			callCount++;
		};

		once(mockElement, 'keydown', listener, true); // capture = true

		const listeners = mockElement.listeners.get('keydown');
		assert.strictEqual(listeners[0].options.once, true);
	});

	it('should handle undefined options', () => {
		const listener = () => {
			callCount++;
		};

		once(mockElement, 'mouseover', listener);

		const listeners = mockElement.listeners.get('mouseover');
		assert.strictEqual(listeners[0].options.once, true);
	});

	it('should not throw for null element', () => {
		const listener = () => {
			callCount++;
		};

		assert.doesNotThrow(() => {
			once(null, 'click', listener);
		});

		assert.strictEqual(callCount, 0);
	});

	it('should not throw for undefined element', () => {
		const listener = () => {
			callCount++;
		};

		assert.doesNotThrow(() => {
			once(undefined, 'click', listener);
		});

		assert.strictEqual(callCount, 0);
	});

	it('should not throw for element without addEventListener', () => {
		const brokenElement = {};
		const listener = () => {
			callCount++;
		};

		assert.doesNotThrow(() => {
			once(brokenElement, 'click', listener);
		});

		assert.strictEqual(callCount, 0);
	});

	it('should pass event object to listener', () => {
		const listener = (evt) => {
			callCount++;
			lastEvent = evt;
		};

		once(mockElement, 'custom', listener);

		const testEvent = { type: 'custom', data: 'test' };
		mockElement.dispatchEvent(testEvent);

		assert.strictEqual(callCount, 1);
		assert.strictEqual(lastEvent, testEvent);
	});

	it('should work with different event types', () => {
		const events = ['click', 'mouseover', 'keydown', 'resize', 'scroll'];
		const listeners = events.map(() => () => callCount++);

		events.forEach((eventType, index) => {
			once(mockElement, eventType, listeners[index]);
		});

		// Trigger all events
		events.forEach((eventType) => {
			mockElement.dispatchEvent({ type: eventType });
		});

		assert.strictEqual(callCount, events.length);

		// Trigger again - should not increment
		events.forEach((eventType) => {
			mockElement.dispatchEvent({ type: eventType });
		});

		assert.strictEqual(callCount, events.length);
	});

	it('should handle multiple listeners on same event', () => {
		let count1 = 0,
			count2 = 0;
		const listener1 = () => count1++;
		const listener2 = () => count2++;

		once(mockElement, 'test', listener1);
		once(mockElement, 'test', listener2);

		mockElement.dispatchEvent({ type: 'test' });

		assert.strictEqual(count1, 1);
		assert.strictEqual(count2, 1);

		// Second trigger should not fire either
		mockElement.dispatchEvent({ type: 'test' });

		assert.strictEqual(count1, 1);
		assert.strictEqual(count2, 1);
	});

	it('should preserve listener context', () => {
		const _context = { value: 'test-context' };
		let receivedContext;

		function contextListener() {
			receivedContext = this;
		}

		once(mockElement, 'context-test', contextListener);
		mockElement.dispatchEvent({ type: 'context-test' });

		assert.strictEqual(receivedContext, mockElement);
	});
});
