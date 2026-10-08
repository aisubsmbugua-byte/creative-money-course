import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function pooledDatabaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  const url = new URL(raw);
  // Neon's pooled connection needs this so Prisma doesn't use prepared
  // statements that can go stale across schema changes ("cached plan must
  // not change result type") on the shared pooler connection.
  if (!url.searchParams.has("pgbouncer")) {
    url.searchParams.set("pgbouncer", "true");
  }
  return url.toString();
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: pooledDatabaseUrl() });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
