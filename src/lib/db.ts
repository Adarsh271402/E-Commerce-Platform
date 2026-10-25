import { PrismaClient } from '@prisma/client'
import { getConnectionString } from '@netlify/database'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: (process.env.NETLIFY || process.env.NETLIFY_DB_URL || process.env.AWS_LAMBDA_FUNCTION_NAME)
      ? getConnectionString()
      : process.env.DATABASE_URL,
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
