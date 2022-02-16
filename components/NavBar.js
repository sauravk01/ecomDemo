import Link from "next/link";
import React, { useContext } from "react";
import { DataContext } from "../store/globalState";

const NavBar = () => {
  const { state, dispatch } = useContext(DataContext);

  const { cart } = state;

  return (
    <div style={{ width: "auto", border: "1px solid black" }}>
      <Link href="/carts" style={{ cursor: "pointer" }}>
        <a>cart {cart.length}</a>
      </Link>
    </div>
  );
};

export default NavBar;
