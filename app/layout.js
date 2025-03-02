import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Outfit } from 'next/font/google'
import UserProvider from "./context/UserContext/UserProvider";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const outfit = Outfit({ subsets: ["latin"], display: "swap" });


export default function RootLayout({ children }) {  
  return (
    <ClerkProvider isomorphic>
      <UserProvider>
        <html lang="en" key="html-root">
          <body suppressHydrationWarning={true} className={outfit.className} key="body-root">
            {children}
          </body>
        </html>
      </UserProvider>
    </ClerkProvider>

  );
}
