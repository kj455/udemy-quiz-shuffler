import { questionPromptSelector } from './const';

export const isQuizPage = (document: Document): boolean => {
  const quizPageElement = document.querySelector(questionPromptSelector);
  return quizPageElement != null;
};

export const getRootUdemyElement = (document: Document): Element | null => {
  return document.getElementsByClassName('udemy')?.[0] ?? null;
};
