import Immutable from 'immutable';

function deepReplace(o, from, to) {
  if (o.map) {
    return o.map(v => deepReplace(v, from, to));
  }
  if (o === from) {
    return to;
  }
  return o;
}

export function deleteSection(quiz, id) {
  let screens = quiz.get('screens');
  const next = screens.getIn([id, 'nextSection']);

  const toDelete = [id];
  let deleteCount;
  do {
    deleteCount = toDelete.length;
    for (const [screenId, screen] of screens) {
      const parent = screen.get('parent');
      if (toDelete.includes(parent) && !toDelete.includes(screenId)) {
        toDelete.push(screenId);
      }
    }
  } while (deleteCount !== toDelete.length);

  screens = screens.filter((screen, screenId) => !toDelete.includes(screenId));
  quiz = quiz.set('screens', screens);

  return deepReplace(quiz, id, next);
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

export function moveSection(state, action) {
  const {screens, from, to} = action;
  const movedElem = screens[from];
  const insertAfterId = screens[to - (from > to ? 1 : 0)];
  console.log(movedElem, insertAfterId);
  // deleteScreen(quiz, movedElem)
  // insertAfter({quiz,insertAfterId, , })
  return state;
}
