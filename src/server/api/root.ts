import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc'
import { reviewRouter } from './routers/review'
import { wishlistRouter } from './routers/wishlist'

export const appRouter = createTRPCRouter({
  review: reviewRouter,
  wishlist: wishlistRouter
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
