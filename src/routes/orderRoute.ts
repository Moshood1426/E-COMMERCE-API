import express from 'express';
import { authenticateUser, authorizeRoles } from "../middleware/auth";
import {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder,
  } from '../controllers/orderController';

const router = express.Router();

router
  .route('/')
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizeRoles('admin'), getAllOrders);

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders);

router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

export default router;