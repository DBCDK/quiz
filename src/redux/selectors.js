import Immutable from 'immutable';

export const ownQuizzes = state =>
  state
    .getIn(['widget', 'ownQuizzes'])
    .map(uuid => state.getIn(['quiz', uuid]));
export const quizVariables = state => state.get('quizState');
export const adminCurrentScreen = state =>
  state.getIn(['admin', 'currentScreen']);
export const currentQuiz = state => state.getIn(['quiz', '_id']);
export const currentScreen = state => {
  const screen = state.getIn(
    ['quiz', 'screens', state.getIn(['widget', 'currentScreen'])],
    false
  );
  if (screen) {
    return screen;
  }
  return state.getIn(['quiz', 'screens', state.getIn(['quiz', 'start'])]);
};
export const quizSettings = state => state.getIn(['quiz']);
export const loading = state => state.getIn(['widget', 'loading']) !== 0;
export const searchResults = state =>
  state.get('searchResults', Immutable.fromJS([]));
export const getScreen = (screenId, state) =>
  state.getIn(['quiz', 'screens', screenId]);
export const searchQuery = state => state.get('searchQuery').toJS();
export const storageUser = state => state.getIn(['storage', 'user']);
export const statistics = state =>
  state.get('statistics') && state.get('statistics').toJS();

export function quizQuestionList(quiz) {
  if (!quiz) {
    return [];
  }
  const start = quiz.get('start');
  let current = start;
  const result = [];
  do {
    result.push(current);
    current = quiz.getIn(['screens', current, 'nextSection']);
  } while (current && current !== start);
  return result;
}
export function questionList(state) {
  return quizQuestionList(state.get('quiz'));
}
