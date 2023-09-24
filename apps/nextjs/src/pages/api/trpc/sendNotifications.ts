// import { useState, useEffect } from 'react';
import { trpc } from '../../../utils/trpc';
//   // Adjust the import path

 

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
   
// }
export default async function handler(req:any, res:any) {
  if (req.method === 'POST') {
    

     
    try {
      const response = await trpc.post.sendNotice.useQuery({ token:"dd" });
      res.status(200).json(response);
    }catch (error) {
      res.status(500).json({ error: "error.message" });
    }
   }
}