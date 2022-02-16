//note: this is for creating backend place for putting the cart information if the user loads into account from another device or browser

import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { decrement, deleteItem, increment } from "../store/Actions";
import { DataContext } from "../store/globalState";
import { postData } from "../utils/fetchData";
import { useRouter } from "next/router";

const carts = () => {
  const [cartTotal, setCartTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const { state, dispatch } = useContext(DataContext);
  const { cart } = state;
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.quantity * item.price;
      }, 0);
      setCartTotal(total);
    };
    getTotal();
  }, [cart]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let res = await postData(
      "order",
      { address, mobile, cartTotal, cart },
      session.accessToken
    );
    console.log("res", res);
    if (res.msg == "Success! created a new Order.")
      router.push(`http://localhost:3000/orderNpayment/${res.newOrder._id}`);
  };
  return (
    <>
      <div>cart</div>
      {cart.map((item) => (
        <div key={item._id}>
          <h5>{item.title}</h5>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(increment(cart, item._id))}
          >
            +
          </span>
          {item.quantity}
          <span
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(decrement(cart, item._id))}
          >
            -
          </span>
          <span onClick={() => dispatch(deleteItem(cart, item._id))}>del</span>
        </div>
      ))}
      <div>
        <span>Total:Rs.{cartTotal}</span>
      </div>
      <div style={{ border: "1px solid black", margin: "5px" }}>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Mobile Number:</label>
            <input
              name="mobile"
              value={mobile}
              maxLength={10}
              minLength={10}
              type="text"
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          <div>
            <label>Address:</label>
            <input
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
            />
          </div>

          <button type="submit">cash on delivery</button>
        </form>
      </div>
    </>
  );
};

export default carts;
