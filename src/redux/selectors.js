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
export function findMaxState(quiz) {
  function findActions(o, acc = []) {
    if (Immutable.isCollection(o)) {
      const action = o.get('action');
      if (action) {
        acc.push(action);
      }
      o.forEach(v => findActions(v, acc));
    }
    return acc;
  }
  const screens = quiz.get('screens');
  let iterCount = 0;
  let nodes = {[quiz.get('start')]: {}};
  let prevState;

  while (iterCount < 100 && !Immutable.fromJS(nodes).equals(prevState)) {
    prevState = Immutable.fromJS(nodes);
    ++iterCount;

    for (const nodeId in nodes) {
      const node = screens.get(nodeId);
      for (const action of findActions(node)) {
        const destScreen = action.get('screen');
        const destState = nodes[destScreen] || {};
        const newState = {...nodes[nodeId]};
        action.get('set', Immutable.Map()).forEach((v, k) => {
          newState[k] = v;
        });
        action.get('increment', Immutable.Map()).forEach((v, k) => {
          newState[k] = (newState[k] || 0) + v;
        });
        for (const k in newState) {
          destState[k] = Math.max(destState[k] || 0, newState[k]);
        }
        nodes[destScreen] = destState;
      }
    }
  }

  const maxState = {};
  for (const state of Object.values(nodes)) {
    for (const k in state) {
      maxState[k] = Math.max(maxState[k] || 0, state[k]);
    }
  }

  return maxState;
}
