import express from "express";
import AuthController from "../controllers/AuthController.js";
import MosqueController from "../controllers/MosqueController.js";
import EventController from "../controllers/EventController.js";
import ReportController from "../controllers/ReportController.js";
import TakmirController from "../controllers/TakmirController.js";
import createStorage from "../core/Storage.js";
const router = express.Router();
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

router.get("/mosque", MosqueController.index);
router.get("/mosque/:id", MosqueController.show);
router.get("/mosque/search/:keyword", MosqueController.search);

router.put(
  "/protected/mosque/:id",
  createStorage("/mosques").single("pic"),
  MosqueController.update
);
router.post(
  "/protected/mosque",
  createStorage("/mosques").single("pic"),
  MosqueController.store
);
router.delete("/protected/mosque", MosqueController.destroy);
router.post("/protected/mosque/check", MosqueController.check);
router.get("/event", EventController.index);
router.get("/event/:id", EventController.show);
router.get("/event/search/:keyword", EventController.search);

router.put(
  "/protected/event/:id",
  createStorage("/events").single("pic"),
  EventController.update
);
router.post(
  "/protected/event",
  createStorage("/events").single("pic"),
  EventController.store
);
router.delete("/protected/event", EventController.destroy);

router.get("/report", ReportController.index);
router.get("/report/:id", ReportController.show);
router.get("/report/search/:keyword", ReportController.search);

router.put("/protected/report/:id", ReportController.update);
router.post("/protected/report", ReportController.store);
router.delete("/protected/report", ReportController.destroy);

router.get("/takmir", TakmirController.index);
router.get("/takmir/:id", TakmirController.show);
router.get("/protected/takmir/webadmin", TakmirController.getWebadmin);
router.put(
  "/protected/takmir/:id",
  createStorage("/takmirs").single("pic"),
  TakmirController.update
);
router.post(
  "/protected/takmir",
  createStorage("/takmirs").single("pic"),
  TakmirController.store
);
router.delete("/protected/takmir", TakmirController.destroy);

router.post("/protected/check-login", AuthController.checkLogin);
router.all("*", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export default router;
