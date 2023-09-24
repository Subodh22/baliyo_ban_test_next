// import { useState, useEffect } from 'react';
// import { trpc } from '../../utils/trpc';
//   // Adjust the import path

import { NextApiRequest, NextApiResponse } from "next";
import { trpc } from "../../utils/trpc";

// export default function SendNotifications() {
//   const [hasQueried, setHasQueried] = useState(false);

//   // Trigger the sendNotice query
//   const { data, error, isLoading } = trpc.post.sendNotice.useQuery({ token: "dd" }, {
//     enabled: !hasQueried  // Only run the query if hasQueried is false
//   });

//   useEffect(() => {
//     setHasQueried(true);  // Set to true when the component mounts
//   }, []);

//   // Handle the result (optional)
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <div>sendNotifications</div>
//   );
// }


const sendNotifications = async(req:NextApiRequest,res:NextApiResponse)=>
{
    const sendNotice = await trpc.post.sendNotice.useQuery({token:"dd"})
    

    return res.status(200)
};
export default sendNotifications;
export const config = {
    api: {
      bodyParser: false,
    },
  };