import { useState, useEffect } from 'react';
import { trpc } from '../../utils/trpc';
 
import type { NextApiRequest, NextApiResponse } from "next";
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


 
  // Adjust the import path

 

  const SendNotifications= ()=> {
  //  runMiddleware(req, res, cors);
  //   const [hasQueried, setHasQueried] = useState(false);
  
 
  // // Trigger the sendNotice query
  // const { data, error, isLoading } = trpc.post.sendNotice.useQuery({ token: "dd" })
  //   enabled: !hasQueried  // Only run the query if hasQueried is false
  // });
  // useEffect(() => {
  //   setHasQueried(true);  // Set to true when the component mounts
  // }, []);

  // // Handle the result (optional)
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }
  // console.log(data);
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p>errfgt</p>
    </div>
  );
}

export default SendNotifications;
export const config = {
  api: {
    bodyParser: false,
  },
};
