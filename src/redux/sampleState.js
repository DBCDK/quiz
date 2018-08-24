import Immutable from 'immutable';
import sampleQuizData from '../sampleQuizData';

const sampleState = Immutable.fromJS({
  ui: {
    // will be set to true, when all data is loaded
    initialised: false,
    // non-zero if loading, increases with each load operation, and decreases when done
    loading: 0,
    currentScreen: sampleQuizData.description.start
  },

  // data for the current Quiz
  quiz: sampleQuizData,

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

export default sampleState;
