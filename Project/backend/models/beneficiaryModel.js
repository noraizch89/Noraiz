const { poolPromise, sql } = require('../config/db');

async function getBeneficiaries(userId) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .query(`
      SELECT b.BeneficiaryID, u.MobileNumber AS BeneficiaryMobile, u.Email
      FROM Beneficiaries b
      JOIN Users u ON b.BeneficiaryUserID = u.UserID
      WHERE b.UserID = @userId
    `);
  return result.recordset;
}

async function addBeneficiary(userId, beneficiaryMobile) {
  const pool = await poolPromise;
  // First get BeneficiaryUserID from mobile
  const userRes = await pool.request()
    .input('mobile', sql.VarChar(20), beneficiaryMobile)
    .query(`SELECT UserID FROM Users WHERE MobileNumber = @mobile AND Status = 'Approved'`);
  if (userRes.recordset.length === 0) {
    throw new Error('Beneficiary mobile not found or not approved');
  }
  const beneficiaryUserId = userRes.recordset[0].UserID;

  // Prevent duplicates & add
  await pool.request()
    .input('userId', sql.Int, userId)
    .input('beneficiaryUserId', sql.Int, beneficiaryUserId)
    .query(`
      IF NOT EXISTS (
        SELECT 1 FROM Beneficiaries WHERE UserID = @userId AND BeneficiaryUserID = @beneficiaryUserId
      )
      INSERT INTO Beneficiaries (UserID, BeneficiaryUserID) VALUES (@userId, @beneficiaryUserId)
    `);
}

module.exports = { getBeneficiaries, addBeneficiary };
