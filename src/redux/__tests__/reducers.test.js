import {root} from '../reducers';
import Immutable from 'immutable';

describe('root reducer', () => {
  describe('@@INIT', () => {
    it('does not change state', async () => {
      expect(root('a', {type: '@@INIT'})).toBe('a');
    });
  });
  describe('LOADING_STARTED', () => {
    it('increases ui.loading', async () => {
      expect(
        root(Immutable.fromJS({ui: {loading: 42}}), {
          type: 'LOADING_STARTED'
        }).getIn(['ui', 'loading'])
      ).toBe(43);
    });
  });
  describe('LOADING_DONE', () => {
    it('increases ui.loading', async () => {
      expect(
        root(Immutable.fromJS({ui: {loading: 42}}), {
          type: 'LOADING_DONE'
        }).getIn(['ui', 'loading'])
      ).toBe(41);
    });
  });
  describe('unknown', () => {
    it('does not change state', async () => {
      expect(root('a', {type: 'UNKNOWN_TYPE'})).toBe('a');
    });
  });
});
