// import Image from "next/image";
import Navbar from "@/components/shared/navbar/Navbar";
import LeftSidebar from "@/components/shared/LeftSidebar";

export default function Home() {
  return (
    <main className="relative bg-light-850">
      <Navbar />
      <div className="flex">
        <LeftSidebar />
      </div>
    </main>
  );
}
