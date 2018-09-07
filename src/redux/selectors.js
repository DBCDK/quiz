export const ownQuizzes = state =>
  state
    .getIn(['widget', 'ownQuizzes'])
    .map(uuid => state.getIn(['quiz', uuid]));
export const quizVariables = state => state.get('quizState');
export const currentScreen = state => {
  const screen = state.getIn(
    ['quiz', 'screens', state.getIn(['widget', 'currentScreen'])],
    false
  );
  if (screen) {
    return screen;
  }
  return state.getIn([
    'quiz',
    'screens',
    state.getIn(['quiz', 'settings', 'start'])
  ]);
};
export const quizSettings = state => state.getIn(['quiz', 'settings']);
export const loading = state => state.getIn(['widget', 'loading']) !== 0;

export const getScreen = (screenId, state) =>
  state.getIn(['quiz', 'screens', screenId]);

export function questionList(state) {
  const start = state.getIn(['quiz', 'settings', 'start']);
  let current = start;
  const result = [];
  do {
    result.push(current);
    current = state.getIn(['quiz', 'screens', current, 'nextSection']);
  } while (current && current !== start);
  return result;
}
