import React from 'react';
import ReactDOM from 'react-dom';
import Admin from '../Admin';
import renderer from 'react-test-renderer';
import sampleState from '../../redux/sampleState';
import Immutable from 'immutable';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

jest.mock('react-beautiful-dnd');

const stateStore = initialState =>
  createStore((state = initialState, action) => state);

const renderFromState = state =>
  renderer
    .create(
      <Provider store={stateStore(state)}>
        <Admin />
      </Provider>
    )
    .toJSON();

it('renders editing of intro', () => {
  const tree = renderFromState(
    sampleState.setIn(['admin', 'currentScreen'], 'intro')
  );
  expect(tree).toMatchSnapshot();
});

it('renders editing of a question', () => {
  const tree = renderFromState(
    sampleState.setIn(['admin', 'currentScreen'], 'question1')
  );
  expect(tree).toMatchSnapshot();
});

it('renders editing of a quiz', () => {
  const tree = renderFromState(sampleState);
  expect(tree).toMatchSnapshot();
});
