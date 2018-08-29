import {getUser, storage, findOrCreateType} from './openplatform';

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
      ui: {
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
