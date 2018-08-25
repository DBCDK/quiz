import sampleState from './sampleState';

const initialState = sampleState;

export function root(state = initialState, action) {
  switch (action.type) {
    case '@@INIT':
      return state;
    case 'INITIALISED':
      return state.mergeDeep(action.state);
    case 'LOADING_STARTED':
      return state.updateIn(['ui', 'loading'], i => i + 1);
    case 'LOADING_DONE':
      return state.updateIn(['ui', 'loading'], i => i - 1);
    case 'PAGE_ACTION': {
      let {screen} = action.action;
      if (screen) {
        state = state.setIn(['ui', 'currentScreen'], screen);
      }
      return state;
    }
    default:
      console.log('Unrecognised action', action);
      return state;
  }
}
