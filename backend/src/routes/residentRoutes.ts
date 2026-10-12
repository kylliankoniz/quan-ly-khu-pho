import { Router } from 'express';
// Import thêm hàm updateResident
import { createResident, getResidentsByHousehold, deleteResident, updateResident, getAllResidents } from '../controllers/residentController';

const router = Router();

router.post('/', createResident);
router.get('/household/:householdId', getResidentsByHousehold);
router.get('/', getAllResidents);

// Gom PUT và DELETE chung một route /:id
router.route('/:id')
  .put(updateResident)    // <-- Thêm dòng này
  .delete(deleteResident);

export default router;