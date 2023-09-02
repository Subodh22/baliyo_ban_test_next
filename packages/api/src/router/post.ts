import { router, publicProcedure, protectedProcedure } from "../trpc";
import { date, number, z } from "zod";
 
export const postRouter = router({
 
  all: publicProcedure.query(async({ ctx }) => {
   const workouts= await ctx.prisma.workoutCeleb.findMany();
     
    // const users = await clerkClient.users.getUser();  
    return workouts
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
      ,workoutName:z.string().min(1)})).mutation(async({ctx,input})=>{
    const workerId = ctx.auth.userId;

    const existingRecord = await ctx.prisma.userToWork.findFirst({
      where: {
        personId: workerId,
        WorkoutCelebId: input.WorkoutCelebId,
        WorkoutName: input.workoutName
        
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
        WorkoutName: input.workoutName
      }

    });
    return "Workout id Added"
  }),
  addUserData:protectedProcedure.input(z.object({
    height:z.string().min(2),
    weight:z.string().min(2),
    experience : z.string().min(2),
    gender:z.string().min(2),

  })).mutation(async({ctx,input})=>{
    const workerId=ctx.auth.userId
    const addtheUserData = await ctx.prisma.userDetails.create({
      data:{
        height:input.height,
        weight:input.weight,
        experience:input.experience,
        gender:input.gender,
        personId:workerId

      }
    })

  })
  ,
  getWorkoutData:protectedProcedure.input(z.object({workoutId:z.number().min(1)})).query(async({ctx,input})=>{
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
    exerciseToSet:z.number()
  

  })).mutation(async({ctx,input})=>
  {
    const workerId = ctx.auth.userId
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

    return add.id
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
    workoutCelebId:z.number()
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
        Status:"started"
      }
    })
    return {id:createSes.id }
  }),
  finishSession:protectedProcedure.input(z.object({
    sessiodId:z.number()

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
