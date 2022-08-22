import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
import { useIsQuizPage } from '../useIsQuizPage';
import { getRootUdemyElement, isQuizPage } from '../services';

describe('useIsQuizPage', () => {
  const mockElement = document.createElement('div');

  const mockObserve = vi.fn();
  const mockDisconnect = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    const mockMutationObserver = vi.fn<[MutationCallback]>().mockReturnValue({
      observe: mockObserve,
      disconnect: mockDisconnect,
    });
    vi.stubGlobal('MutationObserver', mockMutationObserver);

    vi.mock('../services', () => ({
      getRootUdemyElement: vi.fn(),
      isQuizPage: vi.fn(),
    }));
  });

  test('should return false at first render', () => {
    const { result } = renderHook(() => useIsQuizPage());

    expect(result.current).toBe(false);
  });

  test('should observe once at quiz page', () => {
    (getRootUdemyElement as Mock).mockReturnValue(mockElement);
    (isQuizPage as Mock).mockReturnValue(true);

    const { result, rerender, unmount } = renderHook(() => useIsQuizPage());

    expect(result.current).toBe(false);
    expect(mockObserve.mock.calls).toEqual([
      [mockElement, { childList: true, subtree: true }],
    ]);
    expect(mockDisconnect).not.toHaveBeenCalled();

    rerender();

    expect(result.current).toBe(false);
    expect(mockObserve).toHaveBeenCalledOnce();
    expect(mockDisconnect).not.toHaveBeenCalled();

    mockElement.appendChild(document.createElement('div'));

    unmount();
    expect(mockDisconnect).toHaveBeenCalledOnce();
  });

  test('should not observe if not quiz page', () => {
    (getRootUdemyElement as Mock).mockReturnValue(null);
    (isQuizPage as Mock).mockReturnValue(false);

    const { result } = renderHook(() => useIsQuizPage());

    expect(result.current).toBe(false);
    expect(mockObserve.mock.calls).toEqual([]);
    expect(mockDisconnect.mock.calls).toEqual([]);
  });
});
