import { Request, Response } from "express";
import { asyncHandler } from "@/lib/asyncHandler";
import { sendSuccess } from "@/lib/apiResponse";
import * as blogsService from "@/modules/blogs/blogs.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { data, meta } = await blogsService.listBlogs(req.query as Record<string, unknown>);
  return sendSuccess(res, data, { meta });
});

export const publicList = asyncHandler(async (req: Request, res: Response) => {
  const data = await blogsService.getPublicBlogsWithLatest(req.query as Record<string, unknown>);
  return sendSuccess(res, data);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogsService.getBlogById(Number(req.params.id));
  return sendSuccess(res, blog);
});

export const getByCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = await blogsService.getBlogsWithLatestByCategory(
    Number(req.params.categoryId),
    req.query as Record<string, unknown>
  );
  return sendSuccess(res, data);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogsService.createBlog(req.body, req.admin!.id);
  return sendSuccess(res, blog, { statusCode: 201, message: "Blog created successfully" });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogsService.updateBlog(Number(req.params.id), req.body, req.admin!.id);
  return sendSuccess(res, blog, { message: "Blog updated successfully" });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await blogsService.deleteBlog(Number(req.params.id), req.admin!.id);
  return sendSuccess(res, null, { message: "Blog deleted successfully" });
});

export const restore = asyncHandler(async (req: Request, res: Response) => {
  await blogsService.restoreBlog(Number(req.params.id), req.admin!.id);
  return sendSuccess(res, null, { message: "Blog restored successfully" });
});

export const permanentDelete = asyncHandler(async (req: Request, res: Response) => {
  await blogsService.permanentlyDeleteBlog(Number(req.params.id));
  return sendSuccess(res, null, { message: "Blog permanently deleted" });
});

export const bulkDelete = asyncHandler(async (req: Request, res: Response) => {
  await blogsService.bulkDeleteBlogs(req.body.ids, req.admin!.id);
  return sendSuccess(res, null, { message: "Selected blogs deleted" });
});

export const bulkRestore = asyncHandler(async (req: Request, res: Response) => {
  await blogsService.bulkRestoreBlogs(req.body.ids, req.admin!.id);
  return sendSuccess(res, null, { message: "Selected blogs restored" });
});

export const bulkPermanentDelete = asyncHandler(async (req: Request, res: Response) => {
  await blogsService.bulkPermanentlyDeleteBlogs(req.body.ids);
  return sendSuccess(res, null, { message: "Selected blogs permanently deleted" });
});

export const bulkStatus = asyncHandler(async (req: Request, res: Response) => {
  await blogsService.bulkUpdateBlogStatus(req.body.ids, req.body.status, req.admin!.id);
  return sendSuccess(res, null, { message: "Status updated" });
});
