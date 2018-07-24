# Quiz

[![Coverage](https://coveralls.io/repos/github/solsort/quiz/badge.svg?branch=master)](https://coveralls.io/github/solsort/quiz?branch=master)
[![Waffle](https://badge.waffle.io/solsort/quiz.svg?columns=all)](https://waffle.io/solsort/quiz)
[![Travis](https://travis-ci.org/solsort/quiz.svg?branch=master)](https://travis-ci.org/solsort/quiz)

In development, nothing to see here yet.

## Getting up and running

Clone the quiz-branch of <https://openplatform.dbc.dk/>, and run it locally:

```
git clone https://github.com/dbcdk/serviceprovider -b 969-quiz
cd serviceprovider
npm run dev
```

---

Go back to th quiz directory and run `npm start`.

## Dependency rationale

- `create-react-app` for dev/building, - probably change to nwb or [Neutrino](https://neutrinojs.org/) (as recommended by create-react-app) later to support npm package building, - but start out with this for now.
- `openplatform.dbc.dk` api

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
