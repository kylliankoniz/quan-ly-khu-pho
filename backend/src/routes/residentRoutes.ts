import { Router } from 'express';
// Import thêm hàm updateResident
import { createResident, getResidentsByHousehold, deleteResident, updateResident } from '../controllers/residentController';

const router = Router();

router.post('/', createResident);
router.get('/household/:householdId', getResidentsByHousehold);

// Gom PUT và DELETE chung một route /:id
router.route('/:id')
  .put(updateResident)    // <-- Thêm dòng này
  .delete(deleteResident);

export default router;