import React from 'react';
import ReactDOM from 'react-dom';
import Admin from '../Admin';
import renderer from 'react-test-renderer';
import {sampleState} from '../../redux/sampleState';
import Immutable from 'immutable';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {testQuiz1} from '../../testData';

jest.mock('react-beautiful-dnd');
const testState = sampleState.set('quiz', Immutable.fromJS(testQuiz1));

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

it('renders editing of info pages', () => {
  expect(
    renderFromState(testState.setIn(['admin', 'currentScreen'], 'intro'))
  ).toMatchSnapshot();
  expect(
    renderFromState(
      testState.setIn(['admin', 'currentScreen'], 'question1help')
    )
  ).toMatchSnapshot();
});
it('renders different endings', () => {
  expect(
    renderFromState(
      testState.setIn(
        ['admin', 'currentScreen'],
        '82e6df55-a1f8-4cd6-9ced-4ad8a997b04b'
      )
    )
  ).toMatchSnapshot();
  expect(
    renderFromState(
      testState.setIn(
        ['admin', 'currentScreen'],
        'd485421a-b9c4-43f6-a52e-bc1984381e66'
      )
    )
  ).toMatchSnapshot();
  expect(
    renderFromState(
      testState.setIn(
        ['admin', 'currentScreen'],
        '57b4bccd-1bfe-471b-87e4-6bb6a642fd66'
      )
    )
  ).toMatchSnapshot();
});
it('renders editing of a question', () => {
  expect(
    renderFromState(testState.setIn(['admin', 'currentScreen'], 'question1'))
  ).toMatchSnapshot();
});
it('renders editing of dispatch', () => {
  expect(
    renderFromState(testState.setIn(['admin', 'currentScreen'], 'done'))
  ).toMatchSnapshot();
});
it('renders editing of a quiz', () => {
  const tree = renderFromState(testState);
  expect(tree).toMatchSnapshot();
});
it('renders search when no quiz', () => {
  expect(renderFromState(sampleState)).toMatchSnapshot();
  expect(
    renderFromState(
      sampleState.set('searchResults', Immutable.fromJS([testQuiz1]))
    )
  ).toMatchSnapshot();
});
