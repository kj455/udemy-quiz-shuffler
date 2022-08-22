import { test, vi, expect } from 'vitest';
import { getRootUdemyElement, isQuizPage } from '../services';

const mockElement = document.createElement('div');

test.each<[Document, boolean]>([
  [{ querySelector: vi.fn().mockReturnValue(null) } as any, false],
  [{ querySelector: vi.fn().mockReturnValue('element') } as any, true],
])('isQuizPage(%p): %s', (document, expected) => {
  expect(isQuizPage(document)).toBe(expected);
});

test.each<[Document, Element | null]>([
  [{ getElementsByClassName: vi.fn().mockReturnValue([]) } as any, null],
  [
    {
      getElementsByClassName: vi.fn().mockReturnValue([mockElement]),
    } as any,
    mockElement,
  ],
])('getRootUdemyElement(%p): %s', (document, expected) => {
  expect(getRootUdemyElement(document)).toBe(expected);
});
