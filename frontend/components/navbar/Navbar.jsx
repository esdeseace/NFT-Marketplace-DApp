import React, { useState } from "react";
import Logo from "../../subcomponents/logo/Logo";
import Link from "next/link";
import { navLinks } from "../../data";
import { useRouter } from "next/router";
import {
  AiOutlineMenuUnfold,
  AiOutlineMenuFold,
  AiFillPlusCircle,
  AiOutlinePlus,
} from "react-icons/ai";
import { TbLayoutDashboard } from "react-icons/tb";
import BtnMain from "../../subcomponents/btns/BtnMain";

export default function Navbar() {
  const router = useRouter();
  const [isMobileNavOpen, setisMobileNavOpen] = useState(false);

  const handleClick = () => {
    router.push("/sell");
    if (isMobileNavOpen) {
      setisMobileNavOpen(false);
    }
  };
  return (
    <div>
      <div class="flex flex-wrap sys-app-notCollapsed ">
        <div class="w-full ">
          <div class="pb-0 py-2 px-2 mx-auto ">
            <div class="w-full flex justify-between items-center p-2 text-gray-900 bg-white rounded-lg shadow-lg font-medium capitalize">
              <div>
                <span class="px-2 mr-2 md:border-r border-gray-800">
                  <img
                    src="https://www.freepnglogos.com/uploads/spotify-logo-png/file-spotify-logo-png-4.png"
                    alt="alt placeholder"
                    class="w-8 h-8 -mt-1 inline mx-auto"
                  />
                </span>
              </div>
              <div class="px-2 md:flex gap-x-5 items-center flex-1 text-gray-900 bg-white font-medium capitalize hidden">
                {navLinks?.map(({ title, link, icon }, id) => (
                  <Link id={id} href={link}>
                    <a
                      id={id}
                      class={`px-2 py-1 flex items-center cursor-pointer hover:bg-gray-200 hover:text-gray-700 text-sm rounded ${
                        router.pathname == link
                          ? "text-gray-700 font-semibold"
                          : ""
                      }`}
                    >
                      <span class="p-2 bg-gray-200 rounded-full">{icon}</span>
                      <span class="mx-1">{title}</span>
                    </a>
                  </Link>
                ))}
              </div>
              <BtnMain
                text="List NFT"
                icon={<AiOutlinePlus className="text-2xl" />}
                className="md:flex hidden "
                onClick={handleClick}
              />
              <div class="md:hidden transition-all mr-3 my-3 cursor-pointer hover:text-gray-700">
                {isMobileNavOpen ? (
                  <AiOutlineMenuFold
                    onClick={() => setisMobileNavOpen(false)}
                    className="rounded text-2xl"
                  />
                ) : (
                  <AiOutlineMenuUnfold
                    onClick={() => setisMobileNavOpen(true)}
                    className="rounded text-2xl"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navbar */}
          <div
            id="navbar"
            class={`pt-0 absolute top-2 z-100 mx-auto ${
              isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
            } transition-all flex-wrap md:hidden`}
          >
            <div class="py-[.5px] w-64">
              <div class="w-full py-4 space-y-6 px-2 text-gray-900 bg-white rounded-lg min-h-screen  text-left capitalize font-medium shadow-lg">
                <img
                  src="https://www.freepnglogos.com/uploads/spotify-logo-png/file-spotify-logo-png-4.png"
                  alt="alt placeholder"
                  class="w-8 h-8 mx-auto mb-5 "
                />
                {navLinks?.map(({ title, link, icon }, id) => (
                  <Link id={id} href={link}>
                    <a
                      id={id}
                      class={`px-2 flex items-center cursor-pointer hover:bg-gray-200 hover:text-gray-700 text-sm rounded ${
                        router.pathname == link
                          ? "text-gray-700 font-semibold"
                          : ""
                      }`}
                    >
                      <span class="p-2 bg-gray-200 rounded-full">{icon}</span>
                      <span class="mx-1">{title}</span>
                    </a>
                  </Link>
                ))}
                <BtnMain
                  text="List NFT"
                  icon={<AiOutlinePlus className="text-2xl" />}
                  className="w-full !rounded-full"
                  onClick={handleClick}
                />
                {/* <span class="relative mr-3 cursor-pointer hover:text-gray-700">
                  <p class="rounded-full mt-6 text-center border border-blue-500 py-2 px-8 bg-blue-500 hover:bg-blue-700 text-white">
                    List NFT
                  </p>
                </span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
