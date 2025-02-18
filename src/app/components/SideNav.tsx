import Link from "next/link";
import { VscNewFile } from "react-icons/vsc";
import { TfiArchive } from "react-icons/tfi";
import { SlPeople } from "react-icons/sl";
import { CiSettings } from "react-icons/ci";

export default function SideNav() {
  return (
    <>
      <div className="hidden md:flex md:w-32 h-[90vh] border-r border-gray-200 p-4 flex-col space-y-6">
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center hover:bg-emerald-100 rounded-sm p-2 text-center"
        >
          <VscNewFile className="mcolor text-2xl" />
          <span className="mt-1 text-xs">Create Invoice</span>
        </Link>

        <Link
          href="/history"
          className="flex flex-col items-center justify-center hover:bg-emerald-100 rounded-sm p-2 text-center"
        >
          <TfiArchive className="mcolor text-2xl" />
          <span className="mt-1 text-xs">Invoice Archive</span>
        </Link>

        <Link
          href="/customers"
          className="flex flex-col items-center justify-center hover:bg-emerald-100 rounded-sm p-2 text-center"
        >
          <SlPeople className="mcolor text-2xl" />
          <span className="mt-1 text-xs">Customer List</span>
        </Link>

        <Link
          href="/settings"
          className="flex flex-col items-center justify-center hover:bg-emerald-100 rounded-sm p-2 text-center"
        >
          <CiSettings className="mcolor text-2xl" />
          <span className="mt-1 text-xs">Payment Settings</span>
        </Link>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2">
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center"
        >
          <VscNewFile className="mcolor text-xl" />
          <span className="text-xs">Invoice</span>
        </Link>
        <Link
          href="/history"
          className="flex flex-col items-center justify-center"
        >
          <TfiArchive className="mcolor text-xl" />
          <span className="text-xs">Archive</span>
        </Link>
        <Link
          href="/customers"
          className="flex flex-col items-center justify-center"
        >
          <SlPeople className="mcolor text-xl" />
          <span className="text-xs">Customers</span>
        </Link>
        <Link
          href="/settings"
          className="flex flex-col items-center justify-center"
        >
          <CiSettings className="mcolor text-xl" />
          <span className="text-xs">Settings</span>
        </Link>
      </div>
    </>
  );
}
