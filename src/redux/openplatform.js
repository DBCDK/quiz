export async function getUser() {
  await ensureDbcOpenPlatform();
  const {
    storage: {user}
  } = await window.dbcOpenPlatform.status({fields: ['storage']});
  return user;
}

const storageFn = async o => {
  await ensureDbcOpenPlatform();
  return await window.dbcOpenPlatform.storage(o);
};

let typeType;
export const storage = {
  get: o => storageFn({get: o}),
  delete: o => storageFn({delete: o}),
  put: o => storageFn({put: o}),
  find: o => storageFn({find: o}),
  scan: o => storageFn({scan: o}),
  typeType: () => {
    if (!typeType) {
      typeType = Promise.resolve(
        (async () =>
          (await storage.find({_owner: 'openplatform', name: 'type'}))[0])()
      );
    }
    return typeType;
  }
};
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const elem = document.createElement('script');
    elem.src = url;
    elem.onload = resolve;
    elem.onerror = reject;
    document.head.appendChild(elem);
  });
}
async function ensureDbcOpenPlatform() {
  if (!window.dbcOpenPlatform) {
    await loadScript('https://openplatform.dbc.dk/v3/dbc_openplatform.min.js');
  }
}
export async function connect(token) {
  await ensureDbcOpenPlatform();
  const result = await window.dbcOpenPlatform.connect(token);
  return result;
}

export default {connect, storage, getUser};
