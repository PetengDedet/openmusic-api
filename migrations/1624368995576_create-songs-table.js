/* eslint-disable camelcase */

// exports.shorthands = undefined; // Ini boleh dihapus. Tidak digunakan

exports.up = pgm => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(21)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    duration: {
      type: 'INT',
      notNull: true,
      default: 0,
    },
    insertedAt: {
      type: 'DATETIME',
      norNull: true,
    },
    updatedAt: {
      type: 'DATETIME',
      notNull: true,
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('songs');
};
