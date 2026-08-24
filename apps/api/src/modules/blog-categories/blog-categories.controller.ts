import { Request, Response } from "express";
import { asyncHandler } from "@/lib/asyncHandler";
import { sendSuccess } from "@/lib/apiResponse";
import * as blogCategoriesService from "@/modules/blog-categories/blog-categories.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { data, meta } = await blogCategoriesService.listBlogCategories(req.query as Record<string, unknown>);
  return sendSuccess(res, data, { meta });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const category = await blogCategoriesService.getBlogCategoryById(Number(req.params.id));
  return sendSuccess(res, category);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const category = await blogCategoriesService.createBlogCategory(req.body, req.admin!.id);
  return sendSuccess(res, category, { statusCode: 201, message: "Blog Category created successfully" });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const category = await blogCategoriesService.updateBlogCategory(Number(req.params.id), req.body, req.admin!.id);
  return sendSuccess(res, category, { message: "Blog Category updated successfully" });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await blogCategoriesService.deleteBlogCategory(Number(req.params.id), req.admin!.id);
  return sendSuccess(res, null, { message: "Blog Category deleted successfully" });
});

export const restore = asyncHandler(async (req: Request, res: Response) => {
  await blogCategoriesService.restoreBlogCategory(Number(req.params.id), req.admin!.id);
  return sendSuccess(res, null, { message: "Blog Category restored successfully" });
});

export const permanentDelete = asyncHandler(async (req: Request, res: Response) => {
  await blogCategoriesService.permanentlyDeleteBlogCategory(Number(req.params.id));
  return sendSuccess(res, null, { message: "Blog Category permanently deleted" });
});

export const bulkDelete = asyncHandler(async (req: Request, res: Response) => {
  await blogCategoriesService.bulkDeleteBlogCategories(req.body.ids, req.admin!.id);
  return sendSuccess(res, null, { message: "Selected blog categories deleted" });
});

export const bulkRestore = asyncHandler(async (req: Request, res: Response) => {
  await blogCategoriesService.bulkRestoreBlogCategories(req.body.ids, req.admin!.id);
  return sendSuccess(res, null, { message: "Selected blog categories restored" });
});

export const bulkPermanentDelete = asyncHandler(async (req: Request, res: Response) => {
  await blogCategoriesService.bulkPermanentlyDeleteBlogCategories(req.body.ids);
  return sendSuccess(res, null, { message: "Selected blog categories permanently deleted" });
});

export const bulkStatus = asyncHandler(async (req: Request, res: Response) => {
  await blogCategoriesService.bulkUpdateBlogCategoryStatus(req.body.ids, req.body.status, req.admin!.id);
  return sendSuccess(res, null, { message: "Status updated" });
});
