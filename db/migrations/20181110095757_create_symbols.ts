import * as Knex from 'knex';

exports.up = function(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable('symbols', (t) => {
    t.string('symbol')
      .primary()
      .notNullable();
    t.string('name').notNullable();
    t.string('type').notNullable();
    t.string('region').notNullable();
    t.string('marketOpen').notNullable();
    t.string('marketClose').notNullable();
    t.string('timeZone').notNullable();
    t.string('currency').notNullable();
  });
};

exports.down = function(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable('symbols');
};
