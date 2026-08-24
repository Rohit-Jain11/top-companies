import { Router } from "express";
import { authenticate } from "@/middlewares/authenticate";
import { validate } from "@/middlewares/validate";
import * as blogCategoriesController from "@/modules/blog-categories/blog-categories.controller";
import {
  bulkDeleteBlogCategoriesSchema,
  bulkStatusBlogCategoriesSchema,
  createBlogCategorySchema,
  updateBlogCategorySchema,
} from "@/modules/blog-categories/blog-categories.validation";

const router = Router();

router.use(authenticate);

router.get("/", blogCategoriesController.list);
router.post("/bulk-delete", validate(bulkDeleteBlogCategoriesSchema), blogCategoriesController.bulkDelete);
router.post("/bulk-restore", validate(bulkDeleteBlogCategoriesSchema), blogCategoriesController.bulkRestore);
router.post(
  "/bulk-permanent-delete",
  validate(bulkDeleteBlogCategoriesSchema),
  blogCategoriesController.bulkPermanentDelete
);
router.post("/bulk-status", validate(bulkStatusBlogCategoriesSchema), blogCategoriesController.bulkStatus);
router.get("/:id", blogCategoriesController.getById);
router.post("/", validate(createBlogCategorySchema), blogCategoriesController.create);
router.patch("/:id", validate(updateBlogCategorySchema), blogCategoriesController.update);
router.post("/:id/restore", blogCategoriesController.restore);
router.delete("/:id/permanent", blogCategoriesController.permanentDelete);
router.delete("/:id", blogCategoriesController.remove);

export default router;
