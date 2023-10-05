 
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from 'zod';
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { postRouter } from "@acme/api/src/router/post";

const testWithout = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("Received request with body:", req.body); // Log the request body

    const input = req.body; 
    // const result = await postRouter.sendNotice({
    //     input: input,
    //     rawInput:"df",
    //     ctx: {},
    //     path: 'sendNotice',
    //     type: 'query'
    // });
    const result = await postRouter.alle({
      input: input,
      rawInput:"df",
      ctx: {},
      path: 'alle',
      type: 'query'
  });

    console.log("Result from postRouter.sendNotice:", result); // Log the result

    res.json({ message: result });
  } catch (error:any) {
    console.error("Error occurred:", error); // Log the error
    res.status(500).json({ error: error.message });
  }
}

export default testWithout;
export const config = {
  api: {
    bodyParser: false,
  },
};
