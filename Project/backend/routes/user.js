const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getUserById, updateBalance } = require('../models/userModel');
const { createTransaction, getUserTransactions } = require('../models/transactionModel');
const { getBeneficiaries, addBeneficiary } = require('../models/beneficiaryModel');

router.use(authMiddleware);

// Transfer money
router.post('/transfer', async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { beneficiaryMobile, amount, type } = req.body;

    if (!beneficiaryMobile || !amount || !type) return res.status(400).json({ error: 'Missing fields' });

    const sender = await getUserById(senderId);
    if (!sender || sender.Balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

    // Find beneficiary user id
    const pool = require('../config/db').poolPromise;
    const sql = require('../config/db').sql;
    const poolCon = await pool;
    const resBeneficiary = await poolCon.request()
      .input('mobile', sql.VarChar(20), beneficiaryMobile)
      .query(`SELECT UserID FROM Users WHERE MobileNumber = @mobile AND Status = 'Approved'`);
    if (resBeneficiary.recordset.length === 0) return res.status(400).json({ error: 'Beneficiary not found or not approved' });
    const receiverId = resBeneficiary.recordset[0].UserID;

    // Check beneficiary is in sender's beneficiary list
    const resCheck = await poolCon.request()
      .input('userId', sql.Int, senderId)
      .input('beneficiaryUserId', sql.Int, receiverId)
      .query(`SELECT 1 FROM Beneficiaries WHERE UserID = @userId AND BeneficiaryUserID = @beneficiaryUserId`);
    if (resCheck.recordset.length === 0) return res.status(400).json({ error: 'Beneficiary not in your list' });

    // Deduct from sender balance
    const senderNewBalance = sender.Balance - amount;
    await updateBalance(senderId, senderNewBalance);

    // Add to receiver balance
    const receiver = await getUserById(receiverId);
    const receiverNewBalance = receiver.Balance + amount;
    await updateBalance(receiverId, receiverNewBalance);

    // Log transaction
    await createTransaction(senderId, receiverId, amount, type);

    res.json({ message: 'Transfer successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transactions history
router.get('/transactions', async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await getUserTransactions(userId);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Beneficiary management

// Get beneficiary list
router.get('/beneficiaries', async (req, res) => {
  try {
    const userId = req.user.userId;
    const beneficiaries = await getBeneficiaries(userId);
    res.json(beneficiaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add beneficiary
router.post('/beneficiaries', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { beneficiaryMobile } = req.body;
    if (!beneficiaryMobile) return res.status(400).json({ error: 'Beneficiary mobile required' });

    await addBeneficiary(userId, beneficiaryMobile);
    res.json({ message: 'Beneficiary added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
