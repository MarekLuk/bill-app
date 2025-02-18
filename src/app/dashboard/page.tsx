"use client";
import InvoiceTable, { Item } from "@/app/components/InvoiceTable";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import SideNav from "@/app/components/SideNav";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [itemList, setItemList] = useState<Item[]>([]);
  const [customer, setCustomer] = useState<string>("");

  const [invoiceTitle, setInvoiceTitle] = useState<string>("");
  const [itemCost, setItemCost] = useState<number>(0);
  const [itemQuantity, setItemQuantity] = useState<number>(0);
  const [itemName, setItemName] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [bankInfoExists, setBankInfoExists] = useState<boolean | null>(null);
  const [isFetchingBankInfo, setIsFetchingBankInfo] = useState(true);
  const router = useRouter();

  const fetchBankInfo = useCallback(async () => {
    try {
      setIsFetchingBankInfo(true);
      const response = await fetch(`/api/bank-info?userID=${user?.id}`);
      const data = await response.json();
      if (data?.bankInfo[0]) {
        setBankInfoExists(true);
      } else {
        setBankInfoExists(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingBankInfo(false);
    }
  }, [user]);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await fetch(`/api/customers?userID=${user?.id}`);
      const data = await res.json();
      setCustomers(data.customers);
    } catch (err) {
      console.log(err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBankInfo();
      if (bankInfoExists) {
        fetchCustomers();
      }
    }
  }, [fetchCustomers, user, fetchBankInfo, bankInfoExists]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim() && itemCost > 0 && itemQuantity >= 1) {
      setItemList([
        ...itemList,
        {
          id: Math.random().toString(36).substring(2, 9),
          customer: customer,
          name: itemName,
          cost: itemCost,
          quantity: itemQuantity,
          price: itemCost * itemQuantity,
        },
      ]);
    }

    setItemName("");
    setItemCost(0);
    setItemQuantity(0);
  };

  const getTotalAmount = () => {
    let total = 0;
    itemList.forEach((item) => {
      total += item.price;
    });
    return total;
  };

  const createInvoice = async () => {
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
          title: invoiceTitle,
          items: itemList,
          total: getTotalAmount(),
          ownerID: user?.id,
        }),
      });
      const data = await res.json();
      alert(data.message);
      router.push("/history");
    } catch (err) {
      console.log(err);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!customer || !invoiceTitle || !itemList.length || itemName) {
      alert("Please fill all fields");
      return;
    }
    createInvoice();
  };

  const handleDeleteItem = (id: string) => {
    setItemList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEditItem = (id: string, updatedItem: Partial<Item>) => {
    setItemList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)),
    );
  };

  if (!isLoaded || !isSignedIn || isFetchingBankInfo === true) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <main className="min-h-[90vh] flex items-start">
        <SideNav />
        {!bankInfoExists ? (
          <div className="md:w-5/6 w-full h-screen flex-col p-6 flex items-center justify-center">
            <p className="text-lg font-bold mb-3">
              Welcome, please add a bank info to start using the application!
            </p>
            <Link
              href="/settings"
              className="bg-red-500 p-3 text-red-50 rounded-md "
            >
              Add Bank Info
            </Link>
          </div>
        ) : (
          <div className="md:w-5/6 w-full h-full p-6">
            <h2 className="font-bold text-2xl mb-3">Create new invoice</h2>

            <form className="w-full flex flex-col" onSubmit={handleFormSubmit}>
              <label htmlFor="customer">Customer</label>
              {customers && customers.length > 0 ? (
                <select
                  className="border-[1px] p-2 rounded-sm mb-3"
                  required
                  value={customer}
                  onChange={(e) => {
                    setCustomer(e.target.value);
                  }}
                >
                  <option value="" disabled>
                    Select a customer
                  </option>
                  {customers.map((customer: Customer) => (
                    <option key={customer.id} value={customer.name}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-red-500">
                  No customers found. Please add a customer
                </p>
              )}

              <label htmlFor="title">Title</label>
              <input
                className="border-[1px] rounded-sm mb-3 py-2 px-3"
                required
                value={invoiceTitle}
                onChange={(e) => setInvoiceTitle(e.target.value)}
              />

              <div className="w-full flex justify-between flex-col">
                <h3 className="my-4 font-bold ">List</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex flex-col">
                    <label htmlFor="itemName" className="text-sm">
                      Name
                    </label>
                    <input
                      type="text"
                      name="itemName"
                      placeholder="Name"
                      className="py-2 px-4 mb-6 bg-gray-100"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col ">
                    <label htmlFor="itemCost" className="text-sm">
                      Price
                    </label>
                    <input
                      type="number"
                      name="itemCost"
                      placeholder="Cost"
                      className="py-2 px-4 mb-6 bg-gray-100"
                      value={itemCost === 0 ? "" : itemCost}
                      onChange={(e) => {
                        const parsed = parseFloat(e.target.value);
                        if (isNaN(parsed)) {
                          setItemCost(0);
                        } else {
                          setItemCost(parsed);
                        }
                      }}
                    />
                  </div>

                  <div className="flex flex-col  ">
                    <label htmlFor="itemQuantity" className="text-sm">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="itemQuantity"
                      placeholder="Quantity"
                      className="py-2 px-4 mb-6 bg-gray-100"
                      value={itemQuantity === 0 ? "" : itemQuantity}
                      onChange={(e) => {
                        const parsed = parseFloat(e.target.value);
                        if (isNaN(parsed)) {
                          setItemQuantity(0);
                        } else {
                          setItemQuantity(parsed);
                        }
                      }}
                    />
                  </div>

                  <div className="flex flex-col ">
                    <p className="text-sm">Amount</p>
                    <p className="py-2 px-4 mb-6 bg-gray-100">
                      {Number(itemCost * itemQuantity).toLocaleString("en-US")}
                    </p>
                  </div>
                </div>
                <button
                  className="button-color text-gray-100 w-[100px] p-2 rounded"
                  onClick={handleAddItem}
                >
                  Add Item
                </button>
              </div>

              <InvoiceTable
                itemList={itemList}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                customers={customers}
              />

              <button
                className="bg-emerald-700 text-gray-100 w-full p-4 rounded my-6"
                type="submit"
              >
                SAVE & PREVIEW INVOICE
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
