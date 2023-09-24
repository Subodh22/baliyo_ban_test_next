import { ExpoConfig, ConfigContext } from "@expo/config";

// const CLERK_PUBLISHABLE_KEY = "pk_live_Y2xlcmsuYmFsaXlvYmFuLmNvbSQ";
const CLERK_PUBLISHABLE_KEY = "pk_test_YWNlLWxpb24tMTIuY2xlcmsuYWNjb3VudHMuZGV2JA";
const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "Baliyo",
  slug: "baliyo",
  scheme: "myapp",
  version: "1.3.5",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light", 
   
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
  
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.notSubodh.workoutMaker",
    buildNumber:"23",
    infoPlist:{
      "UIBackgroundModes": [
        "audio"
      ]
    }
  },
  android: {
    versionCode:15,
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#2e026d",
    },
    package:"com.notSubodh.workoutMaker",
    googleServicesFile:"../../google-services.json"
  },
  extra: {
    eas: {
      projectId: "bf894dea-5f30-47b1-9d6a-c79aa5c94c11",
    }
   
    ,
    CLERK_PUBLISHABLE_KEY,
  },
  plugins: ["./expo-plugins/with-modify-gradle.js","expo-apple-authentication",
  [
    "onesignal-expo-plugin",
    {
      mode: "development",
    }
  ]
  ,
  ["expo-av",  {
    "microphonePermission": "Allow Baliyo to access your play sound."
  }
  ]
],
});

export default defineConfig;
