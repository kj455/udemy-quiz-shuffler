import { useEffect } from 'react';
import { getFormElement } from '../services';
import { shuffleEffect } from '../shuffle';
import { createStore } from '../store';
import { useIsQuizPage } from '../useIsQuizPage';

const store = createStore();

export const ShuffleQuizEffect = () => {
  const isQuiz = useIsQuizPage();

  // initial shuffle
  useEffect(() => {
    if (!isQuiz) {
      return;
    }
    shuffleEffect(document, store);
  }, [isQuiz]);

  // shuffle at every question
  useEffect(() => {
    if (!isQuiz) {
      return;
    }

    const form = getFormElement(document);
    if (form == null) {
      return;
    }

    const observer = new MutationObserver(() => {
      shuffleEffect(document, store);
    });
    observer.observe(form, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [isQuiz]);

  return null;
};
