"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import Image from "next/image";

const SignUp = () => {
  const [login, setLogin] = useState(true);
  return (
    <>
      <nav className="z-[-10]">
        <a href="#home">
          <Image
            src="/logo.svg"
            alt="logo"
            className="absolute left-[73px] top-10"
            width={144}
            height={144}
          />
        </a>
      </nav>

      <div
        className=" 
        border border-blue-800
        flex 
        justify-center 
        items-center 
        h-screen 
        lg:w-full 
        xl:w-[100%]
        2xl:w-[100%]
        3xl:w-[100%]
      "
      >
        <div
          className="
          w-[600px]
          h-[600px]
          flex 
          flex-col
          justify-center
          items-center
          gap-4
          mt-16
        "
        >
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-[#97a0af]">
              Welcome back to the world of cutting-edge
            </h2>
            <h2 className="text-[#97a0af] ">
              design automation for seamless UI/UX.
            </h2>
          </div>
          <div className="bg-[#e9edf4] sm:w-[300px] md:w-[300px] w-[400px] p-2 rounded-md flex flex-row justify-center items-center ">
            <button
              className={`border h-[40px] w-[240px] rounded-md ${
                login ? "bg-[#346ef1] text-white" : ""
              }`}
              onClick={() => setLogin(true)}
            >
              Sign Up
            </button>
            <button
              className={`border-none h-[40px] w-[240px] rounded-md ${
                !login ? "bg-[#346ef1] text-white" : ""
              }`}
              onClick={() => setLogin(false)}
            >
              Sign In
            </button>
          </div>
          <div
            className="
              h-[200px]
            "
          >
            {login ? (
              <form>
                <div className="flex flex-col justify-center items-center gap-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    className="sm:w-[300px] md:w-[300px] w-[400px] h-[40px] p-2 rounded-md"
                    required={true}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="sm:w-[300px] md:w-[300px] w-[400px] h-[40px] p-2 rounded-md"
                  />
                </div>
              </form>
            ) : (
              <form>
                <div className="flex flex-col gap-3 justify-center items-center">
                  <Input
                    type="text"
                    placeholder="Full Name"
                    className="sm:w-[300px] md:w-[300px] w-[400px] h-[40px] p-2 rounded-md"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="sm:w-[300px] md:w-[300px] w-[400px] h-[40px] p-2 rounded-md"
                  />
                  <Input
                    type="password"
                    placeholder="Create Password"
                    className="sm:w-[300px] md:w-[300px] w-[400px] h-[40px] p-2 rounded-md"
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    className="sm:w-[300px] md:w-[300px] w-[400px] h-[40px] p-2 rounded-md"
                  />
                </div>
              </form>
            )}
            <div className="flex flex-col gap-4">
              <Button
                className="sm:w-[300px] md:w-[300px] w-[400px] h-[40px] rounded-md bg-[#346ef1] text-white mt-4 hover:bg-[#1e4bbf] cursor-pointer"
                onClick={() => {}}
              >
                <span className="cursor-pointer">
                  {login ? "Log In" : "Create Account"}
                </span>
              </Button>
              <Button className="sm:w-[300px] md:w-[300px] w-[400px] h-[40px] rounded-md inline-block text-sm font-medium text-center no-underline transition-all duration-[0.3s] ease-[ease] text-[#344563] border-0 bg-white hover:[background:#346ef1] hover:text-white">
                <div className="flex flex-row justify-center items-center gap-4">
                  <Image
                    src="/google-logo.svg"
                    alt="google-logo"
                    width={20}
                    height={20}
                  />
                  <span className="cursor-pointer">Sign in with Google</span>
                </div>
              </Button>
            </div>
          </div>
          <div>
            <blockquote className="text-[#b4bac5] text-center text-base font-normal mt-[130px]">
              ©2023 uxmagic.ai
            </blockquote>
          </div>
        </div>
        <div
          className="
            w-[30%] 
            h-[600px] 
            overflow-hidden
            mt-16
            xl:w-[35%]
            md:hidden
            lg:hidden
            sm:hidden
          "
        >
          <Image
            width={370}
            height={500}
            src="/Frame3.svg"
            alt="frame"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default SignUp;
