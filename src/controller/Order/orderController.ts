import { Request, Response, NextFunction } from "express";

import { PrismaClient } from "@prisma/client";
import Email from "../../utils/email";

import sendSMS from "../../utils/twilio";
const prisma = new PrismaClient();

import BaseController from "../baseController";
import AppError from "../../utils/AppError";
import { send } from "process";

// export interface Dictionary<T> {
//   [key: string]: T;
// }

export default class OrderController extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  async orderProduct() {
    const { productId } = this.req.params;
    const { address } = this.req.body;

    if (!this.req.user) {
      return this.next(new AppError("User not logged in", 400));
    }

    const product = await prisma.product.findUnique({
      where: {
        id: +productId,
      },
      include: {
        User: true,
      },
    });

    if (!product) {
      return this.next(new AppError("Product is not found", 404));
    }

    const newOrder = await prisma.order.create({
      data: {
        ToBeDelivered: address,
        userId: this.req.user.id,
        product: `${productId}`,
      },
    });

    const vendorEmail = product.User.email;

    const orderUrl = `${this.req.protocol}://${this.req.get("host")}/api/v1/order/get-order/${newOrder.id}`;

    await new Email(product.User, `Order details: ${orderUrl}`).send("New order has been placed");

    await sendSMS(this.req.user.phoneNo, "Your order has been placed successfully");

    this.populateData(201, "Success", {
      message: "Order has been created",
    });
    this.respond();
  }

  async getOrders() {
    const orders = await prisma.order.findMany();

    this.populateData(200, "Success", { orders });
    this.respond();
  }

  async getOrderById() {
    let orderId = this.req.params;

    const order = await prisma.order.findUnique({
      where: {
        id: +orderId,
      },
      include: {
        user: true,
      },
    });
  }
}
