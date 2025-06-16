import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { onDelegate } from './onDelegate.js';

// Mock Element for testing event delegation
class MockElement {
	constructor(tagName, className = '', id = '') {
		this.tagName = tagName.toLowerCase();
		this.className = className;
		this.id = id;
		this.listeners = new Map();
		this.children = [];
		this.parent = null;
	}

	addEventListener(eventType, listener, options) {
		if (!this.listeners.has(eventType)) {
			this.listeners.set(eventType, []);
		}
		this.listeners.get(eventType).push({ listener, options });
	}

	matches(selector) {
		if (selector.startsWith('.')) {
			return this.className.includes(selector.slice(1));
		}
		if (selector.startsWith('#')) {
			return this.id === selector.slice(1);
		}
		return this.tagName === selector.toLowerCase();
	}

	appendChild(child) {
		child.parent = this;
		this.children.push(child);
	}

	// Simulate event dispatching for testing
	simulateEvent(eventType, target = this) {
		const listeners = this.listeners.get(eventType) || [];
		const evt = {
			type: eventType,
			target: target,
			currentTarget: this,
		};

		listeners.forEach(({ listener }) => {
			listener.call(this, evt);
		});
	}
}

describe('onDelegate(parentElement, eventType, selector, callback, options)', () => {
	let parentElement;
	let callCount;
	let lastEvent;
	let lastTarget;

	beforeEach(() => {
		parentElement = new MockElement('div', 'container');
		callCount = 0;
		lastEvent = null;
		lastTarget = null;
	});

	it('should attach event listener to parent element', () => {
		const callback = () => callCount++;

		onDelegate(parentElement, 'click', '.button', callback);

		const listeners = parentElement.listeners.get('click');
		assert.strictEqual(listeners.length, 1);
		assert.strictEqual(typeof listeners[0].listener, 'function');
	});

	it('should call callback when target matches selector', () => {
		const button = new MockElement('button', 'button');
		const callback = function (evt) {
			callCount++;
			lastEvent = evt;
			lastTarget = this;
		};

		onDelegate(parentElement, 'click', '.button', callback);
		parentElement.appendChild(button);

		// Simulate click on button
		parentElement.simulateEvent('click', button);

		assert.strictEqual(callCount, 1);
		assert.strictEqual(lastEvent.target, button);
		assert.strictEqual(lastTarget, button); // callback should be called with target as 'this'
	});

	it("should not call callback when target doesn't match selector", () => {
		const span = new MockElement('span', 'text');
		const callback = () => callCount++;

		onDelegate(parentElement, 'click', '.button', callback);
		parentElement.appendChild(span);

		// Simulate click on span (doesn't match .button)
		parentElement.simulateEvent('click', span);

		assert.strictEqual(callCount, 0);
	});

	it('should work with id selectors', () => {
		const element = new MockElement('div', '', 'special');
		const callback = () => callCount++;

		onDelegate(parentElement, 'hover', '#special', callback);
		parentElement.appendChild(element);

		parentElement.simulateEvent('hover', element);

		assert.strictEqual(callCount, 1);
	});

	it('should work with tag selectors', () => {
		const button = new MockElement('button');
		const callback = () => callCount++;

		onDelegate(parentElement, 'click', 'button', callback);
		parentElement.appendChild(button);

		parentElement.simulateEvent('click', button);

		assert.strictEqual(callCount, 1);
	});

	it('should handle multiple matching elements', () => {
		const button1 = new MockElement('button', 'btn');
		const button2 = new MockElement('button', 'btn');
		const callback = () => callCount++;

		onDelegate(parentElement, 'click', '.btn', callback);
		parentElement.appendChild(button1);
		parentElement.appendChild(button2);

		parentElement.simulateEvent('click', button1);
		parentElement.simulateEvent('click', button2);

		assert.strictEqual(callCount, 2);
	});

	it('should pass options to addEventListener', () => {
		const callback = () => callCount++;
		const options = { passive: true, capture: false };

		onDelegate(parentElement, 'scroll', '.item', callback, options);

		const listeners = parentElement.listeners.get('scroll');
		assert.deepStrictEqual(listeners[0].options, options);
	});

	it('should handle boolean options parameter', () => {
		const callback = () => callCount++;

		onDelegate(parentElement, 'click', '.item', callback, true);

		const listeners = parentElement.listeners.get('click');
		assert.strictEqual(listeners[0].options, true);
	});

	it('should not throw for null parent element', () => {
		const callback = () => callCount++;

		assert.doesNotThrow(() => {
			onDelegate(null, 'click', '.button', callback);
		});
	});

	it('should not throw for undefined parent element', () => {
		const callback = () => callCount++;

		assert.doesNotThrow(() => {
			onDelegate(undefined, 'click', '.button', callback);
		});
	});

	it('should handle target without matches method', () => {
		const brokenTarget = { tagName: 'div' };
		const callback = () => callCount++;

		onDelegate(parentElement, 'click', '.button', callback);

		// Simulate event with target that doesn't have matches method
		assert.doesNotThrow(() => {
			parentElement.simulateEvent('click', brokenTarget);
		});

		assert.strictEqual(callCount, 0);
	});

	it('should handle null target', () => {
		const callback = () => callCount++;

		onDelegate(parentElement, 'click', '.button', callback);

		// Mock addEventListener to simulate null target
		parentElement.addEventListener = (eventType, listener) => {
			const evt = { target: null };
			listener(evt);
		};

		assert.doesNotThrow(() => {
			onDelegate(parentElement, 'test', '.button', callback);
		});

		assert.strictEqual(callCount, 0);
	});

	it('should handle target.matches throwing error', () => {
		const errorTarget = {
			matches: () => {
				throw new Error('matches failed');
			},
		};
		const callback = () => callCount++;

		onDelegate(parentElement, 'click', '.button', callback);

		assert.doesNotThrow(() => {
			parentElement.simulateEvent('click', errorTarget);
		});

		assert.strictEqual(callCount, 0);
	});

	it('should work with complex selectors', () => {
		const complexElement = new MockElement('input', 'form-input');
		complexElement.matches = (selector) => {
			// Mock complex selector matching
			if (selector === "input.form-input[type='text']") {
				return true;
			}
			return false;
		};

		const callback = () => callCount++;

		onDelegate(
			parentElement,
			'change',
			"input.form-input[type='text']",
			callback,
		);
		parentElement.appendChild(complexElement);

		parentElement.simulateEvent('change', complexElement);

		assert.strictEqual(callCount, 1);
	});

	it('should preserve event object properties', () => {
		const button = new MockElement('button', 'test-btn');
		let receivedEvent;

		const callback = (evt) => {
			receivedEvent = evt;
			callCount++;
		};

		onDelegate(parentElement, 'click', '.test-btn', callback);
		parentElement.appendChild(button);

		parentElement.simulateEvent('click', button);

		assert.strictEqual(callCount, 1);
		assert.ok(receivedEvent);
		assert.strictEqual(receivedEvent.target, button);
		assert.strictEqual(receivedEvent.type, 'click');
	});

	it('should handle multiple event types on same parent', () => {
		const element = new MockElement('div', 'interactive');
		const clickCallback = () => callCount++;
		const hoverCallback = () => (callCount += 2);

		onDelegate(parentElement, 'click', '.interactive', clickCallback);
		onDelegate(parentElement, 'mouseover', '.interactive', hoverCallback);
		parentElement.appendChild(element);

		parentElement.simulateEvent('click', element);
		parentElement.simulateEvent('mouseover', element);

		assert.strictEqual(callCount, 3); // 1 + 2
	});
});
