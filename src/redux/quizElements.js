import Immutable from 'immutable';

export function findScreenActions(o, acc = []) {
  if (Immutable.isCollection(o)) {
    const screen = o.getIn(['action', 'screen']);
    if (screen) {
      acc.push(screen);
    }
    o.forEach(v => findScreenActions(v, acc));
  }
  return acc;
}
export function depthFirstPages(state) {
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

export function pageAction(state, action) {
  while (true) {
    let {screen, increment} = action.action;
    if (screen) {
      state = state.setIn(['ui', 'currentScreen'], screen);
      const dispatch = state.getIn(['quiz', 'screens', screen, 'dispatch']);
      if (dispatch) {
        for (const dispatchCase of dispatch.toJS()) {
          if (dispatchCase.condition) {
            let ok = true;
            for (const conditionType in dispatchCase.condition) {
              if (conditionType === 'atLeast') {
                for (const variable in dispatchCase.condition.atLeast) {
                  const value = state.getIn(['quizState', variable], 0);
                  if (value < dispatchCase.condition.atLeast[variable]) {
                    ok = false;
                  }
                }
              } else {
                throw new Error('invalid conditionType:', conditionType);
              }
            }
            if (ok) {
              return pageAction(state, {action: dispatchCase.action});
            }
          } else {
            return pageAction(state, {action: dispatchCase.action});
          }
        }
      }
    }

    if (increment) {
      for (const variable in increment) {
        state = state.updateIn(
          ['quizState', variable],
          i => (i || 0) + increment[variable]
        );
      }
    }
    return state;
  }
}

export function moveSection(state, action) {
  const {screens, from, to} = action;
  const movedElem = screens[from];
  const insertAfterId = screens[to - (from > to ? 1 : 0)];
  console.log(movedElem, insertAfterId);
  // deleteScreen(quiz, movedElem)
  // insertAfter({quiz,insertAfterId, , })
  return state;
}
