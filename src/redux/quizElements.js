import Immutable from 'immutable';

function deepReplace(o, from, to) {}

export function deleteSection(quiz, id) {
  console.log('here', id);
  console.log(String(quiz.getIn(['screens', id])));
  return quiz;
}

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
export function breadthFirstPages(quiz) {
  const toVisit = [quiz.getIn(['description', 'start'])];
  const pages = [];
  const screens = quiz.getIn(['screens']);
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

export function moveSection(state, action) {
  const {screens, from, to} = action;
  const movedElem = screens[from];
  const insertAfterId = screens[to - (from > to ? 1 : 0)];
  console.log(movedElem, insertAfterId);
  // deleteScreen(quiz, movedElem)
  // insertAfter({quiz,insertAfterId, , })
  return state;
}
