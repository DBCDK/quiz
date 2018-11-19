import {ownQuizzes, loading, questionList, findMaxState} from '../selectors';
import {sampleState, newQuiz} from '../sampleState';
import Immutable from 'immutable';

describe('selectors', () => {
  describe('ownQuizzes', () => {
    it('finds quizzes', async () => {
      expect(
        ownQuizzes(
          Immutable.fromJS({
            widget: {ownQuizzes: ['a', 'b']},
            quiz: {a: 'c', b: 'd'}
          })
        ).toJS()
      ).toEqual(['c', 'd']);
    });
  });
  describe('loading', async () => {
    it('returns false when not loading', async () => {
      expect(loading(Immutable.fromJS({widget: {loading: 0}}))).toBe(false);
    });
    it('returns true when loading', async () => {
      expect(loading(Immutable.fromJS({widget: {loading: 2}}))).toBe(true);
    });
  });
});
describe('admin selectors', () => {
  describe('topNodes', () => {
    it('finds top nodes screen graph', () => {
      expect(questionList(sampleState)).toMatchSnapshot();
      expect(questionList(newQuiz)).toMatchSnapshot();
    });
  });
  describe('findMaxState', () => {
    it('finds maximum state values', () => {
      expect(findMaxState(newQuiz.get('quiz'))).toMatchSnapshot();
    });
  });
});
