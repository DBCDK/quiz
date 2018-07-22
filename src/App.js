import React, {Component} from 'react';

async function main() {
  let result;
  const op = window.dbcOpenPlatform;

  const [type_t] = await op.storage({
    find: {_owner: 'openplatform', name: 'type'}
  });

  try {
    result = await op.storage({find: {_owner: 'openplatform', name: 'type'}});
    console.log(0, result);

    result = await op.storage({get: result[0]});
    console.log(1, result);

    result = await op.storage({
      put: {
        _type: type_t,
        name: 'quiz',
        contenttype: 'application/json',
        charset: 'utf-8',
        permissions: {
          read: 'any'
        },
        indexes: [{type: 'id', keys: ['tags']}]
      }
    });
    console.log(2, result);
    const quiz_t = result._id;

    let o = {
      _type: quiz_t,
      tags: ['foo', 'bar', 'baz']
    };
    result = await op.storage({put: o});
    console.log('o', o);
    console.log(3, result);

    Object.assign(o, result);
    o.tags = ['foo', 'quux'];
    console.log('o', o);

    result = await op.storage({put: o});
    console.log(4, result);
  } catch (e) {
    console.log(e);
  }
  /*
  result = await window.dbcOpenPlatform.storage({put: {
      _type: 'openplatform.type',
      id: 'openplatform.type'
      }});
      */
}
main();
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
