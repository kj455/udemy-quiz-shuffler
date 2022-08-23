import { getQuestionTextFromDom, shuffleQuestionDoms } from './services';
import { Store } from './store';

export const shuffleEffect = (
  document: Document,
  {
    getPrevQuestion,
    updateQuestion,
    getShuffleOrder,
    registerShuffleOrder,
  }: Store,
) => {
  const current = getQuestionTextFromDom(document);
  if (current == null) {
    return;
  }
  updateQuestion(current);

  const prev = getPrevQuestion();
  if (current === prev) {
    return;
  }

  const order = shuffleQuestionDoms(document, getShuffleOrder(current));
  if (order != null) {
    registerShuffleOrder(order);
  }
};
