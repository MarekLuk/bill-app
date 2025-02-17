import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";
import {
	ClerkProvider,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";

const inter = PT_Sans({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Quick invoice",
	description: "Super invoice app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider
		// appearance={{
		// 	elements: {
		// 		footer: "hidden",
		// 	},
		// }}
		>
			<html lang='en'>
				<body className={`${inter.className} bg-gray-45`}>
					<nav className='bg-white shadow-lg fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 '>
						<Link href='/' className='text-3xl font-bold mcolor'>
							Quick invoice
						</Link>
						<div className='flex items-center space-x-4 '>
							<SignedOut>
								<SignInButton mode='modal' />
							</SignedOut>
							<SignedIn>
								<Link
									href='/dashboard'
									className=' hidden md:block text-gray-700 hover:scolor transition-colors text-sm  mr-8 '>
									Dashboard
								</Link>
								<UserButton showName />
							</SignedIn>
						</div>
					</nav>

					<main className='pt-16'>{children}</main>
				</body>
			</html>
		</ClerkProvider>
	);
}
