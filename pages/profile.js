import { getSession } from "next-auth/react";
import React from "react";
import { getData } from "../utils/fetchData";

const profile = ({ orders }) => {
  return (
    <>
      <div>
        <h3>profile</h3>
      </div>
      <div>
        {orders.map((order) => (
          <div key={order._id} style={{ border: "1px solid black" }}>
            <span>
              <h5 style={{ cursor: "pointer", border: "1px solid black" }}>
                {order._id}
              </h5>
            </span>
            <span style={{ margin: "4px" }}>
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
            <span style={{ margin: "4px" }}>
              {!order.delivered ? "X" : "Yes"}
            </span>
            <span style={{ margin: "4px" }}>{!order.paid ? "X" : "Yes"}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default profile;
export async function getServerSideProps(context) {
  const session = await getSession(context);
  // console.log(session);
  if (!session) {
    return {
      redirect: {
        destination: `http://localhost:3000`,
        permanent: false,
      },
    };
  }
  let orders = await getData("order", session.accessToken);
  return {
    props: {
      orders: orders.getOrders,
      session,
    },
  };
}
