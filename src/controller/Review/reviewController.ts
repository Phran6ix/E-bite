import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express-serve-static-core";
import AppError from "../../utils/AppError";
import BaseController from "../baseController";
import { createAddress } from "../bitpowrtest";
const prisma = new PrismaClient();

export default class ReviewController extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  async createReview() {
    const { review, rating } = this.req.body;

    const newReview = await prisma.review.create({
      data: {
        review,
        rating,
        userId: this.req.user?.id,
        productId: +this.req.params.productId,
      },
    });

    this.populateData(201, "Success", { data: newReview });
    this.respond();
  }

  async getAllReviews() {
    const reviews = await prisma.review.findMany();

    this.populateData(200, "Success", { range: reviews.length, reviews });
    this.respond();
  }

  async getAReview() {
    const { reviewId } = this.req.params;

    const review = await prisma.review.findUnique({
      where: {
        id: +reviewId,
      },
      include: {
        User: true,
        Product: true,
      },
    });

    if (!review) {
      return this.next(new AppError("Review not found", 404));
    }

    this.populateData(200, "Succes", { review });
  }

  async deleteReview() {
    const { reviewId } = this.req.params;

    await prisma.review.delete({
      where: {
        id: +reviewId,
      },
    });
    this.populateData(204, "Success", {});
    this.respond();
  }
}
