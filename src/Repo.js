const MongoClient = require("mongodb").MongoClient;

class Repo {
  cachedDb = null;

  constructor(options) {
    this.hooks = options ? options.hooks : { save: [] };
    /*
    this.hooks = {
      save: [
        (...args) => {
          console.log("save got called with ", args);
        },
        (...args) => {
          if (args[0] === "coll1") {
            // debugger
            console.log("show debugger to inspect ", args[0]);
          }
        },
      ],
    };
    */
  }

  async connectToDatabase() {
    const APP_DB_NAME = process.env.APP_DB_NAME;
    const APP_CONECTION_URI = `mongodb://localhost:27017/${APP_DB_NAME}`;

    if (this.cachedDb) {
      return Promise.resolve(this.cachedDb);
    }
    return MongoClient.connect(APP_CONECTION_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((client) => {
      const db = client.db(APP_DB_NAME);
      this.cachedDb = db;
      return this.cachedDb;
    });
  }

  async save(_collectionName, payload) {
    // execute all hooks in order
    this.hooks["save"].forEach((fn) => {
      fn(_collectionName, payload);
    });
    return this.connectToDatabase().then((db) =>
      db.collection(_collectionName).insertOne(payload)
    );
  }

  async dropCollections() {
    return this.connectToDatabase().then((db) => {
      return db
        .listCollections()
        .toArray()
        .then((cols) => {
          cols.forEach((col) => {
            db.collection(col.name).deleteMany({});
          });
        });
    });
  }
}

module.exports = Repo;
