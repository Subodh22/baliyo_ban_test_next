import { useState, useEffect } from 'react';
import { trpc } from '../../utils/trpc';
 
import type { NextApiRequest, NextApiResponse } from "next";
 
 
  // Adjust the import path

 

  function SendNotifications(req: NextApiRequest, res: NextApiResponse) {
  const [hasQueried, setHasQueried] = useState(false);

  // Trigger the sendNotice query
  const { data, error, isLoading } = trpc.post.sendNotice.useQuery({ token: "dd" }, {
    enabled: !hasQueried  // Only run the query if hasQueried is false
  });

  useEffect(() => {
    setHasQueried(true);  // Set to true when the component mounts
  }, []);

  // Handle the result (optional)
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  console.log(data);
  return res.status(200).end();
   
}

export default SendNotifications;
export const config = {
  api: {
    bodyParser: false,
  },
};
