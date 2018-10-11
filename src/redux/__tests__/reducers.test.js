import {root} from '../reducers';
import Immutable from 'immutable';
import sampleState from '../sampleState.js';
import {quizData} from '../../quizData.js';
const stateWithQuiz = sampleState.set('quiz', Immutable.fromJS(quizData));

describe('root reducer', () => {
  describe('@@INIT', () => {
    it('does not change state', async () => {
      expect(root('a', {type: '@@INIT'})).toBe('a');
    });
  });
  describe('INITIALISED', () => {
    it('addes initialisation state', async () => {
      expect(
        root(Immutable.fromJS({}), {
          type: 'INITIALISED',
          state: {hello: 123}
        }).get('hello')
      ).toBe(123);
    });
  });
  describe('LOADING_STARTED', () => {
    it('increases ui.loading', async () => {
      expect(
        root(Immutable.fromJS({widget: {loading: 42}}), {
          type: 'LOADING_STARTED'
        }).getIn(['widget', 'loading'])
      ).toBe(43);
    });
  });
  describe('LOADING_DONE', () => {
    it('increases ui.loading', async () => {
      expect(
        root(Immutable.fromJS({widget: {loading: 42}}), {
          type: 'LOADING_DONE'
        }).getIn(['widget', 'loading'])
      ).toBe(41);
    });
  });
  describe('PAGE_ACTION', () => {
    it('screen-option changes current screen', async () => {
      expect(
        root(Immutable.fromJS({widget: {currentScreen: 'a'}}), {
          type: 'PAGE_ACTION',
          action: {screen: 'b'}
        }).getIn(['widget', 'currentScreen'])
      ).toBe('b');
    });
    it('dispatches to other screen', async () => {
      const newState = root(stateWithQuiz, {
        type: 'PAGE_ACTION',
        action: {screen: 'done'}
      });
      expect(newState.getIn(['widget', 'currentScreen'])).toBe('retry');
    });
    it('dispatches to other screen', async () => {
      const newState = root(
        stateWithQuiz.set(
          'quizState',
          Immutable.fromJS({
            score: 2,
            maxScore: 2
          })
        ),
        {
          type: 'PAGE_ACTION',
          action: {screen: 'done'}
        }
      );
      expect(newState.getIn(['widget', 'currentScreen'])).toBe('won');
    });
  });
  describe('unknown', () => {
    it('does not change state', async () => {
      expect(root('a', {type: 'UNKNOWN_TYPE'})).toBe('a');
    });
  });
});
