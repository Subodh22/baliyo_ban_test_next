 
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from 'zod';
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { postRouter } from "@acme/api/src/router/post";
import { PrismaClient } from "@acme/db";
import Expo from "expo-server-sdk";

const prisma = new PrismaClient()
const expo = new Expo
const bobo = async (req: NextApiRequest, res: NextApiResponse) => {
    // const users = await prisma.workoutCeleb.findMany();

  try {
    const users = await prisma.workoutCeleb.findMany();
    const message = {
      // ExponentPushToken[7-rIfhDlp-HNM5vVK95T6h] -A
      // ExponentPushToken[LeceGhM18Tt9ilEXjhiA2Y] - i
      to:"ExponentPushToken[PIuIZGD8mydMXRQgwG471a]",
      title:"Login Reminder",
      body:"brother in christ",
      data:{someData:"u fat fuck"}
      

    };
    await expo.sendPushNotificationsAsync([message]);
    const messages = {
      // ExponentPushToken[7-rIfhDlp-HNM5vVK95T6h] -A
      // ExponentPushToken[LeceGhM18Tt9ilEXjhiA2Y] - i
      to:"ExponentPushToken[LeceGhM18Tt9ilEXjhiA2Y]",
      title:"Login Reminder",
      body:"u chubby gr",
      data:{someData:"u fat fuck"}

    };
    const answer =await expo.sendPushNotificationsAsync([messages]);
    return res.status(200).json(users);

} catch (error:any) {
    return res.status(500).json({ error: error.message });
}
}

export default verifySignature(bobo);
export const config = {
  api: {
    bodyParser: false,
  },
};
