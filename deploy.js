#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Starting Ultimate Student Planner Deployment Process...\n");

const deployments = {
  web: () => {
    console.log("📦 Building for Web...");
    execSync("npm run build", { stdio: "inherit" });
    console.log("✅ Web build completed! Files in ./dist/\n");
  },

  windows: () => {
    console.log("🖥️  Building for Windows...");
    execSync("npm run build-windows", { stdio: "inherit" });
    console.log("✅ Windows build completed! Files in ./dist-electron/\n");
  },

  android: () => {
    console.log("📱 Building for Android...");

    // Check if Cordova is initialized
    if (!fs.existsSync("./mobile")) {
      console.log("Initializing Cordova project...");
      execSync("npm run cordova-init", { stdio: "inherit" });

      // Copy www files
      console.log("Setting up Cordova project...");
      execSync("cp -r ./dist/* ./mobile/www/", { stdio: "inherit" });
      execSync("cp ./config.xml ./mobile/", { stdio: "inherit" });
    }

    execSync("npm run build-android", { stdio: "inherit" });
    console.log(
      "✅ Android build completed! APK in ./mobile/platforms/android/app/build/outputs/apk/\n",
    );
  },

  all: () => {
    console.log("🎯 Building for ALL platforms...\n");
    deployments.web();
    deployments.windows();
    deployments.android();
    console.log("🎉 All builds completed successfully!");
  },
};

// Get command line argument
const target = process.argv[2] || "all";

if (deployments[target]) {
  deployments[target]();
} else {
  console.log("❌ Invalid target. Available options:");
  console.log("  • web     - Build for web deployment");
  console.log("  • windows - Build Windows .exe");
  console.log("  • android - Build Android APK");
  console.log("  • all     - Build for all platforms (default)");
  console.log("\nUsage: node deploy.js [target]");
}
