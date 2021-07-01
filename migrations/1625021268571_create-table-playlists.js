/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(16)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(250)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(16)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'playlists', // tableName
    'fk_playlists.owner_users.id', // constrantName
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE', // Options
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('notes', 'fk_playlists.owner_users.id');
  pgm.dropTable('playlists');
};
