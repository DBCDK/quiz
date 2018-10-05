import React from 'react';
import ReactDOM from 'react-dom';
import QuizWidget from './components/Widget';
import QuizAdmin from './components/Admin';
import store from './redux/store';
import {} from './redux/autosave';
import {Provider} from 'react-redux';
import openplatform from './redux/openplatform';

if (typeof window.openPlatformQuiz !== 'object') {
  window.openPlatformQuiz = {};
}

window.addEventListener('load', () => {
  if (typeof window.initOpenPlatformQuiz === 'function') {
    window.initOpenPlatformQuiz();
  }
});

async function mount(Cls, {elemId, onDone, openPlatformToken}) {
  if (onDone) {
    store.dispatch({type: 'ONDONE_CALLBACK', fn: onDone});
  }
  openPlatformToken && (await openplatform.connect(openPlatformToken));
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
window.openPlatformQuiz.statisticsEvent = async ({
  openPlatformToken,
  quizId,
  type,
  subtype
}) => {
  openPlatformToken && (await openplatform.connect(openPlatformToken));
  if (quizId === undefined) throw new Error('missing quizId');
  if (type === undefined) throw new Error('missing type');
  if (subtype === undefined) throw new Error('missing subtype');
  openplatform.storage.put({
    _type: 'openplatform.quizStatistics',
    date: new Date().toISOString().slice(0, 10),
    quiz: quizId,
    type,
    subtype
  });
};

if (module.hot) {
  module.hot.accept(['./components/Widget', './components/Admin'], () =>
    window.initOpenPlatformQuiz()
  );
}
