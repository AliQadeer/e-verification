import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '@/lib/prisma';
import { TRPCError } from '@trpc/server';

export const userRouter = router({
  // Get user by reference number
  getByReference: publicProcedure
    .input(z.object({ referenceNo: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { referenceNo: input.referenceNo },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User data not found',
        });
      }

      return user;
    }),

  // Get user by certificate number (for QR scan)
  getByCertificate: publicProcedure
    .input(z.object({ certificateNo: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { certificateNo: input.certificateNo },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User data not found',
        });
      }

      return user;
    }),

  // Get all users (for admin)
  getAll: publicProcedure.query(async () => {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }),

  // Create user
  create: publicProcedure
    .input(
      z.object({
        certificateNo: z.string(),
        referenceNo: z.string(),
        name: z.string(),
        idNo: z.string(),
        company: z.string(),
        issuanceNo: z.string(),
        issuedDate: z.string(),
        validUntil: z.string(),
        type: z.string(),
        model: z.string().optional(),
        trainer: z.string().optional(),
        location: z.string().optional(),
        imageUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { certificateNo: input.certificateNo },
            { referenceNo: input.referenceNo },
          ],
        },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User with this certificate or reference number already exists',
        });
      }

      return await prisma.user.create({
        data: {
          ...input,
          issuedDate: new Date(input.issuedDate),
          validUntil: new Date(input.validUntil),
        },
      });
    }),

  // Update user
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        certificateNo: z.string(),
        referenceNo: z.string(),
        name: z.string(),
        idNo: z.string(),
        company: z.string(),
        issuanceNo: z.string(),
        issuedDate: z.string(),
        validUntil: z.string(),
        type: z.string(),
        model: z.string().optional(),
        trainer: z.string().optional(),
        location: z.string().optional(),
        imageUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      return await prisma.user.update({
        where: { id },
        data: {
          ...data,
          issuedDate: new Date(data.issuedDate),
          validUntil: new Date(data.validUntil),
        },
      });
    }),

  // Delete user
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.user.delete({
        where: { id: input.id },
      });
    }),
});
