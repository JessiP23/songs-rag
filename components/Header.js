'use client'

import React, {useState} from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import {useUser, useAuth, SignedIn, UserButton, useClerk} from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import { Menu } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    // ui design for header 
    // still missing to add logic for user authentication
    <Navbar shouldHideOnScroll className="w-full border-b border-gray-200 p-5 flex flex-col lg:flex-row items-center justify-between relative">
      <NavbarBrand className="flex items-center mb-4 lg:mb-0">
        <p className="font-bold text-inherit text-xl lg:text-2xl">Rating AI</p>
      </NavbarBrand>
      
      {/* Menu Icon for mobile */}
      <div className="lg:hidden flex items-center">
        <button onClick={toggleMenu} className="text-gray-800">
          {isMenuOpen ? (
            <CloseIcon className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      
      <NavbarContent className={`flex-col lg:flex-row lg:items-center gap-4 ${isMenuOpen ? 'flex' : 'hidden'} lg:flex`}>
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
        <NavbarItem>
          <Link href="/chatbot" aria-current="page">
            Add songs
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/platform" aria-current="page">
            Global Platform
          </Link>
        </NavbarItem>
      </NavbarContent>
      
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <UserButton afterSignOutUrl="/" />
            <Button auto onClick={handleSignOut}>Sign out</Button>
          </div>
        )}
      </div>
    </Navbar>
  );
}