import { Request, Response, Router } from "express";
import { asyncHandler } from "@/lib/asyncHandler";
import { sendSuccess } from "@/lib/apiResponse";
import { publicRateLimiter } from "@/middlewares/rateLimiters";
import { cachedCategoryDetails, cachedHomeData } from "@/crons/homeDataCron";
import * as publicService from "@/modules/public/public.service";
import * as blogCategoriesController from "@/modules/blog-categories/blog-categories.controller";
import * as blogsController from "@/modules/blogs/blogs.controller";

const router = Router();

router.use(publicRateLimiter);

// router.get(
//   "/home",
//   asyncHandler(async (_req: Request, res: Response) => {
//     const data = await publicService.getHomeData();
//     return sendSuccess(res, data);
//   })
// );

router.get(
  "/home",
  asyncHandler(async (_req: Request, res: Response) => {
    const data = cachedHomeData || await publicService.getHomeData();
    return sendSuccess(res, data);
  })
);
 

router.get(
  "/categories",
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await publicService.getPublicCategories();
    return sendSuccess(res, data);
  })
);
router.get(
  "/categories/:slug",
  asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const data = cachedCategoryDetails.get(slug) || await publicService.getPublicCategoryBySlug(slug);
    return sendSuccess(res, data);
  })
);

router.get(
  "/categories/:slug/companies",
  asyncHandler(async (req: Request, res: Response) => {
    const data = await publicService.getCompaniesByCategorySlug(req.params.slug);
    return sendSuccess(res, data);
  })
);

router.get(
  "/spotlight-companies",
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await publicService.getSpotlightCompanies();
    return sendSuccess(res, data);
  })
);


router.get(
  "/about",
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await publicService.getPublicAbout();
    return sendSuccess(res, data);
  })
);



router.get("/blog-categories", blogCategoriesController.list);
router.get("/blogs", blogsController.publicList);
router.get("/blogs/:slug", blogsController.getBySlug);
router.get("/blogs/category/:categorySlug", blogsController.getByCategory);

export default router;
