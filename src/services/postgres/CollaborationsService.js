const { Pool } = require('pg');

class CollaboarionsService {
  constructor() {
    this._pool = new Pool();
  }
}

module.exports = CollaboarionsService;
