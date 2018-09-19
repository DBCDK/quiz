import sampleState from './sampleState';
import {moveSection, deleteSection, addSection} from './quizElements';
import Immutable from 'immutable';
import uuidv4 from 'uuid/v4';

const initialState = sampleState;

function pageAction(state, action) {
  while (true) {
    let {screen, increment} = action.action;
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
    case '@@INIT':
      return state;
    case 'DELETE_DISPATCH':
      state = state.updateIn(
        ['quiz', 'screens', action.screen, 'dispatch'],
        o => o.delete(action.pos)
      );
      // TODO: prune orphaned screens
      return state;
    case 'UPDATE_DISPATCH':
      state = state.updateIn(
        ['quiz', 'screens', action.screen, 'dispatch', action.pos],
        action.updateFn
      );
      return sortDispatchesByAtLeastScore(state, action.screen);
    case 'UPDATE_SCREEN_ELEMENT':
      state = state.updateIn(
        ['quiz', 'screens', action.screen, 'ui', action.pos],
        action.updateFn
      );
      // TODO: prune orphaned screens
      return state;
    case 'UPDATE_QUIZ_SETTING':
      return state.setIn(
        ['quiz', 'settings'].concat(action.path),
        Immutable.fromJS(action.setting)
      );
    case 'INITIALISED':
      return state.mergeDeep(action.state);
    case 'LOADING_STARTED':
      return state.updateIn(['widget', 'loading'], i => i + 1);
    case 'LOADING_DONE':
      return state.updateIn(['widget', 'loading'], i => i - 1);
    case 'ADMIN_EDIT_SCREEN':
      return state.setIn(['admin', 'currentScreen'], action.screen);
    case 'PAGE_ACTION':
      return pageAction(state, action);
    case 'ADMIN_ADD_SECTION':
      return state.update('quiz', quiz => addSection(quiz, action));
    case 'ADMIN_DELETE_SECTION':
      return state.update('quiz', quiz => deleteSection(quiz, action.screenId));
    case 'ADMIN_MOVE_SECTION':
      return moveSection(state, action);
    case 'ADD_QUESTION_ANSWER': {
      // TODO add answer-response-screen

      const nextScreen = state.getIn([
        'quiz',
        'screens',
        action.path[0],
        'nextSection'
      ]);
      const answerScreen = uuidv4();
      state = state.setIn(
        ['quiz', 'screens', answerScreen],
        Immutable.fromJS({
          _id: answerScreen,
          parent: action.path[0],
          ui: [
            {
              type: 'media',
              image: ''
            },
            {
              type: 'text',
              text: 'Forklaring af resultatet'
            },
            {type: 'button', text: 'videre', action: {screen: nextScreen}}
          ],
          log: true
        })
      );

      state = state.updateIn(
        ['quiz', 'screens', action.path[0], 'ui', action.path[1], 'ui'],
        buttonGroupUI =>
          buttonGroupUI.push(
            Immutable.fromJS({
              type: 'button',
              text: 'Tekst på svarknap',
              action: {
                screen: answerScreen,
                increment: {score: 0, correct: 0, questionCount: 1}
              }
            })
          )
      );
      return state;
    }
    default:
      console.log('Unrecognised action', action);
      return state;
  }
}
