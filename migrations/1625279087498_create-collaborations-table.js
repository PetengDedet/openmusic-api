/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(16)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(16)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(16)',
      notNull: true,
    },
  });

  // Unique
  pgm.addConstraint('collaborations', 'unique_playlist_id_and_user_id', 'UNIQUE(playlist_id, user_id)');

  // playlists table ref
  pgm.addConstraint(
    'collaborations', // tableName
    'fk_collaborations.playlist_playlists.id', // constraintName
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE', // options
  );

  // users table ref
  pgm.addConstraint(
    'collaborations', // tableName
    'fk_collaborations.user_users.id', // constraintName
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE', // options
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('collaborations', 'fk_collaborations.playlist_playlists.id');
  pgm.dropConstraint('collaborations', 'fk_collaborations.user_users.id');

  pgm.dropTable('collaborations');
  pgm.dropTable('playlistsongs');
  pgm.dropTable('playlists');
  pgm.dropTable('authentications');
  pgm.dropTable('users');
  pgm.dropTable('songs');

  //
  pgm.sql('DELETE FROM pgmigrations');
};
