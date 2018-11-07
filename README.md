[![Travis](https://travis-ci.org/DBCDK/quiz.svg?branch=master)](https://travis-ci.org/DBCDK/quiz)
[![Waffle](https://badge.waffle.io/DBCDK/quiz.svg?columns=all)](https://waffle.io/DBCDK/quiz)
[![Coverage](https://coveralls.io/repos/github/DBCDK/quiz/badge.svg?branch=master)](https://coveralls.io/github/DBCDK/quiz?branch=master)

# Quiz

In development, nothing to see here yet.

Early / unfinished demo-version with dummy data is deployed to <https://quiz.dbc.dk/>.

## Embedding

The quiz is embedded like this:

```html
<div id="quizElem"></div>
<script>
    var quiz;
    function initOpenPlatformQuiz() {
        quiz = new openPlatformQuiz.Widget({
            elemId: 'quizElem',
            openPlatformToken: 'fd9e275eeb36295971719a77df354f84e9f21ab3',
            quizId: 'ffdfa65b-4b14-4bec-a4bb-5f2938eca897',
            onDone: function(result) { console.log(result); }
        });
    }
</script>
<script src="https://example.com/quiz.js" async defer></script>
```

**Notice:** `example.com/` above should be replaced with the proper url where the script is distributed. This will be clarified later. Currently <https://quiz.dbc.dk/widget.js> is the _unstable_ development version, which can be used for testing, but may or may not work..

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

Instantiationg `openPlatformQuiz.Widget` adds a quiz at the named document element. The following CSS-classes can be used for styling:

- TODO
- TODO

## Getting dev-environment up and running

Run a local instance of
<https://openplatform.dbc.dk/>:

```
git clone https://github.com/DBCDK/serviceprovider
cd serviceprovider
npm run dev
```

This runs a local instance of <https://openplatform.dbc.dk/>, which is used for storage.

Then run `npm start` in the directory of this repository.

# Changelog and Tasks

Major tasks remaining before preview/alpha-state:

- [x] UX for quiz widget embedding
- [x] Static embedding of widget+admin (on quiz.dbc.dk or similar)
- [x] Support for embedded videos
- [x] Admin: ability to upload a picture

Major tasks remaining before release:

- [x] Admin: quizzes by other users
- [x] Statistics
- [ ] User testing of widget
- [ ] User testing of admin, and better UX+design of admin

Changelog for past sprints:

## 2018-11-21 fixes based on user feedback

Plan: fixes based on user feedback

## 2018-11-07 statistics, search, and minor changes

- Statistics #55 #54
- Search #263 #165 #59
- Design / usability / cleanup: background color #248, delete-confirmation #222, emphasise own quizzes #265, quiz new window #245, others read-only #167, misc #249 #60 #104
- Bugfixes #246 #252

## 2018-10-24 quiz.dbc.dk, image-upload, videos, markdown-text, fixes

- quiz.dbc.dk - static pages for admin (with login) and widget #74 #168 #169 #223
- better data for new quiz/question/ending/... #213 #240 #157 #180
- Bugfixes #201 #233 #237
- Refactoring #215
- Videoes in quiz #64
- Image dialog, for uploading, deleting, browsing and selecting images stored in DÅP. #218 #230 #225 #216 #224 #130
- Implementation of widget design incl. image buttons and background image. #138 #220 #188 #189 #197 #196
- Text as markdown (working links, headings, etc...) #202

## 2018-10-10 Quizzes stored in OpenPlatform

- Copy (#166), delete (#164), and create new (#56) quiz
- Fetch quizzes from backend #53, #179, #191, #193
- Store quizzes in backend #181, #102, #151, #162
- Initial static page for embedding widget + link to page from admin. #194
- Backend storage fixes: indexing #1001, #995 and timeout bug #992, wrong status response #997, refactor API #985
- Start on widget design #174 incl. UX-feedback, primary/secondary colors #190
- Start on statistics (define storage-type, and add API in embed code for submitting library info) #175, #171
- Start on UI for searching quizzes, - not yet functional #178, #161
- Embedding in Biblo <https://biblo.demo.dbc.dk/test-sektionsside>

## 2018-09-26 Basic UI for editing single quiz up and running

- (work started on storing quizzes in openplatform, not done yet)
- Admin: Editable dispatch / quiz endings: #63, #145, #150, #143 #144
- Admin: Editable answers for question. #52, #132, #141, #140, #137
- Admin: Editable buttons
- Widget: setting trophies, and working `onDone` callback. #152
- In-person meeting, with discussion/clarification of project. #142

## 2018-09-12 Initial Admin user interface

- Deployment of backend
- Edit individual question/resultpage/... #124, #125, #126
- Edit Quiz details #57
- Refactoring/cleanup/tests/robustness #106, #115, #114, #107, #121
- Reorder questions #99, #58
- Add Question #97

## 2018-08-29 Draft data structures and initial barebone widget

- Documentation/implementation of Code/API for embedding the quiz. #31, #66, #67, #71, #72, #73
- Sample quiz data, #49, #78
- Barebone quiz widget #52, #79, #82, #86, #87, #89
- Application non-visual design: issues #20, interaction-sketch-sketch #51,
- Infrastructure: hot-reloading #85, dbcdk-repository #25, more tests (#77, #91, #84), online demo on github #43
- Backend: image resizing #16, use postgres (#4, #45), scan (#32, #41, #4), misc improvements (#42, #23), cleanup and merge into serviceprovider #40
- Start admin: selector for question-list #96

## 2018-08-15 (sprint skipped due to vacation etc).

## 2018-08-01 Initial setup and backend

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

# Notes

## Data model

An example of what quiz-data can look like can be seen in `src/sampleQuizData.js`. The structure of the application state can be seen in the top of `src/redux/reducers.js`

## Dependencies

Try to keep the number of dependencies low.
When adding a dependency, also add the rationale here.

- React
- Redux/thunk/immutable-js for state management. Thunk and immutable-js are the library choices recommended by redux for asynchronous changes, and immutable data structures.
- JSS for styling. Having CSS in JavaScript simplifies things by not having another language. It gives flexibility as you can JavaScript programming to define styles. JSS is one of the major library for this, and is also used by material-ui, which we might choose to use later on.
- `openplatform.dbc.dk` api.
- mustache for templating text within quizzes

Development:

- `create-react-app` for dev/building, - probably change to nwb or [Neutrino](https://neutrinojs.org/) (as recommended by create-react-app) later to support npm package building, - but start out with this for now.
- prettier for enforcing coding style

## Backend

Note: This documentation will be moved into serviceprovider at some point.

The quiz widget will use <https://openplatform.dbc.dk> as backend. This is issue [#969](https://github.com/DBCDK/serviceprovider/issues/969) in the serviceprovider repository.

The backend is general document storage.

- Each document is identified by an `_id` which is an UUID.
- Each document has a `_type` which is an UUID, of a document in the document storage, which contain meta info about the document.
- Each document has a `_version` which is a strictly increasing modification timestamp. If several updates happens within the same millisecond, this may be a few milliseconds into the future. This is included when updating documents to detect conflicts.
- Each document has an `_owner` and `_client` which identifies the user and application which are has changed it. This is used for access controle, i.e. only an `_owner` can change a given document.

API-examples:

- `{"get":"UUID"}` retrieves a document.
- `{"put":{"_type":"UUID","some":{"other":"properties"}}}` store a new document, - returns new `_id`, `_version`, etc. which has to be included on changes.
- `{"put":{"_type":"UUID","_id":"UUID","_version":"DATE","some":{"other":"properties"}}}` update a document. `_version` must match current version in server, to check for conflicts
- `{"find":{"_type":"UUID", "key1":"val1", "key2":"val2"}}` search the database. The type needs to have an index containing `key1` and `key2`.
- `{"find":{"_owner":"openplatform", "name":"type"}}` when not `_type` is submitted it defaults to the type-type, thus this finds the uuid of the type-type.

`_type`-UUID refers to JSON documents in the document store, which contains type information. It has at least the following properties:

- `contenttype` - currently only `"application/json"` is supported, `"image/jpeg"` will be added soon.
- `permissions` - currently only `{"read":"any"}` is supported which allows all to read.
- `name` - the name of the type, this is indexed together with the owner.
- `indexes` - list of indexes on the type. Each index has the form `{"type":"id","keys":["key1","key2","keyN"]}`. Only `"id"` as type is currently supported. Later on aggregate function "count" will be added. The keys are property-names of the stored object. The JSONified combined key will be truncated to 255 chars on most databases.

DB-schema:

- docs: (uuid id), uuid type, timestamp microsecond version, string owner, string client, binary data
- index: (uuid type, int index, string key, string value);

## Application state

We use redux/thunk/immutable. All `dispatch`es and `state` access happens through **action creators** and **selectors**. This has many benefits, including making it easier to improve performance, and to refactor state, so do not manually create actions or traverse state.

## Visual design.

Use [material design](https://material.io/design/introduction). This simplifies and improves the visual design process, by avoiding a lot of bikeshedding, and having a common language.

## UI-sketch/flow

### Quizzes

All screens in the actual quiz seems to have this structure

```svgbob
+----------------------+
| Quiz-titel           |
|                      |
|+--------------------+|
||Billede eller video ||
||                    ||
||                    ||
||                    ||
|+--------------------+|
|                      |
| tekst                |
|                      |
|+--------------------+|
||.------------------.||
||| svar1            |||
||'------------------'||
||.------------------.||
||| svar2            |||
||'------------------'||
||.------------------.||
||| svar3            |||
||'------------------'||
|+--------------------+|
|                      |
|.--------------------.|
||   Knap-titel       ||
|'--------------------'|
+----------------------+
```

With certain parts omitted.

### Admin

Admin UI has three part:

- find/create/copy/delete quizzes
- edit full quiz
  - description
  - intro
  - questions
  - endings
- edit screen
  - edit question (has subscreens: ending-prices)
  - edit endings (has subscreen: help, responses)
  - edit (intro/help/response/ending-prize)
