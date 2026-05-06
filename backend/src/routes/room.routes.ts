import { Router } from "express";
import { prisma } from "../config/prisma";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { id: "asc" }
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms" });
  }
});

export default router;