 
import type { NextApiRequest, NextApiResponse } from "next";
 
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { trpc } from "../../utils/trpc";
 

const testWithout =  async(req:NextApiRequest,res:NextApiResponse)=>
{
    // const sendNotice =(trpc.post as any).sendNotice.useQuery({token:"dd"});
     console.log("Lets see no its not my sonthe problem")
     
    return res.status(200).json({ message: 'Notifications sent!' });
};

export default testWithout;

export const config = {
  api: {
    bodyParser: false,
  },
};