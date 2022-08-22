import { useEffect, useState } from 'react';

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
} = (() => {
  const shuffledMap = new Map<string, number[]>();
  let question: string = '';
  let prevQuestion: string = 'prev';
  return {
    getPrevQuestion: (): string => prevQuestion,
    updateQuestion: (q: string): void => {
      prevQuestion = question;
      question = q;
    },
    getShuffleOrder: (q: string): number[] | undefined => shuffledMap.get(q),
    registerShuffleOrder: (order: number[]) => {
      shuffledMap.set(question, order);
    },
  };
})();

const shuffleEffect = () => {
  const current = getQuestionFromDom(document);
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

const getRootUdemyElemnt = (document: Document): Element | null => {
  return document.getElementsByClassName('udemy')?.[0] ?? null;
};

const getFormAndQuestionsFromDom = (
  document: Document,
): HTMLFormElement | null => {
  return (
    document.querySelector(questionPromptSelector)?.closest('form') ?? null
  );
};

const getQuestionFromDom = (document: Document): string | null => {
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
    const rootElement = getRootUdemyElemnt(document);
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

    const form = getFormAndQuestionsFromDom(document);
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
