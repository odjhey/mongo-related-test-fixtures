const MongoClient = require("mongodb").MongoClient;

class Repo {
  cachedDb = null;

  constructor() {
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

before(() => {
  return new Promise((resolve, reject) => {
    process.env.APP_DB_NAME = "MONGOTEST909";
    new Repo()
      // hydrate test data, from json file
      .save("coll1", {
        appId: 12345,
        versions: [{ appVersion: "1.1" }, { appVersion: "1.2" }],
      })
      .then(() => {
        resolve({ message: "done" });
      })
      .catch((e) => {
        reject({ message: e.message });
      });
  });
});

after(() => {
  return new Promise((resolve, reject) => {
    new Repo()
      .dropCollections()
      .then(() => {
        resolve({ message: "done" });
      })
      .catch((e) => {
        reject({ message: e.message });
      });
  });
});
