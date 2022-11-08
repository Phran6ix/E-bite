import * as nodemailer from "nodemailer";
import { send } from "process";

class Email {
  user: any;
  from: any;
  to: string;
  message: string;
  constructor(user: any, message: string) {
    this.to = user.email;
    this.from = "E-BITE";
    this.message = message;
  }

  async newTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async send(subject: string) {
    console.log("send");
    const mailOption = {
      to: this.to,
      from: this.from,
      subject,
      text: this.message,
    };

    (await this.newTransport()).sendMail(mailOption);
  }
}

export default Email;
