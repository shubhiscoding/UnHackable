import { useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";

interface TopBarProps {
  title: string;
  image: string;
}

export default function TopBar(Req: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="flex w-full items-center bg-black text-white px-4 h-20 relative">
      <div className="flex justify-between w-full">
        <h1 className="font-semibold text-xl">{Req.title}</h1>
        <div className="relative">
          <Image
            className="rounded-full cursor-pointer"
            src={Req.image}
            alt="Profile"
            width={40}
            height={40}
            onClick={toggleDropdown}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-md shadow-md">
              <button
                onClick={() => {
                    signOut({ callbackUrl: '/' });
                }}
                className="w-full px-4 py-2 text-left hover:bg-zinc-700 rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
