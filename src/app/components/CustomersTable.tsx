// interface Customer {
// 	name: string;
// 	email: string;
// 	id: number;
// }

// export default function CustomersTable({
// 	customers,
// 	refreshCustomers,
// }: {
// 	customers: Customer[];
// 	refreshCustomers: () => void;
// }) {
// 	const deleteCustomer = async (id: number) => {
// 		try {
// 			const request = await fetch(`/api/customers?id=${id}`, {
// 				method: "DELETE",
// 			});
// 			const response = await request.json();
// 			alert(response.message);
// 			refreshCustomers();
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	};
// 	return (
// 		<table>
// 			{customers.length > 0 ? (
// 				<thead>
// 					<tr>
// 						<th></th>
// 						<th>Name</th>
// 						<th>Email</th>
// 						<th>Action</th>
// 					</tr>
// 				</thead>
// 			) : (
// 				<p>No existing customers</p>
// 			)}

// 			<tbody>
// 				{customers.length > 0 &&
// 					customers.map((customer, index) => (
// 						<tr
// 							key={customer.id}
// 							className='hover:bg-gray-50 transition-colors border-t border-b border-gray-700 '>
// 							<td className='text-sm pr-4'>{index + 1}</td>
// 							<td className='text-sm pr-4'>{customer.name}</td>
// 							<td className='text-sm pr-4'>{customer.email}</td>
// 							<td className='text-sm'>
// 								<button
// 									className='p-2 mr-2 mb-1 mt-1 bg-blue-400 text-red-50  text-xs rounded-sm hover:bg-blue-500 transition-colors'
// 									onClick={() => deleteCustomer(customer.id)}>
// 									Edit
// 								</button>
// 								<button
// 									className='p-2 mr-2 mb-1 mt-1 bg-red-400 text-red-50  text-xs rounded-sm hover:bg-red-600 transition-colors'
// 									onClick={() => deleteCustomer(customer.id)}>
// 									Delete
// 								</button>
// 							</td>
// 						</tr>
// 					))}
// 			</tbody>
// 		</table>
// 	);
// }

import { useState } from "react";

interface Customer {
	name: string;
	email: string;
	address?: string;
	id: number;
}

export default function CustomersTable({
	customers,
	refreshCustomers,
}: {
	customers: Customer[];
	refreshCustomers: () => void;
}) {
	const [editingCustomerId, setEditingCustomerId] = useState<number | null>(
		null
	);
	const [editedData, setEditedData] = useState<{
		name: string;
		email: string;
		address?: string;
	}>({ name: "", email: "", address: "" });

	const startEditing = (customer: Customer) => {
		setEditingCustomerId(customer.id);
		setEditedData({
			name: customer.name,
			email: customer.email,
			address: customer.address ?? "",
		});
	};

	const cancelEditing = () => {
		setEditingCustomerId(null);
		setEditedData({ name: "", email: "", address: "" });
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedData({ ...editedData, [e.target.name]: e.target.value });
	};

	const saveChanges = async () => {
		if (!editingCustomerId) return;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(editedData.email)) {
			alert("Please enter a valid email address.");
			return;
		}
		try {
			const res = await fetch("/api/customers", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: editingCustomerId,
					name: editedData.name,
					email: editedData.email,
					address: editedData.address,
				}),
			});
			const data = await res.json();
			alert(data.message);
			refreshCustomers();
		} catch (err) {
			console.error(err);
		} finally {
			setEditingCustomerId(null);
			setEditedData({ name: "", email: "", address: "" });
		}
	};

	const deleteCustomer = async (id: number) => {
		const isConfirmed = window.confirm(
			"Are you sure you want to delete this customer?"
		);
		if (!isConfirmed) {
			return;
		}
		try {
			const request = await fetch(`/api/customers?id=${id}`, {
				method: "DELETE",
			});
			const response = await request.json();
			alert(response.message);
			refreshCustomers();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<table>
			{customers.length > 0 ? (
				<thead>
					<tr>
						<th></th>
						<th>Name</th>
						<th>Email</th>
						<th>Address</th>
						<th>Action</th>
					</tr>
				</thead>
			) : (
				<p>No existing customers</p>
			)}

			<tbody>
				{customers.length > 0 &&
					customers.map((customer, index) => {
						const isEditing = editingCustomerId === customer.id;
						return (
							<tr
								key={customer.id}
								className='hover:bg-gray-50 transition-colors border-t border-b border-gray-700'>
								<td className='text-sm pr-4'>{index + 1}</td>

								<td className='text-sm pr-4'>
									{isEditing ? (
										<input
											type='text'
											name='name'
											value={editedData.name}
											onChange={handleChange}
											className='border p-1 text-sm'
										/>
									) : (
										customer.name
									)}
								</td>

								<td className='text-sm pr-4'>
									{isEditing ? (
										<input
											type='email'
											name='email'
											value={editedData.email}
											onChange={handleChange}
											className='border p-1 text-sm'
											required
										/>
									) : (
										customer.email
									)}
								</td>

								<td className='text-sm pr-4'>
									{isEditing ? (
										<input
											type='text'
											name='address'
											value={editedData.address}
											onChange={handleChange}
											className='border p-1 text-sm'
										/>
									) : (
										(customer.address ?? "-")
									)}
								</td>

								<td className='text-sm'>
									{isEditing ? (
										<>
											<button
												className='p-2 mr-2 mb-1 mt-1 bg-green-400 text-white text-xs rounded-sm hover:bg-green-500 transition-colors'
												onClick={saveChanges}>
												Save
											</button>
											<button
												className='p-2 mr-2 mb-1 mt-1 bg-gray-400 text-white text-xs rounded-sm hover:bg-gray-500 transition-colors'
												onClick={cancelEditing}>
												Cancel
											</button>
										</>
									) : (
										<>
											<button
												className='p-2 mr-2 mb-1 mt-1 bg-blue-400 text-white text-xs rounded-sm hover:bg-blue-500 transition-colors'
												onClick={() => startEditing(customer)}>
												Edit
											</button>
											<button
												className='p-2 mr-2 mb-1 mt-1 bg-red-400 text-white text-xs rounded-sm hover:bg-red-600 transition-colors'
												onClick={() => deleteCustomer(customer.id)}>
												Delete
											</button>
										</>
									)}
								</td>
							</tr>
						);
					})}
			</tbody>
		</table>
	);
}
