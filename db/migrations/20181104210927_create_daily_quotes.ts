import * as Knex from 'knex';

exports.up = function(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable('daily_quotes', (t) => {
    t.primary(['symbol', 'date']);
    t.string('symbol').notNullable();
    t.date('date').notNullable();

    t.float('open').notNullable();
    t.float('high').notNullable();
    t.float('low').notNullable();
    t.float('close').notNullable();
    t.bigInteger('volume').notNullable();
  });
};

exports.down = function(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable('daily_quotes');
};
