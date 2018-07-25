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

# Design choices

In progress, up for discussion.

Coding style enforced via `prettier`.

Dependencies:

- jss for styling (and probably use material-ui)
- redux+immutable for state
- `openplatform.dbc.dk` api
- `create-react-app` for dev/building, - probably change to nwb or [Neutrino](https://neutrinojs.org/) (as recommended by create-react-app) later to support npm package building, - but start out with this for now.

# Data model

Initial draft / analysis of data model / state.

Redux stat design (admin)

- ui - ui state
  - user
  - misc state for editing
  - current quiz
  - current page
- quizzes - uuid -> quiz data as in storage
- pages -> uuid -> page data as in storage
- synced - mirror of quizzes/pages which represents the state on the server
  - quizzes
  - pages

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

# Backend

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

# Widget

# Admin

# Changelog / sprints

## 2018-08-15 - v0.0.2

## 2018-08-01 - v0.0.1

- Set up project:
  - Create repository
  - Setup CI
  - Setup Coveralls
  - Setup issue tracking
  - Readme including guide to get up and running
- Initial backend
  - Serviceprovider branch
  - Various changes to serviceprovider: fix port-conflict, cjs vs esm, js-client configurable host, ...
  - `/storage`-endpoint: get, put, find, delete
  - examples / unit tests

## Sprint-done checklist

- git tag
- short overview of changes above
- demo, evt. via simplescreenrecorder
- Later: some kind of deployment
