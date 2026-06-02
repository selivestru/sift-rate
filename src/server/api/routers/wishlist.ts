import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import {
  addWishlistItemSchema,
  deleteWishlistItemSchema
} from '~/utils/validators'

export const wishlistRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.wishlistItem.findMany({
      where: {
        userId: ctx.session.user.id
      },
      include: {
        itemReview: {
          select: {
            title: true,
            coverUrl: true,
            type: true,
            externalId: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }),
  add: protectedProcedure
    .input(addWishlistItemSchema)
    .mutation(async ({ ctx, input }) => {
      let itemReview = await ctx.db.itemReview.findFirst({
        where: {
          externalId: input.externalId
        }
      })

      itemReview ??= await ctx.db.itemReview.create({
        data: {
          externalId: input.externalId,
          title: input.title,
          coverUrl: input.coverUrl,
          type: input.type
        }
      })

      const existingReview = await ctx.db.review.findFirst({
        where: {
          userId: ctx.session.user.id,
          itemReviewId: itemReview.id
        },
        select: {
          id: true
        }
      })

      if (existingReview) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Этот объект уже оценен'
        })
      }

      const existingWishlistItem = await ctx.db.wishlistItem.findFirst({
        where: {
          userId: ctx.session.user.id,
          itemReviewId: itemReview.id
        },
        select: {
          id: true
        }
      })

      if (existingWishlistItem) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Этот объект уже есть в ожиданиях'
        })
      }

      return await ctx.db.wishlistItem.create({
        data: {
          userId: ctx.session.user.id,
          itemReviewId: itemReview.id
        },
        include: {
          itemReview: {
            select: {
              title: true,
              coverUrl: true,
              type: true,
              externalId: true
            }
          }
        }
      })
    }),
  delete: protectedProcedure
    .input(deleteWishlistItemSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.wishlistItem.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id
        },
        include: {
          itemReview: {
            select: {
              externalId: true
            }
          }
        }
      })
    })
})
