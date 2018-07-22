# Quiz

In development, nothing to see here yet.

## Getting up and running

Clone the quiz-branch of <https://openplatform.dbc.dk/>, and run it locally:

```
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

Functionality is inspired / a subset of CouchDB.
API is RPC rather than REST.

- get
- put
- db (define views)
- attachment (save image / fetch image / resize image)
- view (search/aggregate)

Dependencies

- knex for db/storage
  - postgres
  - optionally sqlite3 for local development instead of postgres
- sharp for image-resizing

DB-schema:

- docs: db, docid, rev, owner, data
- attachments: db, docid, attname, mime, data
- (views: viewid, key, value, docid)
- (cache: ...)

# Widget

# Admin
