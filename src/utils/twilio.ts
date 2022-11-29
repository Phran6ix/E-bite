const client = require("twilio")(process.env.TWILIO_SID, process.env.TWILIO_SECRET);

export default async function sendSMS(phone: string, message: string) {
  try {
    const sentMessage = await client.messages.create({
      body: message,
      from: "+13467065810",
      to: `+${phone}`,
    });
  } catch (error) {
    console.error("Error =>>>" + error);
  }
}
