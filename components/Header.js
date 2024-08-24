'use client'

import React, {useState} from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import {useUser, useAuth, SignedIn, UserButton, useClerk} from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import { Menu } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';


//this is a header responsive that shows options like Home, Dashboard, Chatbot, and global platform.

// responsive in md and sm that adds a menu icon and when clicking on it shows properties in a friendly manner.
export default function Header() {
  // add user authentication feature
  const {user}= useUser();
  const {signOut} = useAuth();
  const router = useRouter();


  //if user decides to sign out, then it is added to the / page.
  const handleSignOut = async() => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // responsive menu design
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // toggle menu for md and sm devices
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
      
      {/* Menu Icon for sm devices */}
      <div className="lg:hidden flex items-center">
        <button onClick={toggleMenu} className="text-gray-800">
          {isMenuOpen ? (
            <CloseIcon className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      
      {/* options for header */}
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
      
      {/* signing out users. */}
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