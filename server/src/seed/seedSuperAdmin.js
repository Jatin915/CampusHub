import User from "../modules/auth/user.model.js";
import { ROLES } from "../constants/roles.js";

const seedSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await User.findOne({
      email: process.env.SUPER_ADMIN_EMAIL,
    });
    
    if (existingSuperAdmin) {
      console.log("ℹ️ Super Admin already exists.");
      return;
    }

    await User.create({
      fullName: process.env.SUPER_ADMIN_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      password: process.env.SUPER_ADMIN_PASSWORD,
      role: ROLES.SUPER_ADMIN,
      authProvider: "LOCAL",
      isVerified: true,
    });

    console.log("✅ Super Admin created successfully.");
  } catch (error) {
    console.error("❌ Failed to seed Super Admin.");
    throw error;
  }
};

export default seedSuperAdmin;
