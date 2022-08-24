import { useEffect, useState } from 'react';

async function getCurrentTab(): Promise<chrome.tabs.Tab> {
  return new Promise(function (resolve, reject) {
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      function (tabs) {
        resolve(tabs[0]);
      },
    );
  });
}

export const Popup = () => {
  const [isQuiz, setIsQuiz] = useState(false);

  // detect `quiz` in the url
  useEffect(() => {
    (async () => {
      const tab = await getCurrentTab();
      setIsQuiz(tab.url?.includes('quiz') ?? false);
    })();
  }, []);

  return (
    <div
      style={{
        color: '#2D3748',
        padding: '8px',
        backgroundColor: '#F7FAFC',
      }}
    >
      {isQuiz ? (
        <p>
          Shuffled successfully!{' '}
          <span role="img" aria-label="tada">
            🎉
          </span>
        </p>
      ) : (
        <p>
          Udemy quiz was not found...
          <span role="img" aria-label="sad face">
            🙁
          </span>
        </p>
      )}
    </div>
  );
};
