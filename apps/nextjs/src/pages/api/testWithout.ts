 
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from 'zod';
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { postRouter } from "@acme/api/src/router/post";
const testWithout = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const input = req.body; // Get input from the request body
    const result = await postRouter.sendNotice({
        input: input,
        rawInput:"df",
        ctx: {}, // You can pass any context you need here
        path: 'sendNotice',
        type: 'query'
    });
    res.json({ message: result });
} catch (error:any) {
    res.status(500).json({ error: error.message });
}
}

export default testWithout;
export const config = {
  api: {
    bodyParser: false,
  },
};
