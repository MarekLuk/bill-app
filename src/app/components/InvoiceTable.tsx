import React, { useState } from "react";

export interface Item {
  id: string;
  customer: string;
  name: string;
  cost: number;
  quantity: number;
  price: number;
}

export interface Customer {
  user_id: number | string;
  created_at?: string;
  owner_id?: string;
  name: string;
  email: string;
  address: string;
}

interface InvoiceTableProps {
  itemList: Item[];
  onEditItem?: (id: string, updatedItem: Partial<Item>) => void;
  onDeleteItem?: (id: string) => void;
  customers?: Customer[];
  editable?: boolean;
}

export default function InvoiceTable({
  itemList,
  onEditItem = () => {},
  onDeleteItem = () => {},
  customers = [],
  editable = true,
}: InvoiceTableProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedItemData, setEditedItemData] = useState<{
    customer: string;
    name: string;
    cost: number;
    quantity: number;
  }>({
    customer: "",
    name: "",
    cost: 0,
    quantity: 0,
  });

  const startEditing = (item: Item) => {
    setEditingItemId(item.id);
    setEditedItemData({
      customer: item.customer,
      name: item.name,
      cost: item.cost,
      quantity: item.quantity,
    });
  };

  const cancelEditing = () => {
    setEditingItemId(null);
    setEditedItemData({ customer: "", name: "", cost: 0, quantity: 0 });
  };

  const saveEditing = (id: string) => {
    const newPrice = editedItemData.cost * editedItemData.quantity;
    onEditItem(id, {
      name: editedItemData.name,
      cost: editedItemData.cost,
      quantity: editedItemData.quantity,
      price: newPrice,
    });
    setEditingItemId(null);
    setEditedItemData({ customer: "", name: "", cost: 0, quantity: 0 });
  };

  const TableView = () => (
    <div className="hidden md:block overflow-x-auto w-full">
      <table className="w-full min-w-max border-collapse my-4">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Customer</th>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Price</th>
            <th className="text-left p-2">Quantity</th>
            <th className="text-left p-2">Amount</th>
            {editable && <th className="text-left p-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {itemList.map((item) => {
            const isEditing = editingItemId === item.id;
            return (
              <tr key={item.id} className="border-b">
                <td className="text-sm p-2">
                  {isEditing ? (
                    <select
                      value={editedItemData.customer}
                      onChange={(e) =>
                        setEditedItemData({
                          ...editedItemData,
                          customer: e.target.value,
                        })
                      }
                      className="border p-1"
                    >
                      <option value="">Select a customer</option>
                      {(customers ?? []).map((cust) => (
                        <option key={cust.user_id} value={cust.name}>
                          {cust.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    item.customer
                  )}
                </td>

                <td className="text-sm p-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedItemData.name}
                      onChange={(e) =>
                        setEditedItemData({
                          ...editedItemData,
                          name: e.target.value,
                        })
                      }
                      className="border p-1"
                    />
                  ) : (
                    item.name
                  )}
                </td>

                <td className="text-sm p-2">
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedItemData.cost}
                      onChange={(e) =>
                        setEditedItemData({
                          ...editedItemData,
                          cost: Number(e.target.value),
                        })
                      }
                      className="border p-1"
                    />
                  ) : (
                    item.cost
                  )}
                </td>

                <td className="text-sm p-2">
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedItemData.quantity}
                      onChange={(e) =>
                        setEditedItemData({
                          ...editedItemData,
                          quantity: Number(e.target.value),
                        })
                      }
                      className="border p-1"
                    />
                  ) : (
                    item.quantity
                  )}
                </td>

                <td className="text-sm p-2">
                  {isEditing
                    ? (
                        editedItemData.cost * editedItemData.quantity
                      ).toLocaleString()
                    : Number(item.cost * item.quantity).toLocaleString()}
                </td>

                {editable && (
                  <td className="text-sm p-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => saveEditing(item.id)}
                          className="bg-green-500 text-white px-2 py-1 mr-2 rounded"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="bg-gray-500 text-white px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startEditing(item)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 mr-2 rounded"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteItem(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const CardView = () => (
    <div className="md:hidden">
      {itemList.map((item) => {
        const isEditing = editingItemId === item.id;

        return (
          <div key={item.id} className="border rounded p-3 mb-4">
            {isEditing ? (
              <>
                <label className="block mb-1 text-sm font-bold">Customer</label>
                <select
                  value={editedItemData.customer}
                  onChange={(e) =>
                    setEditedItemData({
                      ...editedItemData,
                      customer: e.target.value,
                    })
                  }
                  className="border p-1 w-full mb-2"
                >
                  <option value="">Select a customer</option>
                  {(customers ?? []).map((cust) => (
                    <option key={cust.user_id} value={cust.name}>
                      {cust.name}
                    </option>
                  ))}
                </select>

                <label className="block mb-1 text-sm font-bold">Name</label>
                <input
                  type="text"
                  value={editedItemData.name}
                  onChange={(e) =>
                    setEditedItemData({
                      ...editedItemData,
                      name: e.target.value,
                    })
                  }
                  className="border p-1 w-full mb-2"
                />

                <label className="block mb-1 text-sm font-bold">Price</label>
                <input
                  type="number"
                  value={editedItemData.cost}
                  onChange={(e) =>
                    setEditedItemData({
                      ...editedItemData,
                      cost: Number(e.target.value),
                    })
                  }
                  className="border p-1 w-full mb-2"
                />

                <label className="block mb-1 text-sm font-bold">Quantity</label>
                <input
                  type="number"
                  value={editedItemData.quantity}
                  onChange={(e) =>
                    setEditedItemData({
                      ...editedItemData,
                      quantity: Number(e.target.value),
                    })
                  }
                  className="border p-1 w-full mb-2"
                />

                <p className="text-sm font-medium mt-2">
                  Amount:{" "}
                  <span className="font-bold">
                    {(
                      editedItemData.cost * editedItemData.quantity
                    ).toLocaleString()}
                  </span>
                </p>

                {editable && (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEditing(item.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-sm mb-1">
                  <strong>Customer:</strong> {item.customer}
                </p>
                <p className="text-sm mb-1">
                  <strong>Name:</strong> {item.name}
                </p>
                <p className="text-sm mb-1">
                  <strong>Price:</strong> {item.cost}
                </p>
                <p className="text-sm mb-1">
                  <strong>Quantity:</strong> {item.quantity}
                </p>
                <p className="text-sm mb-1">
                  <strong>Amount:</strong>{" "}
                  {Number(item.cost * item.quantity).toLocaleString()}
                </p>
                {editable && (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(item)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
  return (
    <>
      <TableView />
      <CardView />
    </>
  );
}
