# knex-cleaner

[![CircleCI](https://circleci.com/gh/arafel/knex-cleaner.svg?style=svg)](https://circleci.com/gh/arafel/knex-cleaner)

Helper library to clean a PostgreSQL, MySQL or SQLite3 database tables
using Knex. Great for integration tests.

*Note* - the library has migrated to ESM format (import rather than require, etc). This is what prompted the version bump to 2.0.0. There are no functional changes in the library. There are enhancements to testing, so if you pick up the 2.x.x code you'll be picking up something tested against the current major DB versions.

### Installation
```
npm install --save-dev @solarwinter/knex-cleaner
```

or

```
yarn add -D @solarwinter/knex-cleaner
```

### Usage
```javascript
import knexCleaner from '@solarwinter/knex-cleaner';

import knexLib from 'knex';

const knex = knexLib({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'your_database_user',
    password : 'your_database_password',
    database : 'myapp_test'
  }
});

knexCleaner.clean(knex).then(function() {
  // your database is now clean
});

// You can also use this in BookshelfJS
import bookshelfLib from 'bookshelf';

const bookshelf = bookshelfLib(knex);

knexCleaner.clean(bookshelf.knex).then(function() {

});

// You can also pass if it deletes the tables with delete instead of truncate
// as well as a list of tables to ignore.

var options = {
  mode: 'delete', // Valid options 'truncate', 'delete'
  restartIdentity: true, // Used to tell PostgresSQL to reset the ID counter
  ignoreTables: ['Dont_Del_1', 'Dont_Del_2']
}

knexCleaner.clean(knex, options).then(function() {
  // your database is now clean
});
```
The example above used MySQL but it has been tested on PostgreSQL and SQLite3.

# Continued work

This package is based on the original [knex-cleaner package by Steven
Ferguson](https://github.com/steven-ferguson/knex-cleaner). At the
time of writing that package has not been updated for 3 years, and has
out of date dependencies with known security holes. Since that package
appears dormant I've published my fork with updated deps in the hope
it will be useful for someone.
