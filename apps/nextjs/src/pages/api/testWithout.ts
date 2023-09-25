 
import type { NextApiRequest, NextApiResponse } from "next";
import {Expo} from 'expo-server-sdk';
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { trpc } from "../../utils/trpc";
 
const expo = new Expo()
const testWithout =  async(req:NextApiRequest,res:NextApiResponse)=>
{
  try {
    const result =await trpc.post.sendNotice.useQuery({token:"dd"});
    console.log(result);  // Logs: Notice Sent
    res.status(200).end();
  } catch (error) {
    console.error('Error sending notice:', error);
    res.status(500).end();
  }
   
   
};

export default testWithout;

export const config = {
  api: {
    bodyParser: false,
  },
};