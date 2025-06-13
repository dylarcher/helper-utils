import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { removeElement } from './removeElement.js';

// Mock Element and Node classes for testing
class MockElement {
	constructor(tagName, id = '') {
		this.tagName = tagName.toLowerCase();
		this.id = id;
		this.parentNode = null;
		this.children = [];
	}

	appendChild(child) {
		child.parentNode = this;
		this.children.push(child);
	}

	removeChild(child) {
		const index = this.children.indexOf(child);
		if (index !== -1) {
			this.children.splice(index, 1);
			child.parentNode = null;
		}
		return child;
	}

	contains(element) {
		return this.children.includes(element);
	}
}

describe('removeElement(element)', () => {
	let parentElement;
	let childElement;

	beforeEach(() => {
		parentElement = new MockElement('div', 'parent');
		childElement = new MockElement('span', 'child');
		parentElement.appendChild(childElement);
	});

	it('should remove element from its parent', () => {
		assert.ok(parentElement.contains(childElement));
		assert.strictEqual(childElement.parentNode, parentElement);

		removeElement(childElement);

		assert.ok(!parentElement.contains(childElement));
		assert.strictEqual(childElement.parentNode, null);
	});

	it('should not throw for null element', () => {
		assert.doesNotThrow(() => {
			removeElement(null);
		});
	});

	it('should not throw for undefined element', () => {
		assert.doesNotThrow(() => {
			removeElement(undefined);
		});
	});

	it('should not throw for element without parentNode', () => {
		const orphanElement = new MockElement('p', 'orphan');

		assert.doesNotThrow(() => {
			removeElement(orphanElement);
		});
	});

	it('should not throw for element with null parentNode', () => {
		const elementWithNullParent = new MockElement('div');
		elementWithNullParent.parentNode = null;

		assert.doesNotThrow(() => {
			removeElement(elementWithNullParent);
		});
	});

	it('should handle element whose parent lacks removeChild method', () => {
		const brokenParent = {};
		childElement.parentNode = brokenParent;

		assert.doesNotThrow(() => {
			removeElement(childElement);
		});
	});

	it('should handle nested element removal', () => {
		const grandParent = new MockElement('div', 'grandparent');
		const parent = new MockElement('div', 'parent');
		const child = new MockElement('span', 'child');

		grandParent.appendChild(parent);
		parent.appendChild(child);

		assert.ok(grandParent.contains(parent));
		assert.ok(parent.contains(child));

		removeElement(parent);

		assert.ok(!grandParent.contains(parent));
		assert.strictEqual(parent.parentNode, null);
		// Child should still be attached to parent
		assert.ok(parent.contains(child));
	});

	it('should handle multiple children removal', () => {
		const child1 = new MockElement('span', 'child1');
		const child2 = new MockElement('span', 'child2');
		const child3 = new MockElement('span', 'child3');

		parentElement.appendChild(child1);
		parentElement.appendChild(child2);
		parentElement.appendChild(child3);

		assert.strictEqual(parentElement.children.length, 4); // including original child

		removeElement(child1);
		removeElement(child3);

		assert.strictEqual(parentElement.children.length, 2);
		assert.ok(!parentElement.contains(child1));
		assert.ok(parentElement.contains(child2));
		assert.ok(!parentElement.contains(child3));
	});

	it('should handle element already removed', () => {
		removeElement(childElement);

		// Try to remove again
		assert.doesNotThrow(() => {
			removeElement(childElement);
		});

		assert.strictEqual(childElement.parentNode, null);
	});

	it('should work with different element types', () => {
		const elements = [
			new MockElement('div', 'test-div'),
			new MockElement('span', 'test-span'),
			new MockElement('p', 'test-p'),
			new MockElement('button', 'test-button'),
			new MockElement('input', 'test-input'),
		];

		elements.forEach((element) => {
			parentElement.appendChild(element);
		});

		assert.strictEqual(parentElement.children.length, 6); // 5 + original child

		elements.forEach((element) => {
			removeElement(element);
		});

		assert.strictEqual(parentElement.children.length, 1); // only original child remains
	});

	it('should handle parent with custom removeChild implementation', () => {
		let removeChildCalled = false;
		const customParent = {
			removeChild: (child) => {
				removeChildCalled = true;
				child.parentNode = null;
				return child;
			},
		};

		const element = new MockElement('div');
		element.parentNode = customParent;

		removeElement(element);

		assert.strictEqual(removeChildCalled, true);
		assert.strictEqual(element.parentNode, null);
	});

	it('should handle removeChild throwing error', () => {
		const errorParent = {
			removeChild: () => {
				throw new Error('removeChild failed');
			},
		};

		childElement.parentNode = errorParent;

		// Should not throw the error - function handles errors gracefully
		assert.doesNotThrow(() => {
			removeElement(childElement);
		});
	});

	it('should preserve sibling relationships', () => {
		const sibling1 = new MockElement('div', 'sibling1');
		const sibling2 = new MockElement('div', 'sibling2');
		const sibling3 = new MockElement('div', 'sibling3');

		parentElement.appendChild(sibling1);
		parentElement.appendChild(sibling2);
		parentElement.appendChild(sibling3);

		removeElement(sibling2);

		assert.ok(parentElement.contains(sibling1));
		assert.ok(!parentElement.contains(sibling2));
		assert.ok(parentElement.contains(sibling3));
		assert.strictEqual(parentElement.children.length, 3); // original + sibling1 + sibling3
	});

	it('should handle element with complex parent structure', () => {
		const complexParent = {
			children: [],
			removeChild: function (child) {
				const index = this.children.indexOf(child);
				if (index !== -1) {
					this.children.splice(index, 1);
					child.parentNode = null;
				}
				return child;
			},
		};

		const element = new MockElement('div');
		element.parentNode = complexParent;
		complexParent.children.push(element);

		removeElement(element);

		assert.strictEqual(complexParent.children.length, 0);
		assert.strictEqual(element.parentNode, null);
	});

	it('should work in DOM-like environment', () => {
		// Simulate more realistic DOM behavior
		const mockDocument = {
			createElement: (tagName) => new MockElement(tagName),
		};

		const container = mockDocument.createElement('div');
		const item = mockDocument.createElement('span');

		container.appendChild(item);
		assert.ok(container.contains(item));

		removeElement(item);
		assert.ok(!container.contains(item));
	});
});
