import { Request, Response, NextFunction } from "express";
import { PrismaClient, Product } from "@prisma/client";
import BaseController from "../baseController";
import AppError from "../../utils/AppError";
import response from "../../utils/response";

const prisma = new PrismaClient();

export default class ProductController extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  async createProduct() {
    if (!this.req.user?.id) {
      return this.next(new AppError("Invalid input", 400));
    }
    const product = await prisma.product.create({
      data: {
        category: this.req.body.category,
        photo: this.req.body.photo,
        price: this.req.body.price,
        desciption: this.req.body.description,
        slug: "",
        userId: this.req.user.id,
        averageRating: this.req.body.rating,
        name: this.req.body.name,
      },
    });
    this.populateData(201, "Success", product);
    this.respond();
  }

  async getProducts() {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        photo: true,
        desciption: true,
        name: true,
        price: true,
        averageRating: true,
        Review: true,
      },
    });
    this.populateData(200, "Success", products);
    this.respond();
  }

  async getProduct() {
    const { productId } = this.req.params;
    if (!productId) {
      return this.next(new AppError("Invalid input", 400));
    }

    const product = await prisma.product.findUnique({
      where: {
        id: +productId,
      },
      select: {
        id: true,
        photo: true,
        desciption: true,
        name: true,
        price: true,
        averageRating: true,
        Review: true,
      },
    });
    this.populateData(200, "Success", product);
    this.respond();
  }

  async updateProduct() {
    const { productId } = this.req.params;
    const { photo, name, price, category, description, averageRating } = this.req.body;
    const product = await prisma.product.update({
      where: {
        id: +productId,
      },
      data: {
        photo,
        name,
        price,
        category,
        desciption: description,
        averageRating,
      },
    });
    this.populateData(200, "Success", product);
    this.respond();
  }

  async deleteAll() {
    const deleteALl = await prisma.product.deleteMany({});
    this.populateData(204, "Success", {});
    this.respond();
  }
}
