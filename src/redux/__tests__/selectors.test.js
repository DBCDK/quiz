import {ownQuizzes, loading} from '../selectors';
import Immutable from 'immutable';

describe('selectors', () => {
  describe('ownQuizzes', () => {
    it('finds quizzes', async () => {
      expect(
        ownQuizzes(
          Immutable.fromJS({
            ui: {ownQuizzes: ['a', 'b']},
            quiz: {a: 'c', b: 'd'}
          })
        ).toJS()
      ).toEqual(['c', 'd']);
    });
  });
  describe('loading', async () => {
    it('returns false when not loading', async () => {
      expect(loading(Immutable.fromJS({ui: {loading: 0}}))).toBe(false);
    });
    it('returns true when loading', async () => {
      expect(loading(Immutable.fromJS({ui: {loading: 2}}))).toBe(true);
    });
  });
});
