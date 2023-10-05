 
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from 'zod';
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { postRouter } from "@acme/api/src/router/post";
import Cors from 'cors';
import { Expo } from 'expo-server-sdk';

const cors = Cors({
  methods: ['GET', 'POST'],
  // Add your allowed origins here
  origin: '*',
});
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result:any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

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




const testWithout = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors);
   
   try {
    
   await sendNotice()
    return res.status(200).json({ message: "ok, it's working" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }

}

export default testWithout;
export const config = {
  api: {
    bodyParser: false,
  },
};
