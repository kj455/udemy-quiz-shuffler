import { useEffect, useState } from 'react';
import { createStore } from '../questionState';

const questionPromptSelector = '[aria-labelledby="question-prompt"]';

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

const shuffleEffect = () => {
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

const isQuizPage = (): boolean => {
  const quizPageElement = document.querySelector(questionPromptSelector);
  return quizPageElement != null;
};

const getRootUdemyElement = (document: Document): Element | null => {
  return document.getElementsByClassName('udemy')?.[0] ?? null;
};

const getFormElement = (document: Document): HTMLFormElement | null => {
  return (
    document.querySelector(questionPromptSelector)?.closest('form') ?? null
  );
};

const getQuestionTextFromDom = (document: Document): string | null => {
  return (
    document
      .querySelector(questionPromptSelector)
      ?.closest('form')
      ?.querySelector('span')?.textContent ?? null
  );
};

export const ShuffleQuizEffect = () => {
  const [isQuiz, setIsQuiz] = useState(false);

  // detect question page
  useEffect(() => {
    const rootElement = getRootUdemyElement(document);
    if (rootElement == null) {
      return;
    }
    const observer = new MutationObserver(() => {
      setIsQuiz(isQuizPage());
    });
    observer.observe(rootElement, {
      childList: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  // initial shuffle
  useEffect(() => {
    if (!isQuiz) {
      return;
    }
    shuffleEffect();
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
      shuffleEffect();
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
