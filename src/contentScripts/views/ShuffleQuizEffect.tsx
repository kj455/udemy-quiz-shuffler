import { useEffect } from 'react';
import { questionPromptSelector } from '../const';
import { getFormElement, getQuestionTextFromDom } from '../services';
import { createStore } from '../store';
import { useIsQuizPage } from '../useIsQuizPage';

const shuffleQuestions = (
  document: Document,
  order?: number[],
): number[] | undefined => {
  const ul = document.querySelector(questionPromptSelector);
  if (ul == null) {
    return;
  }
  const li = ul.querySelectorAll('li');
  li.forEach((l) => {
    ul.removeChild(l);
  });

  // if order is provided, use it and return
  if (order != null) {
    order.forEach((i) => {
      ul.appendChild(li[i]);
    });
    return order;
  }

  // otherwise, shuffle the questions
  const shuffled = Array.from(li).sort(() => Math.random() - 0.5);
  shuffled.forEach((l) => {
    ul.appendChild(l);
  });

  const shuffledIndexes = shuffled.map((l) => {
    return Array.from(li).indexOf(l);
  });
  return shuffledIndexes;
};

const {
  getPrevQuestion,
  updateQuestion,
  getShuffleOrder,
  registerShuffleOrder,
} = createStore();

const shuffleEffect = (document: Document) => {
  const current = getQuestionTextFromDom(document);
  if (current == null) {
    return;
  }
  updateQuestion(current);

  const prev = getPrevQuestion();
  if (current === prev) {
    return;
  }

  const order = shuffleQuestions(document, getShuffleOrder(current));
  if (order != null) {
    registerShuffleOrder(order);
  }
};

export const ShuffleQuizEffect = () => {
  const isQuiz = useIsQuizPage();

  // initial shuffle
  useEffect(() => {
    if (!isQuiz) {
      return;
    }
    shuffleEffect(document);
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
      shuffleEffect(document);
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
