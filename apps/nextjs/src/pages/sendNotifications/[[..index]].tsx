import { useState, useEffect } from 'react';
import { trpc } from '../../utils/trpc';
  // Adjust the import path

 

export default function SendNotifications() {
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

  return (
    <div>sendNotifications</div>
  );
}