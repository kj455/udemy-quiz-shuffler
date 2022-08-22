import { describe, expect, test } from 'vitest';
import { createStore } from '../questionState';

describe('questionState', () => {
  test('should return initial state', () => {
    const { getQuestion, getPrevQuestion } = createStore({
      question: 'new',
      prevQuestion: 'pre',
    });
    expect(getQuestion()).toBe('new');
    expect(getPrevQuestion()).toBe('pre');
  });

  test('should update state', () => {
    const { updateQuestion, getQuestion, getPrevQuestion } = createStore({
      question: '1',
      prevQuestion: '0',
    });

    updateQuestion('updated');
    expect(getQuestion()).toBe('updated');
    expect(getPrevQuestion()).toBe('1');
  });

  test('should register shuffle order', () => {
    const { registerShuffleOrder, getShuffleOrder } = createStore({
      question: 'new',
      prevQuestion: 'pre',
    });

    registerShuffleOrder([1, 2, 3]);
    expect(getShuffleOrder('new')).toEqual([1, 2, 3]);
  });
});
