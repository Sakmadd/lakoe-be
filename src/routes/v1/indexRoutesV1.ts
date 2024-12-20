import express from 'express';
import { authentication } from '../../middlewares/authentication';
import adminsRoutes from './sub-routes/adminsRoutes';
import authRoutes from './sub-routes/authRoutes';
import orderRoutes from './sub-routes/orderRoutes';
import productsRoutes from './sub-routes/productsRoutes';
import shopsRoutes from './sub-routes/shopsRoutes';
import templateRouter from './sub-routes/tempMassageRoutes';
import usersRoutes from './sub-routes/usersRoutes';
import sellerDasboard from './sub-routes/sellerRoutes';

const app = express();

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/shops', authentication, shopsRoutes);
app.use('/products', productsRoutes);
app.use('/orders', orderRoutes);
app.use('/admins', adminsRoutes);
app.use('/template-message', templateRouter);
app.use('/seller', authentication, sellerDasboard);

export const API_V1 = app;
