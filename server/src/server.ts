import app from "./app.js";
import { env } from "./config/env.js";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 NihoNex Backend Server running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`⚡ Mode: ${env.NODE_ENV}`);
  console.log(`===============================================`);
});

