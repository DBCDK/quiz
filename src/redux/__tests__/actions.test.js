import {init} from '../actions';

jest.mock('../openplatform');
import * as openplatform from '../openplatform';

describe('reducers', () => {
  describe('init', () => {
    it('initialises store', async () => {
      /*
      openplatform.getUser.mockImplementation(() => 'userId');
      openplatform.findOrCreateType
        .mockImplementationOnce((_, id) => {
          expect(id).toBe('quiz');
          return 'quiztype';
        })
        .mockImplementationOnce((_, id) => {
          expect(id).toBe('quizImage');
          return 'imagetype';
        });
      openplatform.storage.find.mockImplementationOnce(() => ['x']);
      const dispatch = jest.fn();

      await init()(dispatch);

      expect(dispatch.mock.calls[0][0]).toEqual({type: 'LOADING_STARTED'});
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: 'INITIALISED',
        state: {
          storage: {
            quizImageType: 'imagetype',
            quizType: 'quiztype',
            user: 'userId'
          },
          widget: {initialised: true, ownQuizzes: ['x']}
        }
      });
      expect(dispatch.mock.calls[2][0]).toEqual({type: 'LOADING_DONE'});
      expect(dispatch.mock.calls.length).toBe(3);
      */
    });
  });
});
