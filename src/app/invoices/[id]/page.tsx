"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import InvoiceTable from "@/app/components/InvoiceTable";
import { useEffect, useCallback, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { forwardRef } from "react";
import { useParams, useSearchParams } from "next/navigation";

interface Props {
	id: string;
	customer: Customer;
	bankInfo: BankInfo;
	invoice: Invoice;
}

interface CustomerResponse {
	customer: Customer[];
}

interface BankInfoResponse {
	bankInfo: BankInfo[];
}

interface InvoiceResponse {
	invoice: Invoice[];
}

const formatDateString = (dateString: string): string => {
	const date = new Date(dateString);
	const day = date.getDate();
	const month = date.toLocaleString("default", { month: "long" });
	const year = date.getFullYear();

	return `${day} ${month}, ${year}`;
};

const ComponentToPrint = forwardRef<HTMLDivElement, Props>((props, ref) => {
	const { id, customer, invoice, bankInfo } = props as Props;

	return (
		<div ref={ref} className='w-full px-1 py-1 bg-gray-50'>
			<div className='min-h-[280mm] max-w-3xl mx-auto bg-white border border-gray-200 shadow-md rounded-lg p-8'>
				<header className='flex justify-between items-center border-b border-gray-300 pb-4 mb-6'>
					<div className='flex items-center'>
						<h1 className='text-3xl font-bold'>INVOICE</h1>
					</div>
					<div className='text-right'>
						<p className='text-sm text-gray-600'>Invoice #0{id}</p>
						<p className='text-sm text-gray-600'>
							Date: {formatDateString(invoice?.created_at ?? "")}
						</p>
					</div>
				</header>

				<section className='flex justify-between mb-6'>
					<div className='w-1/2'>
						<h2 className='text-lg font-semibold mb-2'>Bill To:</h2>
						<p className='text-sm text-gray-700'>{invoice?.customer_id}</p>
						<p className='text-sm text-gray-700'>{customer?.address}</p>
						<p className='text-sm text-gray-700'>{customer?.email}</p>
					</div>
					<div className='w-1/2 text-right'>
						<h2 className='text-lg font-semibold mb-2'>Issuer:</h2>
						<p className='text-sm text-gray-700'>{bankInfo?.account_name}</p>
						<p className='text-sm text-gray-700'>
							{bankInfo?.account_number} ({bankInfo?.currency})
						</p>
					</div>
				</section>

				<section className='flex justify-between items-center mb-6'>
					<h2 className='text-xl font-semibold'>{invoice?.title}</h2>
					<div className='text-right'>
						<p className='text-sm text-gray-600'>Total Amount:</p>
						<p className='text-2xl font-bold'>
							{bankInfo?.currency}
							{Number(invoice?.total_amount).toLocaleString()}
						</p>
					</div>
				</section>

				<section className='mb-6'>
					<InvoiceTable
						itemList={invoice?.items ? JSON.parse(invoice.items) : []}
						editable={false}
					/>
				</section>

				<footer className='border-t border-gray-300 pt-4 text-center italic text-sm text-gray-600 mt-auto'>
					Thank you for your business!
				</footer>
			</div>
		</div>
	);
});
ComponentToPrint.displayName = "ComponentToPrint";

export default function Invoices() {
	const { isLoaded, isSignedIn, user } = useUser();
	const { id } = useParams<{ id: string }>();
	const searchParams = useSearchParams();
	const [customer, setCustomer] = useState<Customer>();
	const [bankInfo, setBankInfo] = useState<BankInfo>();
	const [invoice, setInvoice] = useState<Invoice>();

	const name = searchParams.get("customer");

	const componentRef = useRef<HTMLDivElement>(null);

	async function fetchData<T>(endpoint: string): Promise<T> {
		const response = await fetch(endpoint);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch from ${endpoint}: ${response.statusText}`
			);
		}
		return response.json();
	}

	const getAllInvoiceData = useCallback(async () => {
		try {
			const [customer, bankInfo, invoice] = await Promise.all([
				fetchData<CustomerResponse>(`/api/customers/single?name=${name}`),
				fetchData<BankInfoResponse>(`/api/bank-info?userID=${user?.id}`),
				fetchData<InvoiceResponse>(`/api/invoices/single?id=${id}`),
			]);
			setCustomer(customer?.customer[0]);
			setBankInfo(bankInfo?.bankInfo[0]);
			setInvoice(invoice?.invoice[0]);
		} catch (err) {
			console.error(err);
		}
	}, [id, name, user]);

	useEffect(() => {
		getAllInvoiceData();
	}, [id, name, user, getAllInvoiceData]);

	const handlePrint = useReactToPrint({
		documentTitle: "Invoice",
		contentRef: componentRef,
	});

	if (!isLoaded || !isSignedIn) {
		return (
			<div className='w-full h-screen flex items-center justify-center'>
				<p className='text-lg'>Loading...</p>
			</div>
		);
	}

	return (
		<main className='w-full min-h-screen'>
			<section className='w-full flex p-4 items-center justify-center space-x-5 mb-3'>
				<button
					className='p-3 text-white button-color  rounded-md button-color'
					onClick={() => handlePrint()}>
					Download
				</button>
			</section>
			{bankInfo && customer && invoice && (
				<ComponentToPrint
					ref={componentRef}
					id={id}
					customer={customer}
					bankInfo={bankInfo}
					invoice={invoice}
				/>
			)}
		</main>
	);
}
