import { createApp } from "@/app";
import { env } from "@/config/env";
import { initCrons } from "@/crons/categoryCron";

const app = createApp();

// Initialize background cron jobs
initCrons();

app.listen(env.PORT, () => {
  console.log(`API server listening on http://localhost:${env.PORT}`);
});
