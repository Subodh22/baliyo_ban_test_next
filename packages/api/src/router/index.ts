import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { uploadRouter } from "./upload";

export const appRouter = router({
  post: postRouter,
  auth: authRouter,
  upload:uploadRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
