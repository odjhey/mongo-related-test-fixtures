const Repo = require("../src/Repo");

before(() => {
  return new Promise((resolve, reject) => {
    process.env.APP_DB_NAME = "MONGOTEST909";
    new Repo({
      hooks: {
        save: [
          () => {
            console.log("hook added inb4");
          },
        ],
      },
    })
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
