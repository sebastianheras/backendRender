import { createPool } from 'mysql2/promise';

/**
 * @description LOCAL
 **/
const config = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'tracker_clientes',
};

export const pool = createPool(config);

//module.exports = pool;
