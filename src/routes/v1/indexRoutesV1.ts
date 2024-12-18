import express from 'express';
import adminsRoutes from './sub-routes/adminsRoutes';
import authRoutes from './sub-routes/authRoutes';
import orderRoutes from './sub-routes/orderRoutes';
import productsRoutes from './sub-routes/productsRoutes';
import shopsRoutes from './sub-routes/shopsRoutes';
import usersRoutes from './sub-routes/usersRoutes';
import { authentication } from '../../middlewares/authentication';
import templateRouter from './sub-routes/tempMassageRoutes';
import dashboardRouter from './sub-routes/dashbordRoutes';

const app = express();

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/shops', authentication, shopsRoutes);
app.use('/products', productsRoutes);
app.use('/orders', orderRoutes);
app.use('/admins', adminsRoutes);
app.use('/template-message', templateRouter);
app.use('/dashboad', dashboardRouter);
export const API_V1 = app;
