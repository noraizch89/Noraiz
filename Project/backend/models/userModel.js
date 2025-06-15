const { poolPromise, sql } = require('../config/db');

async function createUser(mobile, email, passwordHash) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('mobile', sql.VarChar(20), mobile)
    .input('email', sql.VarChar(100), email)
    .input('passwordHash', sql.VarChar(255), passwordHash)
    .query(`INSERT INTO Users (MobileNumber, Email, PasswordHash) VALUES (@mobile, @email, @passwordHash)`);
  return result;
}

async function findUserByMobile(mobile) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('mobile', sql.VarChar(20), mobile)
    .query(`SELECT * FROM Users WHERE MobileNumber = @mobile`);
  return result.recordset[0];
}

async function approveUser(userId) {
  const pool = await poolPromise;
  await pool.request()
    .input('userId', sql.Int, userId)
    .query(`UPDATE Users SET Status = 'Approved', Balance = 5000 WHERE UserID = @userId`);
}

async function getUserById(userId) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .query(`SELECT * FROM Users WHERE UserID = @userId`);
  return result.recordset[0];
}

async function updateBalance(userId, newBalance) {
  const pool = await poolPromise;
  await pool.request()
    .input('userId', sql.Int, userId)
    .input('balance', sql.Float, newBalance)
    .query(`UPDATE Users SET Balance = @balance WHERE UserID = @userId`);
}

module.exports = {
  createUser,
  findUserByMobile,
  approveUser,
  getUserById,
  updateBalance
};
