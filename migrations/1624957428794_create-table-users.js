/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(16)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(250)',
      notNull: true,
      unique: true,
    },
    fullname: {
      type: 'VARCHAR(250)',
      notNull: true,
    },
    password: {
      type: 'VARCHAR(250)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
