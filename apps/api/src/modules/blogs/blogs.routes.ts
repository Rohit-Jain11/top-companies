import { Router } from "express";
import { authenticate } from "@/middlewares/authenticate";
import { validate } from "@/middlewares/validate";
import * as blogsController from "@/modules/blogs/blogs.controller";
import {
  bulkDeleteBlogsSchema,
  bulkStatusBlogsSchema,
  createBlogSchema,
  updateBlogSchema,
} from "@/modules/blogs/blogs.validation";

const router = Router();

router.use(authenticate);

router.get("/", blogsController.list);
router.post("/bulk-delete", validate(bulkDeleteBlogsSchema), blogsController.bulkDelete);
router.post("/bulk-restore", validate(bulkDeleteBlogsSchema), blogsController.bulkRestore);
router.post("/bulk-permanent-delete", validate(bulkDeleteBlogsSchema), blogsController.bulkPermanentDelete);
router.post("/bulk-status", validate(bulkStatusBlogsSchema), blogsController.bulkStatus);
router.get("/:id", blogsController.getById);
router.get("/category/:categoryId", blogsController.getByCategory);
router.post("/", validate(createBlogSchema), blogsController.create);
router.patch("/:id", validate(updateBlogSchema), blogsController.update);
router.post("/:id/restore", blogsController.restore);
router.delete("/:id/permanent", blogsController.permanentDelete);
router.delete("/:id", blogsController.remove);

export default router;
