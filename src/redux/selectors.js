export const ownQuizzes = state =>
  state.getIn(['ui', 'ownQuizzes']).map(uuid => state.getIn(['quiz', uuid]));
export const loading = state => state.getIn(['ui', 'loading']) !== 0;
