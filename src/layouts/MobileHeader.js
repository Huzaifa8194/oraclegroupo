import Link from "next/link";
import { useState } from "react";

const MobileHeader = () => {
  const [activeMenu, setActiveMenu] = useState("");
  const activeMenuSet = (value) =>
      setActiveMenu(activeMenu === value ? "" : value),
    activeLi = (value) =>
      value === activeMenu ? { display: "block" } : { display: "none" };
  return (
    <nav className="main-menu d-block d-xl-none">
      <ul>


      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/about">Who We Are</Link>
      </li>

      <li>
        <Link href="/about">Start Mining</Link>
      </li>

      <li>
        <Link href="/">Shop</Link>
      </li>

      <li>
        <Link href="/contact">Contact Us</Link>
      </li>
     
 </ul>
    </nav>
  );
};
export default MobileHeader;
