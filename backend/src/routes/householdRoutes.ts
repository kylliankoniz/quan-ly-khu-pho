import { Router } from 'express';
import { createHousehold, getHouseholds, deleteHousehold, updateHousehold} from '../controllers/householdController';

const router = Router();

router.route('/')
  .post(createHousehold)
  .get(getHouseholds);

// Route xóa cần truyền id
router.route('/:id')
    .put(updateHousehold)
  .delete(deleteHousehold);

export default router;