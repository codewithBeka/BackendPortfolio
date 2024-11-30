import express from "express"
import { createUser, getCurrentUserProfile, loginUser, logoutCurrentUser, updateCurrentUserProfile, updateUserPassword ,updateUserRole} from "../controllers/usercontroller.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";


const router = express.Router();



router
  .route("/")
  .post(createUser)

  
router.post("/login",loginUser)
router.post("/logout",logoutCurrentUser)


//getcurrent user prodile 
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .patch(authenticate, updateCurrentUserProfile);

router.patch("/password",authenticate,updateUserPassword)




router
.route("/:id/role") // Route to update user role
.put(authenticate, authorizeAdmin, updateUserRole);


export default router;
