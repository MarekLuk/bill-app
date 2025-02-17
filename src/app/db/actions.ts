import { invoicesDB, customersDB, bankInfoDB } from ".";
import { invoicesTable, customersTable, bankInfoTable } from "./schema";
import { desc, eq } from "drizzle-orm";

export const createInvoice = async (invoice: Invoice) => {
  await invoicesDB.insert(invoicesTable).values({
    owner_id: invoice.user_id,
    customer_id: String(invoice.customer_id),
    title: invoice.title,
    items: invoice.items,
    total_amount: String(invoice.total_amount),
  });
};

export const getUserInvoices = async (user_id: string) => {
  return await invoicesDB
    .select()
    .from(invoicesTable)
    .where(eq(invoicesTable.owner_id, user_id))
    .orderBy(desc(invoicesTable.created_at));
};

export const getSingleInvoice = async (id: number) => {
  return await invoicesDB
    .select()
    .from(invoicesTable)
    .where(eq(invoicesTable.id, id));
};

export const getCustomers = async (user_id: string) => {
  return await customersDB
    .select()
    .from(customersTable)
    .where(eq(customersTable.owner_id, user_id))
    .orderBy(desc(customersTable.created_at));
};

export const getSingleCustomer = async (name: string) => {
  return await customersDB
    .select()
    .from(customersTable)
    .where(eq(customersTable.name, name));
};

export const addCustomer = async (customer: Customer) => {
  await customersDB.insert(customersTable).values({
    owner_id: String(customer.user_id),
    name: customer.name,
    email: customer.email,
    address: customer.address,
  });
};

export const updateCustomer = async (
  id: number,
  data: { name?: string; email?: string; address?: string },
) => {
  await customersDB
    .update(customersTable)
    .set(data)
    .where(eq(customersTable.id, id));
};

export const deleteCustomer = async (id: number) => {
  await customersDB.delete(customersTable).where(eq(customersTable.id, id));
};

export const getUserBankInfo = async (user_id: string) => {
  return await bankInfoDB
    .select()
    .from(bankInfoTable)
    .where(eq(bankInfoTable.owner_id, user_id));
};

export const updateBankInfo = async (info: BankInfo) => {
  await bankInfoDB
    .insert(bankInfoTable)
    .values({
      owner_id: info.user_id,
      bank_name: info.bank_name,
      account_number: String(info.account_number),
      account_name: info.account_name,
      currency: info.currency,
    })
    .onConflictDoUpdate({
      target: bankInfoTable.owner_id,
      set: {
        bank_name: info.bank_name,
        account_number: String(info.account_number),
        account_name: info.account_name,
        currency: info.currency,
      },
    });
};

export const deleteInvoice = async (id: number) => {
  return await invoicesDB.delete(invoicesTable).where(eq(invoicesTable.id, id));
};
