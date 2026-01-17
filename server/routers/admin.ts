import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '@/lib/prisma';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';

export const adminRouter = router({
  // Login
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const admin = await prisma.admin.findUnique({
        where: { username: input.username },
      });

      if (!admin) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      const isValid = await bcrypt.compare(input.password, admin.password);

      if (!isValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      return {
        id: admin.id,
        username: admin.username,
      };
    }),

  // Create admin (use this once to create initial admin)
  createAdmin: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);

      const admin = await prisma.admin.create({
        data: {
          username: input.username,
          password: hashedPassword,
        },
      });

      return {
        id: admin.id,
        username: admin.username,
      };
    }),
});
