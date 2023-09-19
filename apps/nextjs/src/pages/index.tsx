import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
 
import { SignedIn, SignedOut, useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import NavBar from "../components/NavBar";
import MvpPage from "../components/MvpPage";
import NewsLetter from "../components/NewsLetter";
import DeletePage from "../components/DeletePage";
import { AuthStatus } from "@clerk/nextjs/api";

 
const Home: NextPage = () => {
  
  
  return (
    <>
  <SignedIn>
<DeletePage/>
  </SignedIn>
   <SignedOut> 
   <NavBar/>
   <MvpPage/>
    <NewsLetter/></SignedOut>
    
   
    </>
  );
};

export default Home;

 
