 
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from 'zod';
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { postRouter } from "@acme/api/src/router/post";
import { PrismaClient } from "@acme/db";

const prisma = new PrismaClient()
const testWithout = async (req: NextApiRequest, res: NextApiResponse) => {
    // const users = await prisma.workoutCeleb.findMany();

  try {
    const users = await prisma.workoutCeleb.findMany();

    return res.status(200).json(users);

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
