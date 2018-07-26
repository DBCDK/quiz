import {getUser, storage, findOrCreateType} from './openplatform';

export const init = () => async dispatch => {
  dispatch({type: 'LOADING_STARTED'});

  const user = await getUser();
  if (!user) {
    dispatch({type: 'LOADING_DONE'});
    return;
  }
  const [quizType, quizImageType, pageType] = await Promise.all([
    findOrCreateType(user, 'QUIZ', {
      type: 'json',
      indexes: [{type: 'id', keys: ['_owner']}],
      permissions: {
        read: 'any'
      }
    }),
    findOrCreateType(user, 'QUIZ_IMAGE', {
      type: 'jpeg',
      indexes: [{type: 'id', keys: ['_owner']}],
      permissions: {
        read: 'any'
      }
    }),
    findOrCreateType(user, 'PAGE', {
      type: 'json',
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
        quizType,
        pageType
      }
    }
  });
  dispatch({type: 'LOADING_DONE'});
};
