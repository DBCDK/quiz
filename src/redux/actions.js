import {getUser, storage, findOrCreateType} from './openplatform';
import sampleQuiz from '../sampleQuizData';

export const adminQuizList = () => {
  // TODO sync quiz to store
  return {
    type: 'ADMIN_QUIZ_LIST'
  };
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

let quizType, quizImageType, user;
export const searchQuizzes = async ({query, own, tags, title}) => {
  let result = await storage.scan({
    reverse: true,
    _type: quizType,
    index: ['_owner', '_version'],
    startsWith: [user]
    //limit: 10
  });
  result = await Promise.all(result.map(o => storage.get({_id: o.val})));
  return result;
};

export const addQuiz = async dispatch => {
  const {_id} = await storage.put(
    Object.assign({}, sampleQuiz, {_type: quizType, _id: undefined})
  );
  dispatch({
    type: 'SET_QUIZ',
    quiz: await storage.get({_id})
  });
};
export const setQuiz = quiz => ({type: 'SET_QUIZ', quiz});

export const init = () => async dispatch => {
  dispatch({type: 'LOADING_STARTED'});

  user = await getUser();
  if (!user) {
    dispatch({type: 'LOADING_DONE'});
    return;
  }
  [quizType, quizImageType] = await Promise.all([
    findOrCreateType(user, 'quiz', {
      type: 'json',
      indexes: [
        {value: '_id', keys: ['_owner', 'tags', '_version']},
        {value: '_id', keys: ['_owner', 'title', '_version']},
        {value: '_id', keys: ['_owner', '_version']},
        {value: '_id', keys: ['title', '_version']},
        {value: '_id', keys: ['tags', '_version']},
        {value: '_id', keys: ['_version']}
      ],
      permissions: {
        read: 'any'
      }
    }),
    findOrCreateType(user, 'quizImage', {
      type: 'jpeg',
      indexes: [{value: '_id', keys: ['_owner', '_version']}],
      permissions: {
        read: 'any'
      }
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

  const searchResults = await searchQuizzes({query: '', own: true});
  dispatch({type: 'SEARCH_RESULTS', searchResults});
  dispatch({type: 'LOADING_DONE'});
};
