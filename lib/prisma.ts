import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const globalDb = globalThis as unknown as { prisma?: PrismaClient };
export function getPrisma() {
  if (!globalDb.prisma) {
    const raw = process.env.DATABASE_URL;
    if (!raw || raw.includes("TU_PASSWORD")) throw new Error("DATABASE_NOT_CONFIGURED");
    const url = new URL(raw);
    const isLocal = ["localhost", "127.0.0.1"].includes(url.hostname);
    // La CA pública de Supabase permite verificar el certificado sin desactivar TLS.
    const ssl = isLocal ? undefined : {
      ca: readFileSync(join(process.cwd(), "certs/supabase-ca.crt"), "utf8"),
      rejectUnauthorized: true,
    };
    url.searchParams.delete("sslmode");
    url.searchParams.delete("sslrootcert");
    const adapter = new PrismaPg({ connectionString: url.toString(), ssl,
      max: 1, connectionTimeoutMillis: 10000, idleTimeoutMillis: 20000 });
    globalDb.prisma = new PrismaClient({ adapter });
  }
  return globalDb.prisma;
}
