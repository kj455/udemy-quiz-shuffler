export const createStore = () => {
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
};
