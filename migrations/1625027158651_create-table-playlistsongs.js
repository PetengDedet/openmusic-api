/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlistsongs', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(16)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(16)',
      notNull: true,
    },
  });

  // Unique
  pgm.addConstraint('playlistsongs', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, song_id)');

  // playlists table ref
  pgm.addConstraint(
    'playlistsongs', // tableName
    'fk_playlistsong.playlist_playlists.id', // constraintName
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE', // options
  );

  // songs table ref
  pgm.addConstraint(
    'playlistsongs', // tableName
    'fk_playlistsong.song_songs.id', // constraintName
    'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE', // options
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlistsongs', 'fk_playlistsong.playlist_playlists.id');
  pgm.dropConstraint('playlistsongs', 'fk_playlistsong.song_songs.id');

  pgm.dropTable('playlistsongs');
};
