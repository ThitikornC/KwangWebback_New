import express from 'express';
import * as productRoutes from '../controllers/productsController';

const router = express.Router();
router.get('/all', productRoutes.getAll);
router.post('/all', productRoutes.createProduct);
router.get('/cctv', productRoutes.getAllProductsCCTV);
router.get('/:type/:brand/:productCode', productRoutes.getDataOneProduct);

// Search
router.get('/all/:search', productRoutes.getDataForSearchAll);
// Cart
router.get('/product/:id',productRoutes.getProductByUniqueID);


export default router;
