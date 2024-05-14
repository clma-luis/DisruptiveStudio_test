import { Router } from "express";
import { SeedController } from "./seedController";

const router = Router();

const seedController = new SeedController();
const { executeRoleSeed, executeUserSeed } = seedController;

router.get("/executeRoles", executeRoleSeed);
router.get("/executeUsers", executeUserSeed);

export default router;
