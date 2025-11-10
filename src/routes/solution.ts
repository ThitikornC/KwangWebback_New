import { Router } from 'express';
import * as solutionController from '../controllers/solutionController';

const router = Router();

router.get('/', solutionController.getAllSolutions);
router.post('/', solutionController.createSolution);
router.put('/:id', solutionController.updateSolution); 
router.delete('/:id', solutionController.deleteSolution); 
router.get('/:id',solutionController.getSolutionById);

export default router;