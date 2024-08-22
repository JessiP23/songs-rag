import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";

export default function Header() {
  return (
    <Navbar shouldHideOnScroll className="w-[100vw] border-b border-gray-200 p-5">
      <NavbarContent>
        <NavbarBrand className="absolute justify-start left-[10%]">
          <p className="font-bold text-inherit">Rating AI</p>
        </NavbarBrand>
        <Navbar className="hidden sm:flex gap-4 justify-center">
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
        </Navbar>
        <Navbar className="absolute flex gap-4 right-[10%]">
          <NavbarItem className="hidden lg:flex">
            <Link href="#">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="primary" href="#" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        </Navbar>
      </NavbarContent>
    </Navbar>
  );
}
