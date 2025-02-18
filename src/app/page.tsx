import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
// import { getDBVersion } from "./db";
import "./globals.css";

export default async function Home() {
  // const { version } = await getDBVersion();
  // console.log({ version });
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-emerald-100 to-emerald-50">
      <div className="w-full max-w-4xl px-4">
        <section className="text-center py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Effortlessly Generate Professional Invoices
          </h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Quick invoice is a cutting-edge invoicing platform that empowers you
            to design and print stunning invoices at no cost. Streamline your
            workflow and keep your clients perfectly organized with our
            seamless, user-friendly solution.
          </p>
          <Link
            href="/dashboard"
            className="inline-block button-color text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-text-emerald-400 transition-colors duration-300"
          >
            Sign in
          </Link>
        </section>
        <footer className="fixed bottom-0 left-0 right-0 text-center  text-sm p-2 m-6">
          2025 Quick invoice. Empowering your business with seamless invoicing.
        </footer>
      </div>
    </main>
  );
}
