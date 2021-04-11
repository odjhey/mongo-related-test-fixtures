const Repo = require("../src/Repo");
const { coll1 } = require("./fixtures/init-data.js");

before(() => {
  return new Promise((resolve, reject) => {
    process.env.APP_DB_NAME = "MONGOTEST909";
    new Repo()
      // hydrate test data, from json file
      .save("coll1", coll1)
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
