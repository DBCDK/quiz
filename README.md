[![Travis](https://travis-ci.org/DBCDK/quiz.svg?branch=master)](https://travis-ci.org/DBCDK/quiz)
[![Waffle](https://badge.waffle.io/DBCDK/quiz.svg?columns=all)](https://waffle.io/DBCDK/quiz)
[![Coverage](https://coveralls.io/repos/github/DBCDK/quiz/badge.svg?branch=master)](https://coveralls.io/github/DBCDK/quiz?branch=master)

# Quiz

This is the source code, for the quiz tool on <https://quiz.dbc.dk>.
In order to try out the quiz-editing part, you need a clientId/clientSecret to login, which danish libraries can get via a request to DBC, see description on <https://openplatform.dbc.dk>

## Embedding

The quiz can be embedded in other websites like this:

```html
<div id="quizElem"></div>
<script>
  var quiz;
  function initOpenPlatformQuiz() {
    quiz = new openPlatformQuiz.Widget({
      elemId: 'quizElem',
      extraSpacing: true,
      openPlatformToken: 'fd9e275eeb36295971719a77df354f84e9f21ab3',
      quizId: 'ffdfa65b-4b14-4bec-a4bb-5f2938eca897',
      onDone: function(result) {
        console.log(result);
      }
    });
  }
</script>
<script src="https://quiz.dbc.dk/widget.js" async defer></script>
```

The `openPlatformToken` has to be retrieved dynamically, as usual for openplatform access.

If `extraSpacing` is true, extra spacing is added to the embedded quiz, so it has at least the same height as the screen.

Approach to embedding is inspired by how [YouTube](https://developers.google.com/youtube/player_parameters#IFrame_Player_API) and [Google Maps](https://developers.google.com/maps/documentation/javascript/tutorial#HelloWorld) are embedded.
With regard to IFrame vs JavaScript approach, - embedding via JavaScript is choosen as this allows a more responsive view.

Statistics about agency can be submitted with the statisticsEvent method, a la:

```
openPlatformQuiz.statisticsEvent({
    openPlatformToken: '18396c0d40f002d48809f946f96d314c1e01bcf0',
    quizId: 'ffdfa65b-4b14-4bec-a4bb-5f2938eca897',
    type: 'agency',
    subtype: '770100'
})
```

`onDone` is used for getting the quiz state after the quiz has finished.

## Development

Current version uses `create-react-app`, so just `npm install`, and then `npm start` for development. This might later change to nwb or [Neutrino](https://neutrinojs.org/) (as recommended by create-react-app) to support npm package building.

Designwise we try to follow the guidelines [Material Design](https://material.io/design/introduction). This simplifies and improves the visual design process, by avoiding a lot of bikeshedding, and having a common language. We use the components from [Material-UI](https://material-ui.com), and the same approach with JSS for styling.

State management is done using redux/thunk/immutable. All `dispatch`es and `state` access happens through **action creators** and **selectors**.

Code style is enforced using prettier.

## Changelog

### 2018-11-28 Changes based on user feedback

Changes based on user feedback, and various fixes. Ready for release when help-texts are updated.

- browser back button #285
- show maximum possible score when editing quiz endings #306
- admin in two columns with edit and preview #210 #282
- extra spacing in top/bottom of widget #290
- inline editing of quiz endings #287
- layout and quiz-templates #279 #280 #277 #275 #278 #286
- delete button improvements (delete question, button, background-image, ...) #289 #328 #279 #281
- refactoring / updates / test #238 #163 #292 #297
- bugfixes #321 #304 #296 #301 #295
- tooltips and documentation #284 #273 #293 #336 #291 #308 #274

### 2018-11-07 statistics, search, and minor changes

- Statistics #55 #54
- Search #263 #165 #59
- Design / usability / cleanup: background color #248, delete-confirmation #222, emphasise own quizzes #265, quiz new window #245, others read-only #167, misc #249 #60 #104
- Bugfixes #246 #252

### 2018-10-24 quiz.dbc.dk, image-upload, videos, markdown-text, fixes

- quiz.dbc.dk - static pages for admin (with login) and widget #74 #168 #169 #223
- better data for new quiz/question/ending/... #213 #240 #157 #180
- Bugfixes #201 #233 #237
- Refactoring #215
- Videoes in quiz #64
- Image dialog, for uploading, deleting, browsing and selecting images stored in DÅP. #218 #230 #225 #216 #224 #130
- Implementation of widget design incl. image buttons and background image. #138 #220 #188 #189 #197 #196
- Text as markdown (working links, headings, etc...) #202

### 2018-10-10 Quizzes stored in OpenPlatform

- Copy (#166), delete (#164), and create new (#56) quiz
- Fetch quizzes from backend #53, #179, #191, #193
- Store quizzes in backend #181, #102, #151, #162
- Initial static page for embedding widget + link to page from admin. #194
- Backend storage fixes: indexing #1001, #995 and timeout bug #992, wrong status response #997, refactor API #985
- Start on widget design #174 incl. UX-feedback, primary/secondary colors #190
- Start on statistics (define storage-type, and add API in embed code for submitting library info) #175, #171
- Start on UI for searching quizzes, - not yet functional #178, #161
- Embedding in Biblo <https://biblo.demo.dbc.dk/test-sektionsside>

### 2018-09-26 Basic UI for editing single quiz up and running

- (work started on storing quizzes in openplatform, not done yet)
- Admin: Editable dispatch / quiz endings: #63, #145, #150, #143 #144
- Admin: Editable answers for question. #52, #132, #141, #140, #137
- Admin: Editable buttons
- Widget: setting trophies, and working `onDone` callback. #152
- In-person meeting, with discussion/clarification of project. #142

### 2018-09-12 Initial Admin user interface

- Deployment of backend
- Edit individual question/resultpage/... #124, #125, #126
- Edit Quiz details #57
- Refactoring/cleanup/tests/robustness #106, #115, #114, #107, #121
- Reorder questions #99, #58
- Add Question #97

### 2018-08-29 Draft data structures and initial barebone widget

- Documentation/implementation of Code/API for embedding the quiz. #31, #66, #67, #71, #72, #73
- Sample quiz data, #49, #78
- Barebone quiz widget #52, #79, #82, #86, #87, #89
- Application non-visual design: issues #20, interaction-sketch-sketch #51,
- Infrastructure: hot-reloading #85, dbcdk-repository #25, more tests (#77, #91, #84), online demo on github #43
- Backend: image resizing #16, use postgres (#4, #45), scan (#32, #41, #4), misc improvements (#42, #23), cleanup and merge into serviceprovider #40
- Start admin: selector for question-list #96

### 2018-08-15 (sprint skipped due to vacation etc).

### 2018-08-01 Initial setup and backend

- Set up project #1 #26
  - Create repository
  - React app
  - Setup CI
  - Setup Coveralls
  - Setup issue tracking
  - Code formatting with Prettier
  - README with notes
- Data-model #10 #30
  - setup react/redux for project
  - initial draft of data model
- Initial backend #2 #5 #6 #8 #12 #11 #21 #22 #29
  - `/storage`-endpoint: get, put, find, delete (includes new serviceprovider branch various changes to serviceprovider: fix port-conflict, cjs vs esm, js-client configurable host, ...)
  - only for local development.
  - examples / unit tests / documentation
  - image support
