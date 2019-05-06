module.exports = {
  "development": {
    // "username": "root",
    // "password": null,
    // "database": "express-mvp-db",
    // "host": "127.0.0.1",
    "dialect": "sqlite",
    "storage": "./data/express-mvp-db.db"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
