import { ExpoConfig, ConfigContext } from "@expo/config";

// const CLERK_PUBLISHABLE_KEY = "pk_live_Y2xlcmsuYmFsaXlvYmFuLmNvbSQ";
const CLERK_PUBLISHABLE_KEY = "pk_test_YWNlLWxpb24tMTIuY2xlcmsuYWNjb3VudHMuZGV2JA";
const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "Baliyo",
  slug: "baliyo",
  scheme: "myapp",
  version: "1.1.5",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light", 
   
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#2e026d",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.notSubodh.workoutMaker",
    buildNumber:"16"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#2e026d",
    },
    package:"com.notSubodh.workoutMaker"
  },
  extra: {
    eas: {
      projectId: "bf894dea-5f30-47b1-9d6a-c79aa5c94c11",
    },
    CLERK_PUBLISHABLE_KEY,
  },
  plugins: ["./expo-plugins/with-modify-gradle.js","expo-apple-authentication"],
});

export default defineConfig;
