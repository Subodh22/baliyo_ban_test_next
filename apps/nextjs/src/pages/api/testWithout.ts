 
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from 'zod';
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { postRouter } from "@acme/api/src/router/post";
import Cors from 'cors';

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





const testWithout = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors);
  try {
    console.log("Received request with body:", req.body); // Log the request body

    const result = await postRouter.sendNotice({
      input: {token:"dsfd"},
      rawInput:"df",
      ctx: {},
      path: 'alle',
      type: 'query'
  });

    console.log("Result from postRouter.sendNotice:", result); // Log the result

   
  } catch (error:any) {
    console.error("Error occurred:", error); // Log the error
    res.status(500).json({ error: error});
  }
  res.status(200).end();
}

export default testWithout;
export const config = {
  api: {
    bodyParser: false,
  },
};
