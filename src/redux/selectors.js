export const ownQuizzes = state =>
  state.getIn(['ui', 'ownQuizzes']).map(uuid => state.getIn(['quiz', uuid]));
export const currentScreen = state =>
  state.getIn(['quiz', 'screens', state.getIn(['ui', 'currentScreen'])], []);
export const quizDescription = state => state.getIn(['quiz', 'description']);
export const loading = state => state.getIn(['ui', 'loading']) !== 0;
