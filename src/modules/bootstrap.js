import brandRouter from "./brand/brand.routes.js";
import categoryRouter from "./category/category.routes.js";
import couponRouter from "./coupon/coupon.routes.js";
import productRouter from "./product/product.routes.js";
import reviewRouter from "./review/review.routes.js";
import subCategoryRouter from "./subCategory/subCategory.routes.js";
import userRouter from "./user/user.routes.js";

export const bootstrap = (app) => {
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subCategories", subCategoryRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/coupons", couponRouter);
  app.use("/api/v1/user", userRouter);

  app.use("/api/v1/products", productRouter);
};
