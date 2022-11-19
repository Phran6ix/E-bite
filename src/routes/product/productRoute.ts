import { Router, Request, Response, NextFunction } from "express";
import { formatWithOptions } from "util";
import { protect, restrict } from "../../controller/Authentication/auth";
import ProductController from "../../controller/Products/productController";
const router = Router();

// const product = new ProductController();

router.post("/create-product", protect, restrict("VENDOR", "ADMIN"), (...fromExpress) =>
  new ProductController(...fromExpress).createProduct()
);
router.delete("/delete-all", protect, restrict("ADMIN"), (...fromExpress) =>
  new ProductController(...fromExpress).deleteAll()
);
router.get("/all-products", protect, (...fromExpress) => new ProductController(...fromExpress).getProducts());
router.get("/:productId", protect, (...fromExpress) => new ProductController(...fromExpress).getProduct);
router.patch("/:productId", protect, restrict("VENDOR", "ADMIN"), (...fromExpress) =>
  new ProductController(...fromExpress).updateProduct()
);

export default router;
