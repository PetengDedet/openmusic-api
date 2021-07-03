const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class CollaboarionsService {
  constructor() {
    this._pool = new Pool();
  }

	async verifyUserExistsInPlaylist(playlistId, userId) {
    const query = {
      text: 'SELECT user_id FROM collaborations WHERE playlist_id = $1 AND user_id = $2 LIMIT 1',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }

	async addCollaboration(playlistId, userId) {
		const id = nanoid(16);
		const query = {
			text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
			values: [id, playlistId, userId],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new InvariantError('Gagal menambahkan user ke dalam kolaborasi');
		}

		return result.rows[0].id;
	}

	async deleteCollaboration(playlistId, userId) {
		const query = {
			text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
			values: [playlistId, userId],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new InvariantError('Gagal menghapus user dari kolaborasi');
		}

		return result.rows[0].id;
	}
}

module.exports = CollaboarionsService;
