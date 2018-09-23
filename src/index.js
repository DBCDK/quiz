import React from 'react';
import ReactDOM from 'react-dom';
import QuizWidget from './components/Widget';
import QuizAdmin from './components/Admin';
import store from './redux/store';
import {} from './redux/autosave';
import {Provider} from 'react-redux';

if (typeof window.openPlatformQuiz !== 'object') {
  window.openPlatformQuiz = {};
}

window.addEventListener('load', () => {
  if (typeof window.initOpenPlatformQuiz === 'function') {
    window.initOpenPlatformQuiz();
  }
});

function mount(Cls, {elemId, onDone}) {
  if (onDone) {
    store.dispatch({type: 'ONDONE_CALLBACK', fn: onDone});
  }
  ReactDOM.render(
    <Provider store={store}>
      <Cls />
    </Provider>,
    document.getElementById(elemId)
  );
}

class Widget {
  constructor(args) {
    mount(QuizWidget, args);
  }
}

class Admin {
  constructor(args) {
    mount(QuizAdmin, args);
  }
}

window.openPlatformQuiz.Widget = Widget;
window.openPlatformQuiz.Admin = Admin;

if (module.hot) {
  module.hot.accept(['./components/Widget', './components/Admin'], () =>
    window.initOpenPlatformQuiz()
  );
}
