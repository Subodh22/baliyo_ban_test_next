 
import type { NextApiRequest, NextApiResponse } from "next";
import {Expo} from 'expo-server-sdk';
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { trpc } from "../../utils/trpc";
 
const expo = new Expo()
const testWithout =  async(req:NextApiRequest,res:NextApiResponse)=>
{
  const { data, error, isLoading } = await trpc.post.sendNotice.useQuery({ token: "dd" });

  if (error) {
    console.error('Error sending notice:', error);
    return res.status(500).end();
  }

  if (isLoading) {
    // Handle the loading state if necessary. This might not be relevant in an API context.
    return res.status(202).send("Notification is being processed");
  }

  if (data) {
    // Assuming the data contains some relevant information you might want to log or process.
    console.log(data);
    return res.status(200).end();
  }

  // Fallback response in case none of the above conditions are met.
  return res.status(400).send("Unknown response from trpc");
};
   
 

export default testWithout;

export const config = {
  api: {
    bodyParser: false,
  },
};