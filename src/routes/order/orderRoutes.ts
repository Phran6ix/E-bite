import { Router } from "express";

import OrderController from "../../controller/Order/orderController";
import { protect, restrict } from "../../controller/Authentication/auth";

const router = Router();

router.post("/order-product/:productId", protect, restrict("USER"), (...fromexpress) =>
  new OrderController(...fromexpress).orderProduct()
);

router.get("/get-all-orders", protect, restrict("ADMIN", "VENDOR"), (...fromexpress) =>
  new OrderController(...fromexpress).getOrders()
);
// router.get()

export default router;
