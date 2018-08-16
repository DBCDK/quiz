[![Travis](https://travis-ci.org/solsort/quiz.svg?branch=master)](https://travis-ci.org/solsort/quiz)
[![Waffle](https://badge.waffle.io/solsort/quiz.svg?columns=all)](https://waffle.io/solsort/quiz)
[![Coverage](https://coveralls.io/repos/github/solsort/quiz/badge.svg?branch=master)](https://coveralls.io/github/solsort/quiz?branch=master)

# Quiz

In development, nothing to see here yet.

Status:

- only local development version, not deployable yet.

## Getting up and running

Clone the quiz-branch of <https://openplatform.dbc.dk/>, and run it locally:

```
git clone https://github.com/dbcdk/serviceprovider -b 969-quiz
cd serviceprovider
npm run dev
```

Then run `npm start` in the directory of this repository.

# Changelog / sprints

## 2018-08-29

- demo deployment #43
- backend: lookup type-name when not uuid, #23

## 2018-08-15 (sprint skipped due to vacation etc).

## 2018-08-01 Initial setup

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

Initial draft / analysis of data model / state.

Data types in storage:

- Quiz (owner-date, tags-date, title, date, tag-count)
  - title
  - Description
  - Styling+Background
  - Welcome (Welcome page)
  - Questions array(Question-pages - also implicit)
  - Final (Final-dispatch page - also implicit)
  - Tags
- Page
  - Page types: Welcome, Question, Help-text, Response-feedback, Final-dispatch, Final-feedback(w/badge)
  - Video or Image
  - Text
  - ShouldStatBeSubmitted
  - Actions (next, help, responses, ...)
    - Label
    - Type
    - Next-page (or next-pages conditioned)
    - StateChange
- Stat (idx: count: pageid+client, count: pageid)
  - client / bibliotek
  - pageid
- BibProfil: client -> bibliotek

Redux state design can be seen in `src/reducers.js`.

## Dependencies

Try to keep the number of dependencies low.
When adding a dependency, also add the rationale here.

- React
- Redux/thunk/immutable-js for state management. Thunk and immutable-js are the library choices recommended by redux for asynchronous changes, and immutable data structures.
- JSS for styling. Having CSS in JavaScript simplifies things by not having another language. It gives flexibility as you can JavaScript programming to define styles. JSS is one of the major library for this, and is also used by material-ui, which we might choose to use later on.
- `openplatform.dbc.dk` api.

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

## Kick-off

Noter / idéer ifbm. kick-off mødet:

- Process
  - Demo: evt. via screenrecording
  - Har struktureret
- Datamodel og backend
- Design
- Nedbrydning af opgaver

## Contributing

TODO: add other choices here, i.e.: airbnb style guide, feature-branches, issue-structure, sprint-structure. TODO: add `CONTRIBUTING.md`

## Application state

We use redux/thunk/immutable. All `dispatch`es and `state` access happens through **action creators** and **selectors**. This has many benefits, including making it easier to improve performance, and to refactor state, so do not manually create actions or traverse state.

## Visual design.

Use [material design](https://material.io/design/introduction). This simplifies and improves the visual design process, by avoiding a lot of bikeshedding, and having a common language.

## Sprint-done checklist

- git tag
- short overview of changes above
- demo, evt. via simplescreenrecorder
- Later: some kind of deployment
