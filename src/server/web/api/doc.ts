import * as Express from "express"
import { PERMISSIONS } from "../../permissions"

const router = Express.Router();

router.get('/permissions', (req,res,next) => {

    res.status(200).json(PERMISSIONS)

})

export default router;