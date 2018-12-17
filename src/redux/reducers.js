import {sampleState} from './sampleState';
import {storage} from './openplatform';
import {
  dispatchActionData,
  infoScreenData,
  answerButtonData
} from '../quizData';
import Immutable from 'immutable';
import uuidv4 from 'uuid/v4';
import assert from 'assert';

const initialState = sampleState;

function deepReplace(o, from, to) {
  if (o.map) {
    return o.map(v => deepReplace(v, from, to));
  }
  if (o === from) {
    return to;
  }
  return o;
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
function addSection(quiz, {screenId, screens, before}) {
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
  screens = Immutable.fromJS(screens);

  let needsReplace = Immutable.Set([quiz.get('start')]);
  let prevSet;
  do {
    prevSet = needsReplace;
    /* eslint-disable no-loop-func */
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
function deleteSection(quiz, id) {
  let screens = quiz.get('screens');
  const next = screens.getIn([id, 'nextSection']);

  const toDelete = sectionScreens(quiz, id);
  screens = screens.filter((screen, screenId) => !toDelete.includes(screenId));
  quiz = quiz.set('screens', screens);

  return deepReplace(quiz, id, next);
}
function pageAction(state, action) {
  let {screen, increment, set, callback} = action.action;

  if (screen) {
    state = state.setIn(['widget', 'currentScreen'], screen);
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
    if (!!state.getIn(['quiz', 'screens', screen, 'log'])) {
      storage.put({
        _type: 'openplatform.quizStatistics',
        date: new Date().toISOString().slice(0, 10),
        quiz: state.getIn(['quiz', '_id']),
        type: 'screen',
        subtype: screen
      });
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

  if (set) {
    state = state.update('quizState', quizState =>
      quizState.merge(Immutable.fromJS(set))
    );
  }

  if (callback) {
    try {
      state.getIn(['widget', 'onDone'], () => {})(
        state.get('quizState').toJS()
      );
    } catch (e) {
      console.error(
        'Error in quiz embedding, exception during onDone callback:',
        e
      );
    }
  }

  return state;
}
function sortDispatchesByAtLeastScore(state, screen) {
  return state.updateIn(['quiz', 'screens', screen, 'dispatch'], o =>
    o.sort(
      (a, b) =>
        b.getIn(['condition', 'atLeast', 'score'], -1) -
        a.getIn(['condition', 'atLeast', 'score'], -1)
    )
  );
}

export function root(state = initialState, action) {
  switch (action.type) {
    case '@@INIT': {
      return state;
    }
    case 'STATISTICS': {
      return state.set('statistics', action.statistics);
    }
    case 'WIDGET_SETTINGS': {
      for (const key in action) {
        if (key !== 'type') {
          state = state.setIn(['widget', key], action[key]);
        }
      }
      return state;
    }
    case 'QUIZ_WIDTH': {
      return state.getIn(['widget', 'width']) === action.width
        ? state
        : state.setIn(['widget', 'width'], action.width);
    }
    case 'ADD_DISPATCH': {
      const newScreen = uuidv4();
      state = state.setIn(
        ['quiz', 'screens', newScreen],
        Immutable.fromJS(
          infoScreenData({
            _id: newScreen,
            parent: action.screen,
            action: {
              screen: state.getIn(['quiz', 'start'])
            },
            text:
              'Tillykke, du havde {{correct}} ud af {{questionCount}} rigtige',
            buttonText: 'Prøv igen'
          })
        )
      );
      state = state.updateIn(
        ['quiz', 'screens', action.screen, 'dispatch'],
        o => o.push(Immutable.fromJS(dispatchActionData({screen: newScreen})))
      );
      return sortDispatchesByAtLeastScore(state, action.screen);
    }
    case 'DELETE_DISPATCH': {
      state = state.updateIn(
        ['quiz', 'screens', action.screen, 'dispatch'],
        o => o.delete(action.pos)
      );
      // TODO: prune orphaned screens
      return state;
    }
    case 'UPDATE_DISPATCH': {
      state = state.updateIn(
        ['quiz', 'screens', action.screen, 'dispatch', action.pos],
        action.updateFn
      );
      return sortDispatchesByAtLeastScore(state, action.screen);
    }
    case 'UPDATE_SCREEN_ELEMENT': {
      state = state.updateIn(
        ['quiz', 'screens', action.screen, 'ui', action.pos],
        action.updateFn
      );
      // TODO: prune orphaned screens
      return state;
    }
    case 'UPDATE_QUIZ_SETTING': {
      return state.setIn(
        ['quiz'].concat(action.path),
        Immutable.fromJS(action.setting)
      );
    }
    case 'INITIALISED': {
      return state.mergeDeep(action.state);
    }
    case 'SEARCH_RESULTS': {
      return state.set('searchResults', Immutable.fromJS(action.searchResults));
    }
    case 'LOADING_STARTED': {
      return state.updateIn(['widget', 'loading'], i => i + 1);
    }
    case 'LOADING_DONE': {
      return state.updateIn(['widget', 'loading'], i => i - 1);
    }
    case 'ADMIN_EDIT_SCREEN': {
      return state.setIn(['admin', 'currentScreen'], action.screen);
    }
    case 'PAGE_ACTION': {
      return pageAction(state, action);
    }
    case 'SET_QUIZ': {
      const quiz = Immutable.fromJS(action.quiz);
      return pageAction(state.set('quiz', quiz), {
        action: {screen: quiz.get('start')}
      });
    }
    case 'ADMIN_QUIZ_LIST': {
      return state.delete('quiz');
    }
    case 'ADMIN_ADD_SECTION': {
      return state.update('quiz', quiz => addSection(quiz, action));
    }
    case 'ADMIN_DELETE_SECTION': {
      return state.update('quiz', quiz => deleteSection(quiz, action.screenId));
    }
    case 'ADMIN_MOVE_SECTION': {
      const {screens, from, to} = action;
      if (
        (typeof to === 'number' && from === screens.length - 1) ||
        to === screens.length - 1 ||
        to === 0
      ) {
        return state;
      }
      const movedElem = screens[from];
      const insertBeforeId =
        screens[(to + (from > to ? 0 : 1)) % screens.length];
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
    case 'ADD_QUESTION_ANSWER': {
      const nextScreen = state.getIn([
        'quiz',
        'screens',
        action.path[0],
        'nextSection'
      ]);
      const answerScreen = uuidv4();
      state = state.setIn(
        ['quiz', 'screens', answerScreen],
        Immutable.fromJS(
          infoScreenData({
            _id: answerScreen,
            parent: action.path[0],
            action: {screen: nextScreen}
          })
        )
      );

      state = state.updateIn(
        ['quiz', 'screens', action.path[0], 'ui', action.path[1], 'ui'],
        buttonGroupUI =>
          buttonGroupUI.push(
            Immutable.fromJS(answerButtonData({nextScreen: answerScreen}))
          )
      );
      return state;
    }
    case 'SEARCH_CHANGE_QUERY': {
      return state.setIn(['searchQuery', 'query'], action.query);
    }
    case 'SEARCH_TOGGLE_OWN_ONLY': {
      return state.updateIn(['searchQuery', 'ownOnly'], value => !value);
    }
    default: {
      console.log('Unrecognised action', action);
      return state;
    }
  }
}
