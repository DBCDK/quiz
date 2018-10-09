import {getUser, storage} from './openplatform';
import {searchQuery} from './selectors';
import sampleQuiz from '../sampleQuizData';

export const adminQuizList = () => async (dispatch, getState) => {
  // TODO sync quiz to store
  await searchQuizzes()(dispatch, getState);
  dispatch({
    type: 'ADMIN_QUIZ_LIST'
  });
};

export const addDispatch = screen => {
  return {
    type: 'ADD_DISPATCH',
    screen
  };
};
export const deleteDispatch = o => {
  return {
    type: 'DELETE_DISPATCH',
    ...o
  };
};
export const updateDispatch = o => {
  return {
    type: 'UPDATE_DISPATCH',
    ...o
  };
};
export const addQuestionAnswer = path => {
  return {
    type: 'ADD_QUESTION_ANSWER',
    path: path
  };
};
export const updateScreenElement = o => {
  return {
    type: 'UPDATE_SCREEN_ELEMENT',
    ...o
  };
};
export const updateSetting = (path, setting) => ({
  type: 'UPDATE_QUIZ_SETTING',
  path,
  setting
});
export const addSection = ({before, screenId, screens}) => ({
  type: 'ADMIN_ADD_SECTION',
  before,
  screenId,
  screens
});
export const deleteSection = screenId => ({
  type: 'ADMIN_DELETE_SECTION',
  screenId
});
export const moveSection = o => {
  return {type: 'ADMIN_MOVE_SECTION', ...o};
};
export const editScreen = ({screen}) => ({type: 'ADMIN_EDIT_SCREEN', screen});
export const screenAction = action => ({type: 'PAGE_ACTION', action});
export const changeSearchQuery = query => ({
  type: 'SEARCH_CHANGE_QUERY',
  query
});
export const toggleSearchOwnOnly = query => ({type: 'SEARCH_TOGGLE_OWN_ONLY'});

let quizType, quizImageType, quizStatisticsType, user;
export const searchQuizzes = () => async (dispatch, getState) => {
  const {query, ownOnly} = searchQuery(getState());
  let result = await storage.scan({
    reverse: true,
    _type: quizType,
    index: ['_owner', '_version'],
    startsWith: [user]
    //limit: 10
  });
  result = await Promise.all(result.map(o => storage.get({_id: o.val})));
  dispatch({type: 'SEARCH_RESULTS', searchResults: result});
  return result;
};

export const addQuiz = quiz => async (dispatch, getState) => {
  const {_id} = await storage.put(
    Object.assign({}, quiz ? quiz.toJS() : sampleQuiz, {
      _type: quizType,
      _id: undefined
    })
  );
  await searchQuizzes()(dispatch, getState);
  dispatch({
    type: 'SET_QUIZ',
    quiz: await storage.get({_id})
  });
};
export const setQuiz = quiz => ({type: 'SET_QUIZ', quiz});
export const deleteQuiz = quizId => async (dispatch, getState) => {
  await storage.delete({_id: quizId});
  await searchQuizzes()(dispatch, getState);
};

export const init = ({onDone, quizId}) => async (dispatch, getState) => {
  dispatch({type: 'LOADING_STARTED'});

  user = await getUser();
  if (!user) {
    return dispatch({type: 'LOADING_DONE'});
  }
  if (onDone) {
    dispatch({type: 'ONDONE_CALLBACK', fn: onDone});
  }

  [[quizType], [quizImageType], [quizStatisticsType]] = await Promise.all([
    storage.find({
      _owner: 'openplatform',
      name: 'quiz',
      _type: 'openplatform.type'
    }),
    storage.find({
      _owner: 'openplatform',
      name: 'quizImage',
      _type: 'openplatform.type'
    }),
    storage.find({
      _owner: 'openplatform',
      name: 'quizStatistics',
      _type: 'openplatform.type'
    })
  ]);

  dispatch({
    type: 'INITIALISED',
    state: {
      widget: {
        initialised: true
      },
      storage: {
        user,
        quizImageType,
        quizType
      }
    }
  });

  if (quizId) {
    try {
      const quiz = await storage.get({_id: quizId});
      dispatch(setQuiz(quiz));
      return dispatch({type: 'LOADING_DONE'});
    } catch (e) {
      if (e.statusCode === 404) {
        // TODO handle 404
        dispatch(
          setQuiz({
            _id: quizId,
            title: '404 quiz not found',
            description: 'error',
            tags: [],
            start: 'error',
            screens: {
              error: {
                _id: 'error',
                ui: [
                  {
                    type: 'text',
                    text: `Error: quiz "${quizId}" not found (404)`
                  }
                ],
                log: true
              }
            }
          })
        );
      }
      console.log(e);
    }
  }
  await searchQuizzes()(dispatch, getState);
  return dispatch({type: 'LOADING_DONE'});
};
