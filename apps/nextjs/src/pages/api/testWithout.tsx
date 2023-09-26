 
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from 'zod';
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { postRouter } from "@acme/api/src/router/post";
const testWithout = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const input = req.body;
    const validationResult = z.object({
        token: z.string()
    }).safeParse(input);

    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const result = await postRouter.sendNotice({
      input: "dsdf",
      ctx: {}, // You can pass any context you need here
      rawInput: validationResult.data,
      path: 'sendNotice',
      type: 'query'
  });
    return res.status(200).json(result);

} catch (error:any) {
    return res.status(500).json({ error: error.message });
}
}

export default testWithout;
export const config = {
  api: {
    bodyParser: false,
  },
};
