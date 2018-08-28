import Immutable from 'immutable';

export const ownQuizzes = state =>
  state.getIn(['ui', 'ownQuizzes']).map(uuid => state.getIn(['quiz', uuid]));
export const quizVariables = state => state.get('quizState');
export const currentScreen = state =>
  state.getIn(['quiz', 'screens', state.getIn(['ui', 'currentScreen'])], []);
export const quizDescription = state => state.getIn(['quiz', 'description']);
export const loading = state => state.getIn(['ui', 'loading']) !== 0;

function findScreenActions(o, acc = []) {
  if (Immutable.isCollection(o)) {
    const screen = o.getIn(['action', 'screen']);
    if (screen) {
      acc.push(screen);
    }
    o.forEach(v => findScreenActions(v, acc));
  }
  return acc;
}
function depthFirstPages(state) {
  const toVisit = [state.getIn(['quiz', 'description', 'start'])];
  const pages = [];
  const screens = state.getIn(['quiz', 'screens']);
  const visited = {};
  for (let i = 0; i < toVisit.length; ++i) {
    const screenId = toVisit[i];
    if (visited[screenId]) {
      continue;
    }
    pages.push(screenId);
    findScreenActions(screens.get(screenId), toVisit);
    visited[screenId] = true;
  }
  return pages;
}

export function questionList(state) {
  return depthFirstPages(state).filter(
    pageId => !state.getIn(['quiz', 'screens', pageId, 'parent'])
  );
}
