const { outputRun404,
  outpuNoRunChoiceError,
  outputCollectionNotExists } = require('../output');

module.exports = (args, db) => {
  let request_id = args._[1];

  if (!request_id) {
    outpuNoRunChoiceError();
    return;
  }

  let req = null;
  let collectionName = null;
  if (request_id.indexOf(':') == -1) {
    req = db.getRequestFromHistory(request_id);
  } else {
    let collectionRequest = request_id.split(':');
    collectionName = collectionRequest[0];

        if (!db.getCollection(collectionName)) {
            return outputCollectionNotExists();
        }
        if(collectionRequest[1] === 'all'){
          db.getCollections()[collectionName].map(async request => {
            req = await db.getRequestFromCollection(collectionName, request.id);
            if (req) {
              await require('./curlx')(args, req.command, db);
              await console.log('                                               ')
              await console.log('===============================================')
              await console.log('                                               ')
            } else {
              await outputRun404(collectionName);
            }
          })

        }else{
            let req_id = collectionRequest[1];
            console.table({collection: collectionName, Request: req_id })
            req = db.getRequestFromCollection(collectionName, req_id);

            if (req) {
              require('./curlx')(args, req.command, db);
            } else {
              outputRun404(collectionName);
            }
        }
    }
}
