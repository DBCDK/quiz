import sampleState from './sampleState';
import {moveSection, deleteSection, addSection} from './quizElements';

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

export function root(state = initialState, action) {
  switch (action.type) {
    case '@@INIT':
      return state;
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
    default:
      console.log('Unrecognised action', action);
      return state;
  }
}
