import Email from "../utils/email";

async function sendOTP(user: any) {
  const otp = Math.floor(Math.random() * 100000) + 1;

  const text = `Your OTP is: ${otp}`;

  await new Email(user, text).send("Your OTP for E-Bite verification");
  return otp;
}

export default sendOTP;
