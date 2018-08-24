import React, {Component} from 'react';
import {ownQuizzes, loading} from '../redux/selectors';

class Admin extends Component {
  render() {
    return (
      <div>
        <h1>Quiz Admin here...</h1>
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

export default Admin;