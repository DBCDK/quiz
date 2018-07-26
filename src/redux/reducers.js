import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  ui: {
    // will be set to true, when all data is loaded
    initialised: false,
    // non-zero if loading, increases with each load operation, and decreases when done
    loading: 0
  },

  // documents from storage (possibly altered locally). key is uuid, value is document.
  quiz: {},
  page: {},

  storage: {
    // storage user id, initialised on start
    user: undefined,

    // storage type uuids, initialised on start
    quizType: undefined,
    imageType: undefined,
    pageType: undefined,

    // mirror of data in storage, used for to find local changes to sync to storage
    quiz: {},
    page: {}
  }
});

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
    default:
      console.log('Unrecognised action', action);
      return state;
  }
}
