import Immutable from 'immutable';
import assert from 'assert';

function deepReplace(o, from, to) {
  if (o.map) {
    return o.map(v => deepReplace(v, from, to));
  }
  if (o === from) {
    return to;
  }
  return o;
}

export function addSection(quiz, {screenId, screens, before}) {
  screens = Immutable.fromJS(screens);

  let needsReplace = Immutable.Set([quiz.get('start')]);
  let prevSet;
  do {
    prevSet = needsReplace;
    prevSet.forEach(screenId => {
      const children = findScreenActions(quiz.getIn(['screens', screenId]));
      children.forEach(child => {
        if (child !== before) {
          needsReplace = needsReplace.add(child);
        }
      });
    });
  } while (!prevSet.equals(needsReplace));

  needsReplace.forEach(replaceInId => {
    quiz = quiz.updateIn(['screens', replaceInId], screen =>
      deepReplace(screen, before, screenId)
    );
  });

  assert(screens.getIn([screenId, 'nextSection']));
  screens = deepReplace(
    screens,
    screens.getIn([screenId, 'nextSection'], before),
    before
  );
  quiz = quiz.set('screens', quiz.get('screens').merge(screens));

  return quiz;
}

function sectionScreens(quiz, sectionId) {
  const screens = [sectionId];
  let count;
  do {
    count = screens.length;
    for (const [screenId, screen] of quiz.get('screens')) {
      const parent = screen.get('parent');
      if (screens.includes(parent) && !screens.includes(screenId)) {
        screens.push(screenId);
      }
    }
  } while (count !== screens.length);
  return screens;
}

export function deleteSection(quiz, id) {
  let screens = quiz.get('screens');
  const next = screens.getIn([id, 'nextSection']);

  const toDelete = sectionScreens(quiz, id);
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
  if (
    (typeof to === 'number' && from === screens.length - 1) ||
    to === screens.length - 1 ||
    to === 0
  ) {
    return state;
  }
  const movedElem = screens[from];
  const insertBeforeId = screens[(to + (from > to ? 0 : 1)) % screens.length];
  let movedScreens = sectionScreens(state.get('quiz'), movedElem);
  movedScreens = movedScreens.map(id => [
    id,
    state.getIn(['quiz', 'screens', id])
  ]);
  movedScreens = new Immutable.Map(movedScreens);
  let quiz = deleteSection(state.get('quiz'), movedElem);
  quiz = addSection(quiz, {
    before: insertBeforeId,
    screenId: movedElem,
    screens: movedScreens
  });
  return state.set('quiz', quiz);
}
