 
import type { NextApiRequest, NextApiResponse } from "next";
import { Expo } from 'expo-server-sdk';

import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { trpc } from "../../utils/trpc";
import { postRouter } from "@acme/api/src/router/post";
 
const sendNotice = async () => {
  const expo = new Expo();
  const messages = [
      {
          to: "ExponentPushToken[PIuIZGD8mydMXRQgwG471a]",
          title: "Login Reminder",
          body: "brother in christ",
          data: { someData: "u fat f***" }
      },
      {
          to: "ExponentPushToken[LeceGhM18Tt9ilEXjhiA2Y]",
          title: "Login Reminder",
          body: "u chubby gr",
          data: { someData: "u fat f***" }
      }
  ];

  try {
      const receipts = await expo.sendPushNotificationsAsync(messages);
      return "bush"; // Consider returning the receipts or a more meaningful response
  } catch (error:any) {
      throw new Error("Failed to send push notifications: " + error.message);
  }
};

const sendNotifications = async (req: NextApiRequest, res: NextApiResponse) => {
 await sendNotice()

};

export default verifySignature(sendNotifications);

export const config = {
  api: {
    bodyParser: false,
  },
};
