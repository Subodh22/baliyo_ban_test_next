import type { NextPage } from "next";
import Head from "next/head";
 
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "../../utils/trpc";



const DeletePage: NextPage = () => {
  const postQuery = trpc.post.deleteUserData.useMutation()
  const {user} = useUser();
  const { signOut } = useAuth();
  const [deleteText,setDeleteText]=useState("");
    const deleteUser = async()=>
    {
        
        
        if(deleteText=="DELETE MY ACCOUNT"){
            await postQuery.mutateAsync();
      
            await user?.delete()
            signOut()
        }
    }
  return (
    <>
      <Head>
        <title>Delete your account</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/icon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center bg-gradient-to-b   ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <h1 className="text-5xl text font-extrabold tracking-tight sm:text-[5rem]">
          Delete your account
          </h1>
          <AuthShowcase />
          <div className="flex mt-2">
        <input 
            type="email" 
            
            value={deleteText}
            onChange={(e)=>{setDeleteText(e.target.value)}}
            placeholder="type DELETE MY ACCOUNT" 
            className="flex-grow p-2   border-t border-b border-l border-gray-300 outline-none"
        />
        <button onClick={deleteUser}  className="bg-yellow-300 w-40 text-black  p-2 px-4   hover:bg-yellow-500 transition duration-300">
           Delete
        </button>
    </div>
         
        </div>
      </main>
    </>
  );
};

export default DeletePage;

const AuthShowcase: React.FC = () => {
  const { isSignedIn } = useAuth();
  // const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
  //   undefined,
  //   { enabled: !!isSignedIn },
  // );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {isSignedIn && (
        <>
          <p className="text-center text-2xl text-white">
            {/* {secretMessage && (
              <span>
                {" "}
                {secretMessage} click the user button!
                <br />
              </span>
            )} */}
          </p>
          <div className="flex items-center justify-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "3rem",
                    height: "3rem",
                  },
                },
              }}
            />
          </div>
        </>
      )}
      {!isSignedIn && (
        <p className="text-center text-2xl ">
          <Link href="/sign-in">Sign In</Link>
        </p>
      )}
    </div>
  );
};
