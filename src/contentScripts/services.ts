import { questionPromptSelector } from './const';

export const isQuizPage = (document: Document): boolean => {
  const quizPageElement = document.querySelector(questionPromptSelector);
  return quizPageElement != null;
};

export const getRootUdemyElement = (document: Document): Element | null => {
  return document.getElementsByClassName('udemy')?.[0] ?? null;
};

export const getFormElement = (document: Document): HTMLFormElement | null => {
  return (
    document.querySelector(questionPromptSelector)?.closest('form') ?? null
  );
};

export const getQuestionTextFromDom = (document: Document): string | null => {
  return (
    document
      .querySelector(questionPromptSelector)
      ?.closest('form')
      ?.querySelector('span')?.textContent ?? null
  );
};

export const shuffleQuestions = (
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