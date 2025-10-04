import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

// GET /api/expenses?companyId=...&userId=...
router.get('/', async (req, res) => {
  const { companyId, userId } = req.query;
  if (!companyId || !userId) {
    return res.status(400).json({ error: 'companyId and userId are required' });
  }
  try {
    const expenses = await Expense.find({
      company_id: companyId,
      user_id: userId
    }).select('category_id username description amount currency expense_date status')
    .populate('category_id', 'name');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;