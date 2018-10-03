import store from './store';
import {storage} from './openplatform';

let prevQuiz;

let needsSave = false;
async function doSave() {
  needsSave = false;
  if (!prevQuiz) {
    return;
  }
  await storage.put(prevQuiz.delete('_version').toJS());
  console.log('saved');
}

function scheduleSave() {
  if (needsSave) {
    return;
  }
  setTimeout(doSave, 5000);
  needsSave = true;
}

store.subscribe(async () => {
  const quizData = store.getState().get('quiz');
  if (prevQuiz && quizData && !quizData.equals(prevQuiz)) {
    scheduleSave();
  } else if (!quizData && prevQuiz) {
    if (needsSave) {
      await doSave();
    }
  }
  prevQuiz = quizData;
});
