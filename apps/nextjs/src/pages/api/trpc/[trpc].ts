import { appRouter, createContext } from "@acme/api";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { NextApiRequest,NextApiResponse } from "next";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
});

// import Cors from 'micro-cors';

// const cors = Cors({
//   allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
//   // Add other configuration options if needed
// });
// // If you need to enable cors, you can do so like this:
// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   // Let the tRPC handler do its magic
//   return createNextApiHandler({
//     router: appRouter,
//     createContext,
//   })(req, res);
// };

// export default cors(handler);
 
