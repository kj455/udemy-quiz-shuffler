import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';
import { getQuestionTextFromDom, shuffleQuestionDoms } from '../services';
import { shuffleEffect } from '../shuffle';

describe('shuffleEffect', () => {
  vi.mock('../services', () => ({
    getQuestionTextFromDom: vi.fn(),
    shuffleQuestionDoms: vi.fn(),
  }));

  const {
    getQuestion,
    getPrevQuestion,
    updateQuestion,
    getShuffleOrder,
    registerShuffleOrder,
  } = {
    getQuestion: vi.fn(),
    getPrevQuestion: vi.fn(),
    updateQuestion: vi.fn(),
    getShuffleOrder: vi.fn(),
    registerShuffleOrder: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('should return if no question is found', () => {
    (getQuestionTextFromDom as Mock).mockReturnValue(null);

    shuffleEffect(document, {
      getQuestion,
      getPrevQuestion,
      updateQuestion,
      getShuffleOrder,
      registerShuffleOrder,
    });
    expect(updateQuestion).not.toHaveBeenCalled();
    expect(shuffleQuestionDoms).not.toHaveBeenCalled();
    expect(registerShuffleOrder).not.toHaveBeenCalled();
  });

  test('should update and register question', () => {
    (getQuestionTextFromDom as Mock).mockReturnValue('question');
    (shuffleQuestionDoms as Mock).mockReturnValue([0, 1, 2]);
    getPrevQuestion.mockReturnValue('previous');
    getShuffleOrder.mockReturnValue(undefined);

    shuffleEffect(document, {
      getQuestion,
      getPrevQuestion,
      updateQuestion,
      getShuffleOrder,
      registerShuffleOrder,
    });

    expect(updateQuestion.mock.calls).toEqual([['question']]);
    expect((shuffleQuestionDoms as Mock).mock.calls).toEqual([
      [document, undefined],
    ]);
    expect(registerShuffleOrder.mock.calls).toEqual([[[0, 1, 2]]]);
  });
});
