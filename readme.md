# GOALS

- [x] add dummy data on start of test
- [x] cleanup after test
- [x] enable a way to add a "hook" on db operations
- [x] read hydrate-data from external file
- [ ] start your actual usecases boi

```jsonc
// package.json

    "scripts" : {
      "test": "mocha --file ./test/mongo-setup.js --reporter spec --exit"
    },

    "deps" : {
      "chai": "^4.3.4",
      "mocha": "^8.3.2",
      "mongodb": "^3.6.5",
      "prettier": "^2.2.1",
      "sinon": "^10.0.0"
    }
```
