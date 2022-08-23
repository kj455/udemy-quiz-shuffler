import { test, vi, expect, describe } from 'vitest';
import {
  getFormElement,
  getQuestionTextFromDom,
  getRootUdemyElement,
  isQuizPage,
  shuffleQuestionDoms,
} from '../services';

test.each<[Document, boolean]>([
  [{ querySelector: vi.fn().mockReturnValue(null) } as any, false],
  [{ querySelector: vi.fn().mockReturnValue('element') } as any, true],
])('isQuizPage(%p): %s', (document, expected) => {
  expect(isQuizPage(document)).toBe(expected);
});

const mockElement = document.createElement('div');
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

const mockFormElement = document.createElement('form');
test.each<[Document, HTMLFormElement | null]>([
  [{ querySelector: vi.fn().mockReturnValue(null) } as any, null],
  [
    {
      querySelector: vi.fn().mockReturnValue({
        closest: vi.fn().mockReturnValue(mockFormElement),
      }),
    } as any,
    mockFormElement,
  ],
])('getFormElement(%p): %s', (document, expected) => {
  expect(getFormElement(document)).toBe(expected);
});

test.each<[Document, string | null]>([
  [{ querySelector: vi.fn().mockReturnValue(null) } as any, null],
  [
    {
      querySelector: vi.fn().mockReturnValue({
        closest: vi.fn().mockReturnValue({
          querySelector: vi.fn().mockReturnValue({
            textContent: 'text',
          }),
        }),
      }),
    } as any,
    'text',
  ],
])('getQuestionTextFromDom(%p): %s', (document, expected) => {
  expect(getQuestionTextFromDom(document)).toBe(expected);
});

describe('shuffleQuestionDoms', () => {
  test('if no ul is found, return undefined', () => {
    expect(
      shuffleQuestionDoms({
        querySelector: vi.fn().mockReturnValue(null),
      } as any),
    ).toBeUndefined();
  });

  const createLiElement = (i: number) => {
    const li = document.createElement('li');
    li.setAttribute('data-index', i.toString());
    return li;
  };

  test('if order was provided, shuffle to that order', () => {
    const mockAppendChild = vi.fn();

    const list = [createLiElement(0), createLiElement(1), createLiElement(2)];
    const doc = {
      querySelector: vi.fn().mockReturnValue({
        querySelectorAll: vi.fn().mockReturnValue(list),
        removeChild: vi.fn(),
        appendChild: mockAppendChild,
      }),
    };
    const order = [2, 1, 0];

    const shuffled = shuffleQuestionDoms(doc as any, order);

    expect(shuffled).toEqual(order);
    expect(mockAppendChild.mock.calls).toStrictEqual([
      [list[2]],
      [list[1]],
      [list[0]],
    ]);
  });

  test('if order was not provided, shuffle to random order', () => {
    const mockAppendChild = vi.fn();

    const list = [createLiElement(0), createLiElement(1), createLiElement(2)];
    const doc = {
      querySelector: vi.fn().mockReturnValue({
        querySelectorAll: vi.fn().mockReturnValue(list),
        removeChild: vi.fn(),
        appendChild: mockAppendChild,
      }),
    };
    const order = undefined;

    shuffleQuestionDoms(doc as any, order);

    expect(mockAppendChild).toHaveBeenCalledTimes(3);
  });
});
