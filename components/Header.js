import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import {useUser, useAuth, SignedIn, UserButton, useClerk} from '@clerk/nextjs';
import { useRouter } from "next/navigation";

export default function Header() {
  const {user}= useUser();
  const {signOut} = useAuth();
  const router = useRouter();

  const handleSignOut = async() => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    // ui design for header 
    // still missing to add logic for user authentication
    <Navbar shouldHideOnScroll className="w-[100vw] border-b border-gray-200 p-5 flex justify-between">
      <NavbarBrand className="flex items-center">
        <p className="font-bold text-inherit">Rating AI</p>
      </NavbarBrand>
      <NavbarContent className="flex items-center gap-4">
        <NavbarItem>
          <Link color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/dashboard">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="/chatbot" aria-current="page">
            Add songs
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="/platform" aria-current="page">
            Global Platform
          </Link>
        </NavbarItem>
      </NavbarContent>
      <div className="flex items-center gap-4">
        {user && (
          <div>
              <UserButton afterSignOutUrl="/" />
              <Button auto onClick={handleSignOut}>Sign out</Button>
          </div>
        )}
      </div>
    </Navbar>
  );
}