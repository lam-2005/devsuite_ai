import ENV from "./config/env.js";
import { connectDB } from "./config/db.js";
import { server } from "./lib/socket.js";

const startServer = async () => {
  try {
    await connectDB();

    server.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
