const { poolPromise, sql } = require('../config/db');

async function createTransaction(senderId, receiverId, amount, type) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('senderId', sql.Int, senderId)
    .input('receiverId', sql.Int, receiverId)
    .input('amount', sql.Float, amount)
    .input('type', sql.VarChar(50), type)
    .query(`INSERT INTO Transactions (SenderID, ReceiverID, Amount, Type) VALUES (@senderId, @receiverId, @amount, @type)`);
  return result;
}

async function getUserTransactions(userId) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .query(`
      SELECT TransactionID, SenderID, ReceiverID, Amount, Type, Timestamp
      FROM Transactions
      WHERE SenderID = @userId OR ReceiverID = @userId
      ORDER BY Timestamp DESC
    `);
  return result.recordset;
}

module.exports = { createTransaction, getUserTransactions };
