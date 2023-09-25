 
import type { NextApiRequest, NextApiResponse } from "next";
import {Expo} from 'expo-server-sdk';
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { trpc } from "../../utils/trpc";
 
const expo = new Expo()
const testWithout =  async(req:NextApiRequest,res:NextApiResponse)=>
{
     const sendNotice =trpc.post.sendNotice.useQuery({token:"dd"});
     console.log(sendNotice)
    //  const message = {
    //   // ExponentPushToken[7-rIfhDlp-HNM5vVK95T6h] -A
    //   // ExponentPushToken[LeceGhM18Tt9ilEXjhiA2Y] - i
    //   to:"ExponentPushToken[7-rIfhDlp-HNM5vVK95T6h]",
    //   title:"Login Reminder",
    //   body:"u chubby gr",
    //   data:{someData:"u fat fuck"}

    // };
    // await expo.sendPushNotificationsAsync([message]);
    return res.status(200).json({ message: 'Notifications sent!' });
};

export default testWithout;

export const config = {
  api: {
    bodyParser: false,
  },
};