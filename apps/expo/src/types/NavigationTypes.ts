import { Prisma } from ".prisma/client";

type set = {
    exerciseId:number,
    id:number,
    name:string,
    order:number,
    restTime:string,
    type:string,
    volume:string,
    weight:string
  }
  type exercises={
    id: number;
  name: string;
  type: string;
  setType: string|null;
  order: number;
  routineId: number;
  sets: set[];
  }
  type jue={
    id:number,
    weekRoutine:string,
    exercises:exercises[],
    order:number
    workoutCelebId:number
  } 
  

export type RootStackParamList={
    Main:undefined;
    MyModal:{workoutId:number; name:string,ratings:string,planType:string};
    Specific:{WorkoutCelebId:number,orderP:number,id:number,name:string|undefined,planLength:number,planId:number|null,currentStatus:number,currentWeek:number};
    Custom:{exercises:exercises[]};
    PlanScreenT:{WorkoutCelebId:number,name:string|undefined};
    Assignments:{videoId:string};
    DayChallenge:{challengesId:number};
    TopicList:{daysId:number}
    TopicWorkout:{workoutId:number|null };
    ProofScreen:{statusId:number,topicId:number,proofType:string,daysId:number,topicName:string,challengesId:number,input:number|null,topicType:string};
    ChallengeLists:{daysId:number,statusId:number,challengesId:number}
    Inside:{routineId:number,pPId:number,nameOfDay:string,planLength:number,workoutCelebId:number,currentWeek:number,currentStatus:number,currentWeekLength:number};
} 