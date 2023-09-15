import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
 
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import NavBar from "../components/NavBar";
import MvpPage from "../components/MvpPage";
import NewsLetter from "../components/NewsLetter";

 
const Home: NextPage = () => {
  
  
  return (
    <>
  
   <NavBar/>
   <MvpPage/>
    <NewsLetter/>
   
    </>
  );
};

export default Home;

 
