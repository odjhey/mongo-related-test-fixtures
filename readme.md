# GOALS
- [x] add dummy data on start of test
- [x] cleanup after test
- [ ] enable a way to add a "hook" on db operations

```
    "test": "mocha --file ./test/mongo-setup.js --reporter spec --exit"
```

```
    "chai": "^4.3.4",
    "mocha": "^8.3.2",
    "mongodb": "^3.6.5",
    "prettier": "^2.2.1",
    "sinon": "^10.0.0"
```

```javascript
const MongoClient = require("mongodb").MongoClient;

class AppRepository {
  cachedDb = null;

  constructor() {}

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
    return this.connectToDatabase().then((db) =>
      db.collection(_collectionName).insertOne(payload)
    );
  }

  async dropCollections() {
    console.log("dropping collection");
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
  console.log("global before hook");
  return new Promise((resolve, reject) => {
    process.env.APP_DB_NAME = "MONGOTEST222";
    new AppRepository()
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
  console.log("global after hook");
  return new Promise((resolve, reject) => {
    new AppRepository()
      .dropCollections()
      .then(() => {
        console.log("delete success");
        resolve({ message: "done" });
      })
      .catch((e) => {
        reject({ message: e.message });
      });
  });
});
```
