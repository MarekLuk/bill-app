import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { invoicesTable, customersTable, bankInfoTable } from "./schema";

if (!process.env.NEON_DATABASE_URL) {
	throw new Error("DATABASE_URL must be a Neon postgres connection string");
}

export const getDBVersion = async () => {
	const sql = neon(process.env.NEON_DATABASE_URL!);
	const response = await sql`SELECT version()`;
	return { version: response[0].version };
};
const sql = neon(process.env.NEON_DATABASE_URL!);

export const invoicesDB = drizzle(sql, {
	schema: { invoicesTable },
});

export const customersDB = drizzle(sql, {
	schema: { customersTable },
});

export const bankInfoDB = drizzle(sql, {
	schema: { bankInfoTable },
});
