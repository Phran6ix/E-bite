import { Request, Response, NextFunction } from "express";
import response from "../utils/response";

export default class BaseController {
  req: Request;
  res: Response;
  next: NextFunction;

  private data: {
    status: number;
    response: any;
    data: any;
  };

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.data = {
      status: 200,
      response: "Sucess",
      data: {},
    };
    this.next = next;
  }

  public populateData(status: number, response: any, data: any) {
    this.data = {
      status,
      response,
      data,
    };
  }

  respond() {
    response(this.res, this.data?.status, this.data?.response, this.data?.data);
  }
}
