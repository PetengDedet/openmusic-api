const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getNotes(credentialId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
        FROM playlists
        LEFT JOIN users ON playlists.owner = users.id
        WHERE owner = $1
      `,
      values: [credentialId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: `SELECT p.owner, p.id, p.name, u.username 
        FROM playlists p
        LEFT JOIN users u ON p.owner = u.id
        WHERE p.id = $1 LIMIT 1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: `SELECT s.id, s.title, s.performer
        FROM playlistsongs ps
        LEFT JOIN songs s ON ps.song_id = s.id
        WHERE playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifySongExistsInPlaylist(playlistId, songId) {
    const query = {
      text: 'SELECT song_id FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 LIMIT 1',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }

  async addSongToPlaylist(playlistId, songId) {
    const query = {
      text: 'INSERT INTO playlistsongs(playlist_id, song_id) VALUES($1, $2) RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan lagu ke dalam playlist');
    }

    return result.rows[0].id;
  }

  async verifyPlaylistOwner(playlistId, credentialId) {
    const playlist = await this.getPlaylistById(playlistId);

    if (playlist.owner !== credentialId) {
      throw new AuthorizationError('403, Anda bukan pemilik palylist ini');
    }

    return playlist;
  }

  async deletePlaylist(playlistId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1',
      values: [playlistId],
    };
    await this._pool.query(query);

    const query2 = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const id = await this._pool.query(query2);

    return id.rowCount;
  }

  async deletePlaylistSongs(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    await this._pool.query(query);
  }
}

module.exports = PlaylistService;
