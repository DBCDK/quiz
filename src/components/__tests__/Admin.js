import React from 'react';
import ReactDOM from 'react-dom';
import {Admin} from '../Admin';
import renderer from 'react-test-renderer';
import Immutable from 'immutable';

it('renders without crashing', () => {
  const tree = renderer
    .create(
      <Admin
        questions={[]}
        classes={{}}
        settings={Immutable.fromJS({tags: []})}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
