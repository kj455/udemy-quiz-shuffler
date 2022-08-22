import { useEffect, useState } from 'react';
import { getRootUdemyElement, isQuizPage } from './services';

export const useIsQuizPage = (): ConstrainBoolean => {
  const [isQuiz, setIsQuiz] = useState<boolean>(false);

  // detect question page
  useEffect(() => {
    const rootElement = getRootUdemyElement(document);

    if (rootElement == null) {
      return;
    }

    const observer = new MutationObserver(() => {
      setIsQuiz(isQuizPage(document));
    });

    observer.observe(rootElement, {
      childList: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
    };
  }, []);
  return isQuiz;
};
