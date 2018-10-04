export async function getUser() {
  if (!window.dbcOpenPlatform) {
    return;
  }
  const {
    storage: {user}
  } = await window.dbcOpenPlatform.status({fields: ['storage']});
  return user;
}

const storageFn = window.dbcOpenPlatform && window.dbcOpenPlatform.storage;
let typeType;
export const storage = {
  get: o => storageFn({get: o._id}),
  delete: o => storageFn({delete: o._id}),
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
export async function findOrCreateType(owner, name, typeData) {
  let typeId = (await storage.find({_owner: owner, name}))[0];
  if (!typeId) {
    const typeDoc = await storage.put({
      _type: await storage.typeType(),
      _owner: owner,
      name,
      ...typeData
    });
    typeId = typeDoc._id;
  }
  return typeId;
}
