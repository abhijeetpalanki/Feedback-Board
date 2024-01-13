"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "./Button";
import LogoutIcon from "./icons/LogoutIcon";
import LoginIcon from "./icons/LoginIcon";

export default function Header() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.email;

  function logout() {
    signOut();
  }

  function login() {
    signIn("google");
  }

  return (
    <div className="flex items-center justify-end max-w-2xl gap-4 p-2 mx-auto">
      {isLoggedIn && (
        <>
          <span>Hello, {session.user.name}!</span>
          <Button
            className="px-2 py-0 bg-white border shadow-sm"
            onClick={logout}
          >
            Logout <LogoutIcon />
          </Button>
        </>
      )}
      {!isLoggedIn && (
        <>
          <span>Welcome, Guest</span>
          <Button
            className="px-2 py-0 bg-white border shadow-sm"
            onClick={login}
          >
            Login <LoginIcon />
          </Button>
        </>
      )}
    </div>
  );
}
