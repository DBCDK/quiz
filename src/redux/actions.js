import {getUser, storage, findOrCreateType} from './openplatform';

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

export const init = () => async dispatch => {
  dispatch({type: 'LOADING_STARTED'});

  const user = await getUser();
  if (!user) {
    dispatch({type: 'LOADING_DONE'});
    return;
  }
  const [quizType, quizImageType] = await Promise.all([
    findOrCreateType(user, 'QUIZ', {
      type: 'json',
      indexes: [{value: '_id', keys: ['_owner']}],
      permissions: {
        read: 'any'
      }
    }),
    findOrCreateType(user, 'QUIZ_IMAGE', {
      type: 'jpeg',
      indexes: [{value: '_id', keys: ['_owner']}],
      permissions: {
        read: 'any'
      }
    })
  ]);
  const ownQuizzes = await storage.find({_owner: user, _type: quizType});
  dispatch({
    type: 'INITIALISED',
    state: {
      widget: {
        initialised: true,
        ownQuizzes
      },
      storage: {
        user,
        quizImageType,
        quizType
      }
    }
  });
  dispatch({type: 'LOADING_DONE'});
};
