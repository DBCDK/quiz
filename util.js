async function connect() {
  userstatus.innerHTML = 'connecting...';
  try {
    await dbcOpenPlatform.connect(
      username.value,
      password.value
    );
    const status = await dbcOpenPlatform.status({fields: ['storage']});
    userstatus.innerHTML = 'Connected as storage user: ' + status.storage.user;
  } catch (e) {
    console.log(e);
    userstatus.innerHTML = 'ERROR: ' + e;
  }
}

async function lookupType() {
  foundType.innerHTML = 'loading...';
  let result = await dbcOpenPlatform.storage({
    find: {
      _type: 'openplatform.type',
      _owner: typeOwner.value,
      name: typeName.value
    }
  });
  if (result.length === 0) {
    foundType.innerHTML = 'not found';
  }
  return result[0];
}

async function findType() {
  try {
    await connect();
    result = await dbcOpenPlatform.storage({get: {_id: await lookupType()}});
    foundType.innerHTML = `<pre>${JSON.stringify(result, null, 4).replace(
      /</g,
      '&lt;'
    )}</pre>`;
  } catch (e) {
    console.log(e);
    foundType.innerHTML = 'ERROR: ' + e;
  }
}

async function deleteType() {
  try {
    await connect();
    result = await dbcOpenPlatform.storage({delete: {_id: await lookupType()}});
    foundType.innerHTML = 'delete result: ' + JSON.stringify(result);
  } catch (e) {
    console.log(e);
    foundType.innerHTML = 'ERROR: ' + e;
  }
}

async function selectPredefinedType() {
  typeJson.value = JSON.stringify(
    {
      '': {},
      quiz: {
        name: 'quiz',
        type: 'json',
        indexes: [
          {
            value: '_id',
            keys: ['_owner', 'tags', '_version']
          },
          {
            value: '_id',
            keys: ['_owner', 'title', '_version']
          },
          {
            value: '_id',
            keys: ['_owner', '_version']
          },
          {
            value: '_id',
            keys: ['title', '_version']
          },
          {
            value: '_id',
            keys: ['tags', '_version']
          },
          {
            value: '_id',
            keys: ['_version']
          }
        ],
        permissions: {
          read: 'any'
        },
        _type: 'openplatform.type'
      },
      quizImage: {
        name: 'quizImage',
        type: 'jpeg',
        indexes: [
          {
            value: '_id',
            keys: ['_owner', '_version']
          }
        ],
        permissions: {
          read: 'any'
        },
        _type: 'openplatform.type'
      },
      quizStatistics: {
        name: 'quizStatistics',
        type: 'json',
        indexes: [
          {
            value: '_count',
            keys: ['quiz', 'date', 'type', 'subtype']
          },
          {
            value: '_count',
            keys: ['quiz', 'type', 'subtype']
          }
        ],
        permissions: {
          read: 'any'
        },
        _type: 'openplatform.type'
      }
    }[predefinedTypes.value],
    null,
    4
  );
}

async function putObject() {
  try {
    await connect();
    const object = JSON.parse(typeJson.value);
    typeJson.value = 'Putting object...';
    const result = await dbcOpenPlatform.storage({put: object});
    typeJson.value = 'Object stored!';
  } catch (e) {
    console.log(e);
    typeJson.value = 'ERROR: ' + e;
  }
}
