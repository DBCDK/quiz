[![Coverage](https://coveralls.io/repos/github/solsort/quiz/badge.svg?branch=master)](https://coveralls.io/github/solsort/quiz?branch=master)
[![Waffle](https://badge.waffle.io/solsort/quiz.svg?columns=all)](https://waffle.io/solsort/quiz)
[![Travis](https://travis-ci.org/solsort/quiz.svg?branch=master)](https://travis-ci.org/solsort/quiz)

# Quiz

In development, nothing to see here yet.

## Getting up and running

Clone the quiz-branch of <https://openplatform.dbc.dk/>, and run it locally:

````
git clone https://github.com/dbcdk/serviceprovider -b 969-quiz
cd serviceprovider
npm run dev

```
This requires postgres server for data storage or edit `config.json` to use sqlite3 a la:
```

knex: {
client: 'sqlite3',
connection: { filename: "./serviceprovider.sqlite" }
},

```
---

Go back to th quiz directory and run `npm start`.

## Dependency rationale

- `create-react-app` for dev/building, - probably change to nwb or [Neutrino](https://neutrinojs.org/) (as recommended by create-react-app) later to support npm package building, - but start out with this for now.
- `openplatform.dbc.dk` api

# Backend

- get
- put
- find

special 'openplatform:types'-type, where id is typename, and object is type meta, defines indexes and aggregators;
```

{
"name": "types",
"mimetype": "application/json;charset=utf-8",
"\_owner": "openplatform",
"permissions": {"read": "any"},
"indexes": [{"type": "key", key: ['\_owner', 'name']}]
}

```
Dependencies

- knex for db/storage
  - postgres
  - optionally sqlite3 for local development instead of postgres
- sharp for image-resizing

DB-schema:

- docs: (uuid id), uuid type, timestamp microsecond - version, string owner, binary data
- index: (uuid type, int index, string key, string value);

# Widget

# Admin
```
````
