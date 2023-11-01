import { router, publicProcedure, protectedProcedure } from "../trpc";
import { date, number, z } from "zod";
import {Expo} from 'expo-server-sdk';
import AWS from 'aws-sdk';
const SECERT_TOKEN =process.env.SECRET_TOKEN 
const expo = new Expo()
const s3 = new AWS.S3({
  apiVersion:"2006-03-01",
  accessKeyId:process.env.AWS_ACCESS_KEY_HOLE,
  secretAccessKey:process.env.AWS_SECERT_KEY,
  region:process.env.REGION,
  signatureVersion:"v4"
})
const BUCKET_NAME = process.env.BUCKET_NAME
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

export const postRouter = router({
cancelChallenge:publicProcedure.input(z.object({
  ido:z.string()
})).mutation(async({ctx,input})=>
{
  const workerId = ctx.auth.userId
  await ctx.prisma.challengeToDayStatus.updateMany({
    where:{
      userId:workerId!
    },
    data:{
      TopicsDoneList:[],
      active:"notactive"
    }
  })
  
}),

updateActiveChallengeStatus:publicProcedure.input(z.object({
  challengesStatusId:z.number(),
  challengeId:z.number()
})).mutation(async({ctx,input})=>
{
  const workerId= ctx.auth.userId
   await ctx.prisma.challengeToDayStatus.updateMany({
    where:{
      userId:workerId!
    },
    data:{
      active:"notactive",
      TopicsDoneList:[]
    }
  })
  await ctx.prisma.challengeToDayStatus.update({
    where:{
      id:input.challengesStatusId,
      challengeId:input.challengeId
    },
    data:{

      active:"active"
    }

  })
  const folderToDelete = `uploads/${workerId}/challenges/`;  // replace with your folder name
  deleteFolder(folderToDelete).then(() => {
    console.log(`Deleted folder: ${folderToDelete}`);
  }).catch(error => {
    console.error(`Error deleting folder: ${error.message}`);
  });

}),
 
  updateProgress:publicProcedure.input(z.object({
  
    topicId:z.number(),
    daysId:z.number(),
    challengesId:z.number(),
    summary:z.string().nullable(),
    finishedInput:z.number().nullable(),
  })).mutation(async({ctx,input})=>{
    const workerId = ctx.auth.userId
   
    const existingProof = await ctx.prisma.proof.findFirst({
      where: {
          userId: workerId!,
          topicId: input.topicId
      }
  });

  let progress;

  if (existingProof) {
      // If it exists, update it
      progress = await ctx.prisma.proof.update({
          where: {
              id: existingProof.id
          },
          data: {
              daysId: input.daysId,
              challengesId: input.challengesId,
              summary: input.summary,
              FinsihedInput: input.finishedInput,
          }
      });
  } else {
      // If it doesn't exist, create a new one
      progress = await ctx.prisma.proof.create({
          data: {
              topicId: input.topicId,
              userId: workerId!,
              daysId: input.daysId,
              challengesId: input.challengesId,
              summary: input.summary,
              FinsihedInput: input.finishedInput,
          }
      });
  }


    }),
   
    finishTopicWorkout:publicProcedure.input(z.object({
      ChallengeToDayStatusId:z.number(),
      topicListStatus:z.string(),
      newTopicsList: z.array(z.string()),
      currentChallengeStatus:z.string()
    }))
      .mutation(async({ctx,input})=>{
       
     

        const currentRecord = await ctx.prisma.challengeToDayStatus.findUnique({
          where: {
              id: input.ChallengeToDayStatusId
          }
      });
      
       
        const CurrentDayOrder = currentRecord!.CurrentDayOrder;
      
          const changeDayStatus = await ctx.prisma.challengeToDayStatus.update({
            where:{
           id:input.ChallengeToDayStatusId
            },
            data:{
             Status:input.currentChallengeStatus=="finished"?"finished":"Started",
              TopicsDoneList:input.topicListStatus=="same"?[] :input.newTopicsList,
              CurrentDayOrder:input.topicListStatus=="same"?CurrentDayOrder+1:CurrentDayOrder
            }
          })
      }),
 
  finishedTopic:publicProcedure.input(z.object({
    topicListStatus:z.string(),
    topicId:z.number(), 
    currentChallengeStatus:z.string(),
    daysId:z.number(),
    challengesId:z.number(),
    summary:z.string().nullable(),
    finishedInput:z.number().nullable(),
    challengeToDayStatusId:z.number(),
    newTopicsList: z.array(z.string())
  })).mutation(async({ctx,input})=>
  {
    const workerId = ctx.auth.userId
    const existingProof = await ctx.prisma.proof.findFirst({
      where: {
          userId: workerId!,
          topicId: input.topicId
      }
  });

  let progress;

  if (existingProof) {
      // If it exists, update it
      progress = await ctx.prisma.proof.update({
          where: {
              id: existingProof.id
          },
          data: {
              daysId: input.daysId,
              challengesId: input.challengesId,
              summary: input.summary,
              FinsihedInput: input.finishedInput,
          }
      });
  } else {
      // If it doesn't exist, create a new one
      progress = await ctx.prisma.proof.create({
          data: {
              topicId: input.topicId,
              userId: workerId!,
              daysId: input.daysId,
              challengesId: input.challengesId,
              summary: input.summary,
              FinsihedInput: input.finishedInput,
          }
      });
  }
  const currentRecord = await ctx.prisma.challengeToDayStatus.findUnique({
    where: {
        id: input.challengeToDayStatusId
    }
});

 
  const CurrentDayOrder = currentRecord!.CurrentDayOrder;

    const changeDayStatus = await ctx.prisma.challengeToDayStatus.update({
      where:{
     id:input.challengeToDayStatusId
      },
      data:{
        Status:input.currentChallengeStatus=="finished"?"finished":"Started",
        TopicsDoneList:input.topicListStatus=="same"?[] :input.newTopicsList,
        CurrentDayOrder:input.topicListStatus=="same"?CurrentDayOrder+1:CurrentDayOrder
      }
    })
  }),

  getProofs:publicProcedure.input(z.object({
    topicId:z.number()
  })).query(async({ctx,input})=>
  {
    const workerId= ctx.auth.userId;
    const getPP = await ctx.prisma.proof.findFirst({
      where:{
        userId:workerId!,
        topicId:input.topicId
      }
    })

    return getPP

  }),
  getChallenges:publicProcedure.query(async({ctx})=>
  {
    const workerId = ctx.auth.userId
    const getd = await ctx.prisma.challenges.findMany();
    const getUserDetails = await ctx.prisma.userDetails.findFirst({
      where:{
        personId:workerId!
      }
    })
    return {getd,getUserDetails}
  }),
getUsersChallenge:publicProcedure.query(async({ctx})=>
{
  type Challenge = {
    id: number;
    challengesId: number;
    challengeName: string;
    active: string;
    userId: string;
  };
  
  const workerId= ctx.auth.userId
 
  const getCha = await ctx.prisma.userToChallenges.findMany({
    where:{
      userId:workerId!
    }

  })
  const challengeDayStatus = await ctx.prisma.challengeToDayStatus.findMany({
    where:{
      userId:workerId!
    }
  })

  const mergedData: Challenge[] = getCha
  .map(challenge => {
    const matchingStatus = challengeDayStatus.find(status => status.challengeId === challenge.challengesId);
    
    return {
      ...challenge,
      active: matchingStatus ? matchingStatus.active : ''
    };
  })
  .filter((challenge): challenge is Challenge => challenge !== undefined);

return mergedData


})
,
getTopicData:publicProcedure.input(z.object({
  daysId:z.number()
})).query(async({ctx,input})=>
{
  const getTopics = await ctx.prisma.topic.findMany({
    where:{
      daysId:input.daysId
    }
  })
  return getTopics
})
,
getDayData:publicProcedure.input(z.object({
  challengesId:z.number()
})).query(async({ctx,input})=>
{
  const workerId = ctx.auth.userId
  const getdays= await ctx.prisma.day.findMany({
    where:{
      challengesId:input.challengesId
    }

  })
  const getChallengeToDayStatue= await ctx.prisma.challengeToDayStatus.findFirst({
    where:{
      userId:workerId!,
      challengeId:input.challengesId

    } 
  })


  return {getdays,getChallengeToDayStatue}
})
,
updateTopicsDoneList:publicProcedure.input(z.object({
  challengeToDayStatusId:z.number(),
 
  newTopicsList: z.array(z.string())
})).mutation(async({ctx,input})=>
{
    const updateRecord = await ctx.prisma.challengeToDayStatus.update(
      {
      where:{
        id:input.challengeToDayStatusId,
        },
      data:{
        TopicsDoneList:input.newTopicsList
      }
    })
})
,

  addChallengesToUser:publicProcedure.input(z.object({
    id:z.number(),
    name:z.string(),
    expoPushToken:z.string(),
    active:z.string()
  })).mutation(async({ctx,input})=>
  {
    const workerId = ctx.auth.userId
   
      const addChallenges= await ctx.prisma.userToChallenges.create({
        data:
        {
          challengesId:input.id,
          userId:workerId!,
          challengeName:input.name
        }
      })
      const addChallengetoDayStatus= await ctx.prisma.challengeToDayStatus.create({
        data:
        {
          challengeId:input.id,
          userId:workerId!,
          CurrentDayOrder:0,
          Status:"NotStarted",
          ChallengeStartDate:new Date(),
          TopicsDoneList:[],
          expoPushToken:input.expoPushToken,
          active:input.active
        }
      })
    
     return addChallengetoDayStatus

  }),



  getPresignedForUploadImage: publicProcedure.input(z.object({
    filename: z.string(),
    topicId:z.string()
      // or generate a filename server-side if you prefer
  })).mutation(async ({ input,ctx }) => {
    const userId = ctx.auth.userId;
    const params = {
      Bucket: BUCKET_NAME,
      Key: `uploads/${userId}/${input.topicId}/${input.filename}`,
      Expires: 60 * 2,   
      ContentType: 'image/jpeg'
    };

    try {
      const presignedUrl = await s3.getSignedUrlPromise('putObject', params);
      return { presignedUrl };
    } catch (error) {
      throw new Error('Failed to generate pre-signed URL');
    }
  }),
  getImagesFromFolder: publicProcedure.input(z.object({
    folder: z.string() // Optionally specify a subfolder
  })).mutation(async ({ input, ctx }) => {
    const userId = ctx.auth.userId;
    const folder =  `uploads/${userId}/challenges/${input.folder}/` 
  
    const params = {
      Bucket: BUCKET_NAME,
      Prefix: folder
    };
  
    const data = await s3.listObjectsV2(params).promise();
  
    if (!data.Contents) {
      return [];
    }
  
    const presignedUrls = await Promise.all(
      data.Contents.map(async (item) => {
        const urlParams = {
          Bucket: BUCKET_NAME,
          Key: item.Key,
          Expires: 60 * 2
        };
        return await s3.getSignedUrlPromise('getObject', urlParams);
      })
    );
  
    return presignedUrls;
  }),

  
  sendNotice:publicProcedure.input(z.object({
    token:z.string()
  })).query(async({input,ctx})=>
  {
        const message = {
          // ExponentPushToken[7-rIfhDlp-HNM5vVK95T6h] -A
          // ExponentPushToken[LeceGhM18Tt9ilEXjhiA2Y] - i
          to:"ExponentPushToken[PIuIZGD8mydMXRQgwG471a]",
          title:"Login Reminder",
          body:"brother in christ",
          data:{someData:"u fat fuck"}
          

        };
        await expo.sendPushNotificationsAsync([message]);
        const messages = {
          // ExponentPushToken[7-rIfhDlp-HNM5vVK95T6h] -A
          // ExponentPushToken[LeceGhM18Tt9ilEXjhiA2Y] - i
          to:"ExponentPushToken[LeceGhM18Tt9ilEXjhiA2Y]",
          title:"Login Reminder",
          body:"u chubby gr",
          data:{someData:"u fat fuck"}

        };
        const answer =await expo.sendPushNotificationsAsync([messages]);
 
    return "bush"

  }),
  all: publicProcedure.query(async({ ctx }) => {
   const workouts= await ctx.prisma.workoutCeleb.findMany(
   {where: {
      planType: {
        not: "challenge"
      }}}
   );
     
    // const users = await clerkClient.users.getUser();  
    return workouts
  }),
getPersonal:publicProcedure.input(z.object({
  workoutId:z.number(),
  
})).query(async({ctx,input})=>
{
  const workerId = ctx.auth.userId!
const getPeronalPlan = await ctx.prisma.personalPlan.findFirst({
  where:{
    personId:workerId,
    workoutId:input.workoutId
  }
  
})
const plan  = await ctx.prisma.plan.findMany({
  where:{
    workoutId:input.workoutId
  }
})

return { getPeronalPlan , plan };
}),


  addPersonalPlan:protectedProcedure.input(z.object({
    personId:z.string(),
    currentStatus:z.number(),
    workoutId:z.number(),
    currentWeek:z.number()
  })).mutation(async({ctx,input})=>
  {
    const workerId = ctx.auth.userId
    const cPersonalPlan = await ctx.prisma.personalPlan.create({
      data:{
        personId:workerId,
        currentStatus:input.currentStatus,
        workoutId:input.workoutId,
        currentWeek:input.currentWeek

      }
    })
  })
  ,
 getTheFinishedSession:publicProcedure.input(z.object({
  userId:z.string(),
 })).query(async({ctx})=>
 {
const workerId = ctx.auth.userId
if(workerId!=null)
{
  const getSession = await ctx.prisma.sessions.findMany({
  where:{
    personId:workerId,
    Status:"Finished"
  }
})
return getSession

}

 }),
  deleteUserData:protectedProcedure.mutation(async({ctx})=>
  {
    const workerId = ctx.auth.userId;
    const deleteUserExo = await ctx.prisma.userToWork.deleteMany({
      where:{
        personId:workerId
      }
    })
    const deletePersonalSets = await ctx.prisma.personalSets.deleteMany({
      where:{
        personId:workerId
      }
    })
      deletePersonalSets 
      deleteUserExo
  }),
  addWorkoutToUser: protectedProcedure.input(z.object({WorkoutCelebId:z.number().min(1)
      ,workoutName:z.string().min(1),
      planType:z.string()
    })).mutation(async({ctx,input})=>{
    const workerId = ctx.auth.userId;

    const existingRecord = await ctx.prisma.userToWork.findFirst({
      where: {
        personId: workerId,
        WorkoutCelebId: input.WorkoutCelebId,
        WorkoutName: input.workoutName,
        planType:input.planType
        
      },
    });

    if (existingRecord) {
      // Handle the case when the record already exists
      // For example, you can return an error or perform some other action
      
      return "Already added";
    }
    const connection = await ctx.prisma.userToWork.create({
      data:{
        personId:workerId,
        WorkoutCelebId:input.WorkoutCelebId,
        WorkoutName: input.workoutName,
        planType:input.planType
      }

    });
    return "Workout id Added"
  }),
  addUserData:protectedProcedure.input(z.object({
    height:z.string().min(2),
    weight:z.string().min(2),
    experience : z.string().min(2),
    gender:z.string().min(2),
    expoPushToken:z.string()

  })).mutation(async({ctx,input})=>{
    const workerId=ctx.auth.userId
    const addtheUserData = await ctx.prisma.userDetails.create({
      data:{
        height:input.height,
        weight:input.weight,
        experience:input.experience,
        gender:input.gender,
        personId:workerId,
        expoPushToken:input.expoPushToken
        


      }
    })

  })
  ,
  getWorkoutData:protectedProcedure.input(z.object({workoutId:z.number().min(1)
  })).query(async({ctx,input})=>{
    const getWorkoutData = await ctx.prisma.workoutCeleb.findUnique({
      where: {id:input.workoutId},
      include:{
        routines:{
          include:{
            exercises:{
              include:{
                sets:true
              }
            }
          }
        },
        
      }
      
      
    })
  
   return(getWorkoutData)
  }) ,getWorkoutRoutines:protectedProcedure.input(z.object({workoutId:z.number().min(1)
  ,planId:z.union([z.number(), z.null()])})).query(async({ctx,input})=>{
    const getWorkoutData = await ctx.prisma.routine.findMany({
      where: {workoutCelebId:input.workoutId,
          planId:input.planId
      },
     
      
      
    })
    
   return(getWorkoutData)
  }) ,
  getWorkoutExercise:protectedProcedure.input(z.object(
  {  routineId:z.number()}
  )).query(async({ctx,input})=>{
    const getExercises = await ctx.prisma.exercise.findMany({
      where:{
        routineId:input.routineId
      }
    

    })
    return getExercises
  }),
  getDefaultSetForEx:protectedProcedure.input(z.object(
    {  routineId:z.number()}
    )).query(async({ctx,input})=>{
      const getSets = await ctx.prisma.set.findMany({
        where:{
          routineId:input.routineId
        }
        
  
      })
      return getSets
    }),

   getWorkoutToUser:protectedProcedure.input(z.object(
   { workerI:z.string()}
   )).query(async({ctx})=>
  {
    const workerId = ctx.auth.userId;
    const workoutsPersonal=ctx.prisma.userToWork.findMany({
      where:{
          personId:workerId !== null ? workerId : undefined
      }
    })
    return workoutsPersonal
    
  }),
  getUserData:protectedProcedure.query(async({ctx})=>
  {
    const workerId =ctx.auth.userId;
    const userData = ctx.prisma.userDetails.findMany({
    where:{
      personId:workerId
    },
    })
   
    return userData
  })
  
  ,

  createPersonalSets:protectedProcedure.input(z.object({
    name:z.string(),
    personId:z.string(),
    SetId:z.number(),
    reps  : z.string(),
    weight :    z.string(),
    RestTime:   z.string(),
    RestType :  z.string(),
    exerciseId: z.number(),
    type:     z.string(),
    workoutCelebId:z.number(),
    order:z.number(),
    routineId:z.number()
})).mutation(async({ctx,input})=>{
    const userIdx = ctx.auth.userId;
    const  CheckifExists = await ctx.prisma.personalSets.findMany({
      where:{
        personId:userIdx,
        SetId:input.SetId,
        WorkoutCelebId:input.workoutCelebId,
        exerciseId:input.exerciseId,
        routineId:input.routineId
      }
    })
    if(CheckifExists){
      await ctx.prisma.personalSets.deleteMany({
        where:{
          personId:userIdx,
          SetId:input.SetId,
          WorkoutCelebId:input.workoutCelebId,
          exerciseId:input.exerciseId,
          routineId:input.routineId
        }
      })
    }
    const createPersonalSets = await ctx.prisma.personalSets.create({
      data:{
        name   :    input.name,
      personId  : userIdx,
       SetId     : input.SetId,
       reps      : input.reps,
      weight    : input.weight,
      RestTime  : input.RestTime,
    RestType  : input.RestType,
       order  :input.order,
        routineId:input.routineId,
      exerciseId :input.exerciseId,
      WorkoutCelebId :input.workoutCelebId,
      type:input.type,
      }
    })

 return "personal Sets Created"
  }), 
  addPersonalExercise:protectedProcedure.input(z.object({
    exerciseName:z.string(),
    machineSettings:z.string(),
    type:z.string(),
    setType:z.string(),
    routineId:z.number(),
    videoId:z.string(),
    workoutCelebId:z.number(),
    order:z.number(),
    exerciseToSet:z.number(),
    idTofill:z.string().nullable()

  })).mutation(async({ctx,input})=>
  {
    const workerId = ctx.auth.userId

    // const checkIfExercise  =await ctx.prisma.personalExercise.findFirst({
    //   where:{
    //     personId:workerId,
    //     routineId:input.routineId,
        
    //     workoutCelebId:input.workoutCelebId
    //   }
    // })
    // console.log(!checkIfExercise,checkIfExercise,"fofofoof")
    // if(!checkIfExercise)
    // { 
      const add =await ctx.prisma.personalExercise.create({
      data:{
        name:input.exerciseName,
      machineSettings:input.machineSettings,
      type:input.type,
      setType:input.setType,
      routineId:input.routineId,
      videoId:input.videoId,
      workoutCelebId:input.workoutCelebId,
    order:input.order,
    personId:workerId,
    exerciseToSet:input.exerciseToSet
  }
    })
    if(input.idTofill=="fill")
   { await ctx.prisma.personalExercise.update({
      where: { id: add.id },
      data: { exerciseToSet: add.id }
  })}
    return add.id
  // }
  //   else{
  //     return checkIfExercise.id 
  //   }
    
  })
  
  ,
  searchExerciseByName:protectedProcedure.input(z.object({
    exerciseName: z.string()
  })).query(async({ctx,input})=>
  {
    const GetExercise = await ctx.prisma.exercise.findMany({
      where:{
       name:{
        contains:input.exerciseName,
        
       }
      },
      take:10
    })
      return GetExercise
  })
  ,
  searchSession: protectedProcedure.input(z.object({
    RoutineId: z.number(),
    WorkoutCelebId: z.number()
  })).query(async ({ ctx, input }) => {
    const workerId = ctx.auth.userId
    const firstses = await ctx.prisma.sessions.findFirst({
      where: {
        personId: workerId,
        RoutineId: input.RoutineId,
        WorkoutCelebId: input.WorkoutCelebId,
        Status:"finished"
      }
    });
    
    if (!firstses) {
      const defaultSets = await ctx.prisma.set.findMany({
        where: {
          routineId: input.RoutineId
        },  orderBy: {
          order: 'asc'  
        }
      });
  
      const exercises= await ctx.prisma.exercise.findMany({
        where: {
          routineId: input.RoutineId
        }
      }).then(exercises =>
        exercises.map(exercise => ({
          ...exercise,
          sets: defaultSets.filter(set => set.exerciseId === exercise.id) 
        }))
      );
  
      // ... here you'd process and return the exercises data for new users
      return { data: "new user", exercises };
    }
  
    const personalSets = await ctx.prisma.personalSets.findMany({
      where: {
        personId: workerId,
        WorkoutCelebId: input.WorkoutCelebId
      },   orderBy: {
        order: 'asc' // Assuming your field name is 'order'
      }
    });
  
    const exercises = await ctx.prisma.personalExercise.findMany({
      where: {
        routineId: input.RoutineId
      }
    }).then(exercises =>
      exercises.map(exercise => ({
        ...exercise,
        sets: personalSets.filter(set => set.exerciseId === exercise.exerciseToSet).map((set)=>
        ({
          id:set.SetId,
          name:set.name,
          type:set.type,
          volume:set.reps,
          weight:set.weight,
          restTime:set.RestTime,
          exerciseId:set.exerciseId,
          order:set.order,
          routineId:input.RoutineId,
          }))
      }))
    );
  

    return { data: "old user", exercises };
  }),
 removeSets:protectedProcedure.input(z.object({
  personId :z.string(),
  id:z.number(),
  exerciseId:z.number()

 })).mutation(async({ctx,input})=>{
  const workerId = ctx.auth.userId
  const removeSetN = await ctx.prisma.personalSets.deleteMany({
    where:{
      personId:workerId,
      SetId:input.id,
      exerciseId:input.exerciseId
    }
  })
 }),
  
  createSession:protectedProcedure.input(z.object({
    routineId:z.number(),
    workoutCelebId:z.number(),
    routineName:z.string()
  })).mutation(async({ctx,input})=>{
    const workerId = ctx.auth.userId
    const createSes =await ctx.prisma.sessions.create({
      data:
      {
        personId:workerId,
        WorkoutCelebId:input.workoutCelebId,
        RoutineId:input.routineId,
        StartedAt:new Date(),
        FinsihedAt:new Date(),
        Status:"started",
       RoutineName:input.routineName
      }
    })
    return {id:createSes.id }
  }),
  addBetaTester:publicProcedure.input(z.object({
    email:z.string(),
  })).mutation(async({ctx,input})=>
  {
    const addemail = await ctx.prisma.testers.create({
      data:{
        email:input.email
      }
    })
    return addemail
  })
  ,
  changeDayProgress:protectedProcedure.input(z.object({
   pPId:z.number(),
    currentStatus:z.number(),
    
    currentWeek:z.number(),
  })).mutation(async({ctx,input})=>
  {
    const workerId = ctx.auth.userId
    const changeDay = await ctx.prisma.personalPlan.update({
      where:{
          id:input.pPId
      },data:
      {
        currentStatus:input.currentStatus,
        currentWeek:input.currentWeek
      }
    })

  })
  ,
  finishSession:protectedProcedure.input(z.object({
    sessiodId:z.number(),
   


  })).mutation(async({ctx,input})=>
  {
    const finishSign = await ctx.prisma.sessions.update({
      where:{
        id:input.sessiodId
      },
      data:{
        FinsihedAt: new Date(),
        Status: "finished"


      }
    })
    

  })
  ,
  userSetHistoryRecorder:protectedProcedure.input(z.object({
    name:z.string(),
    personId:z.string(),
    SetId:z.number(),
    reps  : z.string(),
    weight :    z.string(),
    RestTime:   z.string(),
    RestType :  z.string(),
    exerciseId: z.number(),
    type:     z.string(),
    workoutCelebId:z.number()
})).mutation(async({ctx,input})=>{
    const userIdx = ctx.auth.userId;
   
    const createUserSetRecord = await ctx.prisma.userSetHistory.create({
      data:{
        name   :    input.name,
      personId  : userIdx,
       SetId     : input.SetId,
       reps      : input.reps,
      weight    : input.weight,
      RestTime  : input.RestTime,
    RestType  : input.RestType,
        

      exerciseId :input.exerciseId,
      WorkoutCelebId :input.workoutCelebId,
      type:input.type,
      }
    })

 return "user setCreated"
  }),

  userSetHistoryRecorderDelete:protectedProcedure.input(z.object({
    personId:z.string(),
    SetId:z.number(),
    exerciseId:z.number(),
    WorkoutCelebId:z.number()
  })).mutation(async({ctx,input})=>{
    const workerId=ctx.auth.userId
    const delo = await ctx.prisma.userSetHistory.deleteMany({
      where:{
        SetId:input.SetId,
       exerciseId:input.exerciseId,
       personId:workerId,
       WorkoutCelebId:input.WorkoutCelebId
      }
    })

  }),

  findPersonalSets:protectedProcedure.input(z.object({personId:z.string(),
    workoutCelebId:z.number()
   })).query(async({ctx,input})=>{
    const userId = ctx.auth.userId
    const PersonalSets= await ctx.prisma.personalSets.findMany({
      where:{
        personId:userId,
        WorkoutCelebId:input.workoutCelebId
      }
    })
    return PersonalSets
  })
 
  
});

 

