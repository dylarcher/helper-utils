import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { addClass } from '../../../src/browser/addClass.js';

// Mock Element class for testing environment
class MockElement {
  constructor() {
    this.classList = new Set();
    // Define classList.add, classList.contains, and className for compatibility
    this.classList.add = (...names) => names.forEach(name => this.classList.add(name));
    this.classList.contains = (name) => this.classList.has(name);
  }

  // Getter to simulate the className property
  get className() {
    return Array.from(this.classList).join(' ');
  }
}

describe('addClass(element, ...classNames)', () => {
  let mockElement;

  beforeEach(() => {
    mockElement = new MockElement();
    // Mock the classList.add method to behave like the DOM one
    // It should add items to the Set.
    const originalSetAdd = mockElement.classList.add.bind(mockElement.classList);
    mockElement.classList.add = (...classNames) => {
      classNames.forEach(cn => {
        if (typeof cn === 'string' && cn.trim() !== '') {
          originalSetAdd(cn);
        }
      });
    };
  });

  it('should add a single class to an element', () => {
    addClass(mockElement, 'test-class');
    assert.ok(mockElement.classList.has('test-class'), 'Class "test-class" should be present');
    assert.strictEqual(mockElement.className, 'test-class');
  });

  it('should add multiple classes to an element', () => {
    addClass(mockElement, 'class1', 'class2');
    assert.ok(mockElement.classList.has('class1'), 'Class "class1" should be present');
    assert.ok(mockElement.classList.has('class2'), 'Class "class2" should be present');
    assert.strictEqual(mockElement.className, 'class1 class2'); // Order might vary with Set, check individual classes
  });

  it('should not add duplicate classes', () => {
    addClass(mockElement, 'test-class');
    addClass(mockElement, 'test-class');
    assert.strictEqual(mockElement.className, 'test-class', 'Duplicate class should not be added');
    assert.strictEqual(Array.from(mockElement.classList).length, 1, 'Class list should contain only one class');
  });

  it('should filter out falsy class names like null, undefined, and empty strings', () => {
    addClass(mockElement, 'class1', null, 'class2', undefined, '', 'class3');
    assert.ok(mockElement.classList.has('class1'));
    assert.ok(mockElement.classList.has('class2'));
    assert.ok(mockElement.classList.has('class3'));
    assert.strictEqual(Array.from(mockElement.classList).length, 3);
    // Check className, order might vary
    const classes = mockElement.className.split(' ');
    assert.ok(classes.includes('class1'));
    assert.ok(classes.includes('class2'));
    assert.ok(classes.includes('class3'));
  });

  it('should not throw an error if the element is null', () => {
    assert.doesNotThrow(() => {
      addClass(null, 'test-class');
    });
  });

  it('should not throw an error if the element is undefined', () => {
    assert.doesNotThrow(() => {
      addClass(undefined, 'test-class');
    });
  });

  it('should not throw an error or modify if element has no classList property', () => {
    const plainObject = {};
    addClass(plainObject, 'test-class');
    assert.strictEqual(Object.keys(plainObject).length, 0, 'Plain object should not be modified');
  });

  it('should handle adding a class that already exists with other classes', () => {
    mockElement.classList.add('existing-class');
    addClass(mockElement, 'new-class', 'existing-class');
    assert.ok(mockElement.classList.has('existing-class'));
    assert.ok(mockElement.classList.has('new-class'));
    assert.strictEqual(Array.from(mockElement.classList).length, 2);
  });

  it('should handle adding multiple new classes when some already exist', () => {
    mockElement.classList.add('class1');
    addClass(mockElement, 'class2', 'class1', 'class3');
    assert.ok(mockElement.classList.has('class1'));
    assert.ok(mockElement.classList.has('class2'));
    assert.ok(mockElement.classList.has('class3'));
    assert.strictEqual(Array.from(mockElement.classList).length, 3);
  });
});
