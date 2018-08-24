import React, {Component} from 'react';
import {ownQuizzes, loading} from '../redux/selectors';

class Widget extends Component {
  render() {
    return (
      <div>
        <h1>Quiz Widget here...</h1>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    loading: loading(state),
    ownQuizzes: ownQuizzes(state)
  };
}

export default Widget;
