import path from "node:path";
import { defineConfig } from "prisma/config";

process.loadEnvFile?.();

export default defineConfig({
  // 스키마/마이그레이션 위치
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
});
