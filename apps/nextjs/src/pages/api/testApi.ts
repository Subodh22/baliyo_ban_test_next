import type { NextApiRequest, NextApiResponse } from "next";

const testApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // You can add any logic you want here, if necessary

    // Respond with a simple message
    return res.status(200).json({ message: "ok, it's working" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export default testApi;

export const config = {
  api: {
    bodyParser: true, // Set to true if you want to parse the request body
  },
};
