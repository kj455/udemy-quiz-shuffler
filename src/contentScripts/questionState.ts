type State = {
  question: string;
  prevQuestion: string;
};
export const createStore = (initialState?: Partial<State>) => {
  const shuffledMap = new Map<string, number[]>();
  let question: string = initialState?.question ?? '';
  let prevQuestion: string = initialState?.prevQuestion ?? 'prev';
  return {
    getQuestion: (): string => question,
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
