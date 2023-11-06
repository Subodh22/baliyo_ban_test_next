 
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from 'zod';
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { postRouter } from "@acme/api/src/router/post";
import { PrismaClient } from "@acme/db";
import Expo from "expo-server-sdk";
import AWS from 'aws-sdk';


const s3 = new AWS.S3({
  apiVersion:"2006-03-01",
  accessKeyId:process.env.AWS_ACCESS_KEY_HOLE,
  secretAccessKey:process.env.AWS_SECERT_KEY,
  region:process.env.REGION,
  signatureVersion:"v4"
})
const BUCKET_NAME = process.env.BUCKET_NAME
 


const prisma = new PrismaClient()
const expo = new Expo
const HalfDayChecker = async (req: NextApiRequest, res: NextApiResponse) => {
    // const users = await prisma.workoutCeleb.findMany();
    if (!BUCKET_NAME) {
      throw new Error('S3 Bucket name is not defined');
    
    }
    // Function to delete an entire "folder" in S3
    const deleteFolder = async (folderPrefix: string) => {
      // Safety check
      if (folderPrefix === 'uploads/' || !folderPrefix) {
          console.error("Attempting to delete top-level directory. Aborting!");
          return;
      }
  
      const listParams = {
          Bucket: BUCKET_NAME,
          Prefix: folderPrefix
      };
  
      const listedObjects = await s3.listObjectsV2(listParams).promise();
  
      if (listedObjects.Contents && listedObjects.Contents.length === 0) return;
  
      const deleteParams = {
          Bucket: BUCKET_NAME,
          Delete: { Objects: [] }
      };
  
      listedObjects!.Contents!.forEach(({ Key }) => {
          if (Key) {
              console.log(`Preparing to delete object: ${Key}`);
              (deleteParams.Delete.Objects as Array<{ Key: string }>).push({ Key });
          }
      });
  
      await s3.deleteObjects(deleteParams).promise();
  
      // If there are more objects to delete (pagination), call the function recursively
      if (listedObjects.IsTruncated) await deleteFolder(folderPrefix);
  };
  try {
    const currentDate = new Date();
    const thirteenHoursAgo = new Date(currentDate.getTime() - (13 * 60 * 60 * 1000));
    const twelveHoursAgo = new Date(currentDate.getTime() - (12 * 60 * 60 * 1000));
    const eighteenHoursAgo = new Date(currentDate.getTime() - (18 * 60 * 60 * 1000));
   
    const seventeenHoursAgo = new Date(currentDate.getTime() - (17 * 60 * 60 * 1000));
    const wholeday = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
    const wholedayaround = new Date(currentDate.getTime() - (23 * 60 * 60 * 1000));
    console.log(wholedayaround)
    const HalfDays = await prisma.challengeToDayStatus.findMany({
        where: {
            active: "active",
            ChallengeStartDate: {
                gte: thirteenHoursAgo,
                lt: twelveHoursAgo
            }
        }
    });
    const thirdFourDays = await prisma.challengeToDayStatus.findMany({
      where: {
          active: "active",
          Status: {
            not: "finished"
        },
          ChallengeStartDate: {
              gte: eighteenHoursAgo,
              lt: seventeenHoursAgo
          }
      }
  });
  const fulldays = await prisma.challengeToDayStatus.findMany({
    where: {
        active: "active",
        ChallengeStartDate: {
            gte: wholeday,
            lt: wholedayaround
        }
    }
});


  
     if(HalfDays.length>0){ for (const item of HalfDays)
        {
          const message = {
      // ExponentPushToken[7-rIfhDlp-HNM5vVK95T6h] -A
      // ExponentPushToken[LeceGhM18Tt9ilEXjhiA2Y] - i
      to:item.expoPushToken,
      title:"Reminder from gods",
      body:item.Status=="finished"?"Great Job all the challenges finished":item.Status=="NotStarted"?
      "Start your challenge"
      :"time to buckle up and finish this shit",
      data:{someData:"Get it"}
      

    };
    await expo.sendPushNotificationsAsync([message]);
   
        }}
     if(thirdFourDays.length>0)
       { for (const item of thirdFourDays)
        {
          const message = {
      // ExponentPushToken[7-rIfhDlp-HNM5vVK95T6h] -A
      // ExponentPushToken[LeceGhM18Tt9ilEXjhiA2Y] - i
      to:item.expoPushToken,
      title:"Reminder from gods",
      body:item.Status=="NotStarted"?
      "Start your challenge"
      :"Days is almost done but not your challenges",
      data:{someData:"Get it"}
      

    };
    await expo.sendPushNotificationsAsync([message]);
   
        }
      }
    if(fulldays.length>0){
      console.log(fulldays)
      for(const item of fulldays)
      {
         
      if(Array.isArray(item!.TopicsDoneList))
      {  for (const folders of item!.TopicsDoneList)
        {
          
          const folderToDelete = `uploads/${item.userId}/challenges/${folders}/`;  // replace with your folder name
          deleteFolder(folderToDelete).then(() => {
            console.log(`Deleted folder: ${folderToDelete}`);
          }).catch(error => {
            console.error(`Error deleting folder: ${error.message}`);
          });
        }}
        
    if(item.Status=="finished")
        {await prisma.challengeToDayStatus.update({
          where:{
            id:item.id
          },
          data:{
            CurrentDayOrder:item.CurrentDayOrder+1,
            TopicsDoneList:[],
            ChallengeStartDate:currentDate
          }
        })}
        
          const message = {
          // ExponentPushToken[7-rIfhDlp-HNM5vVK95T6h] -A
          // ExponentPushToken[LeceGhM18Tt9ilEXjhiA2Y] - i
          to:item.expoPushToken,
          title:"Reminder from gods",
          body:item.Status=="finished"?"Yesterday was the only easy day. Lets go new one":item.Status=="NotStarted"?
          "Another days has gone by and You are still this"
          :"Not good enough. You failed the challenge",
          data:{someData:"Get it"}
          
    
        };
        await expo.sendPushNotificationsAsync([message]);
       
      }
      await prisma.challengeToDayStatus.updateMany({
        where: {
          Status:{
            not:"finished"
          },
            ChallengeStartDate: {
                gte: wholeday,
                lt: wholedayaround
            }
        },
        data: {
            Status: "NotStarted",
            CurrentDayOrder:0,
            TopicsDoneList:[],
            ChallengeStartDate:currentDate,
            active:"notactive"
        }
    });
    }
    




      
    
    
    // Use the function
    
    
    
    
    
    return res.status(200).json(fulldays);

} catch (error:any) {
    return res.status(500).json({ error: error.message });
}
}

export default HalfDayChecker;
export const config = {
  api: {
    bodyParser: false,
  },
};
