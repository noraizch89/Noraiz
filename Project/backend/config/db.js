const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,             // change to true if needed
    trustServerCertificate: true,
  },
  authentication: {
    type: 'ntlm',
    options: {
      domain: process.env.DB_DOMAIN,
      userName: process.env.DB_USER,   // Windows username
      password: process.env.DB_PASS    // Windows password
    }
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server with Windows Authentication');
    return pool;
  })
  .catch(err => console.log('DB Connection Failed!', err));

module.exports = { sql, poolPromise };
