 
import type { NextApiRequest, NextApiResponse } from "next";
 
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { trpc } from "../../utils/trpc";
import { postRouter } from "@acme/api/src/router/post";
 
const sendNotifications = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
   
    const result = await postRouter.sendNotice({
      input: {token:"dsdsd"},
      ctx: {}, // You can pass any context you need here
      rawInput:{token:"dsdsd"},
      path: 'sendNotice',
      type: 'query'
  });

  return res.status(200).json({ message: "ok, it's working" });

} catch (error:any) {
    return res.status(500).json({ error: error.message });
}
};

export default verifySignature(sendNotifications);

export const config = {
  api: {
    bodyParser: false,
  },
};
