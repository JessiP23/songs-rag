import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";

export default function Header() {
  return (
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
          <Link href="/chatbot" aria-current="page">
            Rate songs
          </Link>
        </NavbarItem>
      </NavbarContent>
      <div className="flex items-center gap-4">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </div>
    </Navbar>
  );
}