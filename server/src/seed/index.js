import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDatabase from "../config/db.js";
import seedSuperAdmin from "./seedSuperAdmin.js";

const runSeed = async () => {
  try {
    await connectDatabase();

    console.log("🌱 Starting database seeding...\n");

    await seedSuperAdmin();

    console.log("\n🎉 Database seeding completed successfully.");
  } catch (error) {
    console.error("\n❌ Database seeding failed.");
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");

    process.exit(0);
  }
};

runSeed();