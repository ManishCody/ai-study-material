import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials:{
    url:"postgresql://studybeam_owner:oWc4TkqPw5tI@ep-raspy-boat-a5y2o3pj.us-east-2.aws.neon.tech/studybeam?sslmode=require"
  }
});
