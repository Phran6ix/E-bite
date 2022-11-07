import app from "./app";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: Number = parseInt(process.env.PORT);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
