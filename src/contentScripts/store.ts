type State = {
  question: string;
  prevQuestion: string;
};

export type Store = {
  getQuestion: () => string;
  getPrevQuestion: () => string;
  updateQuestion: (q: string) => void;
  getShuffleOrder: (q: string) => number[] | undefined;
  registerShuffleOrder: (order: number[]) => void;
};

export const createStore = (initialState?: Partial<State>): Store => {
  const shuffledMap = new Map<string, number[]>();
  let question: string = initialState?.question ?? '';
  let prevQuestion: string = initialState?.prevQuestion ?? 'prev';

  return {
    getQuestion: () => question,
    getPrevQuestion: () => prevQuestion,
    updateQuestion: (q) => {
      prevQuestion = question;
      question = q;
    },
    getShuffleOrder: (q) => shuffledMap.get(q),
    registerShuffleOrder: (order) => {
      shuffledMap.set(question, order);
    },
  };
};