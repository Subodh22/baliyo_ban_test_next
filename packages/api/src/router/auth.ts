import { protectedProcedure, publicProcedure, router } from "../trpc";
import {z}from "zod";
import {Expo} from 'expo-server-sdk';
const SECERT_TOKEN =process.env.SECRET_TOKEN 
const expo = new Expo()
export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.auth.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
 

  sendNotice:publicProcedure.input(z.object({
    token:z.string()
  })).query(async({input,ctx})=>
  {
    // if(input.token !==SECERT_TOKEN)
    // {
    //   throw new Error('Unauthorized');
    // }
    // else{
        const message = {
          to:"ExponentPushToken[LeceGhM18Tt9ilEXjhiA2Y]",
          title:"Login Reminder",
          body:"login My boy",
          data:{someData:"u fat fuck"}

        };
        await expo.sendPushNotificationsAsync([message]);
    // }

  })

});
