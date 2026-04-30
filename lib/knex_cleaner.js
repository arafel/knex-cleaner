import BPromise from 'bluebird';
import _ from 'lodash';

import { getTableNames, getPgSchema } from './knex_tables.js';

const DefaultOptions = {
  mode: 'truncate',    // Can be ['truncate', 'delete']
  restartIdentity: true, // Used to tell PostgresSQL to reset the ID counter
  ignoreTables: []     // List of tables to not delete
};

function clean(knex, passedInOptions) {
  const options = _.defaults({}, passedInOptions, DefaultOptions);

  return getTableNames(knex, options)
  .then(function(tables) {
    if (options.mode === 'delete') {
      return cleanTablesWithDeletion(knex, tables);
    }
    return cleanTablesWithTruncate(knex, tables, options);
  });
}

function cleanTablesWithDeletion(knex, tableNames) {
  return BPromise.map(tableNames, function(tableName) {
    return knex.select().from(tableName).del();
  });
}

function cleanTablesWithTruncate(knex, tableNames, options) {
  const client = knex.client.dialect;

  switch (client) {
    case 'mysql':
      return knex.transaction(function(trx) {
        return knex.raw('SET FOREIGN_KEY_CHECKS=0').transacting(trx)
        .then(function() {
          return BPromise.map(tableNames, function(tableName) {
            return knex(tableName).truncate().transacting(trx);
          });
        })
        .then(function() {
          return knex.raw('SET FOREIGN_KEY_CHECKS=1').transacting(trx);
        })
        .then(trx.commit);
      });
    case 'postgresql':
      if (_.has(tableNames, '[0]')) {
        const pgSchema = getPgSchema(knex);
        const quotedTableNames = tableNames.map(function(tableName) {
          return pgSchema + '.' + '"' + tableName + '"';
        });
        let rawSQL = 'TRUNCATE ' + quotedTableNames.join();
        if (options.restartIdentity) rawSQL += ' RESTART IDENTITY';
        rawSQL += ' CASCADE';
        return knex.raw(rawSQL);
      }
      return undefined;
    case 'sqlite3':
      return BPromise.map(tableNames, function(tableName) {
        return knex(tableName).truncate();
      });
    default:
      throw new Error('Could not get the sql to select table names from client: ' + client);
  }
}

export { clean };
export default { clean };
