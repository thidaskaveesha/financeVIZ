import express from 'express';
import {
  validate
} from '../middleware/validation.js';
import { createTransaction } from '../controllers/transactionController.js';

const router = express.Router();

router.post('/add-transaction', validate, createTransaction);

export default router;
