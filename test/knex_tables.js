import BPromise from 'bluebird';
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import * as knexTables from '../lib/knex_tables.js';
import { getEnabledClients } from './db_clients.js';

chai.should();
chai.use(chaiAsPromised);

describe('knex_tables', function() {
  getEnabledClients().forEach(function(dbTestValues) {

    describe(dbTestValues.client, function() {

      beforeEach(async function() {
        await BPromise.all([
          dbTestValues.knex.schema.createTable('test_1', function (table) {
            table.increments();
            table.string('name');
            table.timestamps();
          }),
          dbTestValues.knex.schema.createTable('test_2', function (table) {
            table.increments();
            table.string('name');
            table.timestamps();
          })
        ]);

        return dbTestValues.knex.raw('CREATE VIEW test_view AS SELECT * FROM test_1');
      });

      afterEach(async function() {
        await dbTestValues.knex.raw('DROP VIEW test_view');
        return knexTables.getDropTables(dbTestValues.knex, ['test_1', 'test_2']);
      });

      after(function () {
        return dbTestValues.knex.destroy();
      });

      it('can get all tables', function() {
        return knexTables.getTableNames(dbTestValues.knex)
        .then(function(tables) {
          tables.should.include('test_1');
          tables.should.include('test_2');
        });
      });

      it('can get all tables filtering by ignoreTables option', function() {
        return knexTables.getTableNames(dbTestValues.knex, {
            ignoreTables: ['test_1']
        }).then(function(tables) {
          tables.should.not.include('test_1');
          tables.should.include('test_2');
        });
      });

      it('views should not be in the list of tables', function() {
        return knexTables.getTableNames(dbTestValues.knex)
        .then(function(tables) {
          tables.should.not.include('test_view');
        });
      });

    });

  });

});
