import { useEffect, useState } from "react";

const questionPromptSelector = '[aria-labelledby="question-prompt"]';

const shuffleCandidates = (document: Document) => {
  const ul = document.querySelector(questionPromptSelector);
  if (ul == null) {
    return;
  }
  const li = ul.querySelectorAll('li');
  li.forEach((l) => {
    ul.removeChild(l);
  });

  const shuffled = Array.from(li).sort(() => Math.random() - 0.5);
  shuffled.forEach((l) => {
    ul.appendChild(l);
  });
}

const isQuizPage = (): boolean => {
  const quizPageElement = document.querySelector(questionPromptSelector);
  return quizPageElement != null;
};


const getRootUdemyEleemnt = (document: Document): Element | null => {
  return document.getElementsByClassName('udemy')?.[0] ?? null
}

const getFormAndProblemFromDom = (document: Document): { form: HTMLFormElement | null, getProblem: () => string | null } => {
  const form = document.querySelector(questionPromptSelector)?.closest('form') ?? null;
  const getProblem = (): string | null => {
    return form?.querySelector('span')?.textContent ?? null
  }
  
  return {form, getProblem}
};

const { getPrevProblem, updateProblem } = (() => {
  let problem: string = '';
  let prevProblem: string = 'prev';
  return {
    getPrevProblem: (): string => prevProblem,
    updateProblem: (p: string): void => {
      prevProblem = problem;
      problem = p;
    }
  }
})();

export const ShuffleQuizEffect = () => {
  const [isQuiz, setIsQuiz] = useState(false);

  // detect question page
  useEffect(() => {
    const rootElement = getRootUdemyEleemnt(document);
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
    }
  }, []);

  // observe quiz form element to shuffle
  useEffect(() => {
    if (!isQuiz) {
      return;
    }

    const {form, getProblem} = getFormAndProblemFromDom(document);
    if (form == null) {
      return;
    }
    
    const observer = new MutationObserver(() => {
      const current = getProblem();
      if (current == null || current === getPrevProblem()) {
        return;
      }
      updateProblem(current);
      shuffleCandidates(document);
    });

    observer.observe(form, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    }
  }, [isQuiz]);

  return null;
};
