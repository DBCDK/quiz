import Immutable from 'immutable';
import {quizData} from '../quizData.js';

export const sampleState = Immutable.fromJS({
  admin: {
    // edit a single screen if currentScreen is set
    currentScreen: undefined
  },
  widget: {
    // will be set to true, when all data is loaded
    initialised: false,
    // non-zero if loading, increases with each load operation, and decreases when done
    loading: 0,
    currentScreen: undefined
  },
  quizState: {},

  // data for the current Quiz
  quiz: undefined,

  searchQuery: {
    query: '',
    ownOnly: true
  },

  searchResults: [],

  storage: {
    // storage user id, initialised on start
    user: undefined,

    // storage type uuids, initialised on start
    quizType: undefined,
    imageType: undefined,

    // mirror of data in storage, used for to find local changes to sync to storage
    quiz: {},
    page: {}
  }
});
export const newQuiz = sampleState.set('quiz', Immutable.fromJS(quizData()));
