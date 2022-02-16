import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { deleteData, getData } from "../../../utils/fetchData";

const orders = ({ orders }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleDelete = async (order) => {
    let res = await deleteData(`order/${order._id}`, session.accessToken);
    console.log("res", res);
    router.push("http://localhost:3000/create/order");
  };
  return (
    <div>
      <div>orderNpayments</div>
      {orders.map((order) => (
        <div
          key={order._id}
          style={{ border: "1px solid black", margin: "5px" }}
        >
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDelete(order);
              }}
            >
              Delete order
            </button>

            <div
              style={{
                cursor: "pointer",
                marginBottom: "2px",
                border: "1px solid black",
              }}
            >
              <Link href={`http://localhost:3000/create/order/${order._id}`}>
                <a>{order._id}</a>
              </Link>
            </div>
            <div>Email:{order.user}</div>
            <div>Mobile:{order.mobile}</div>
            <div>Address:{order.address}</div>

            <div>
              Delivered:{order.delivered ? "Delivered" : "Not Delivered"}
            </div>
            <div>Paid:{order.paid ? "Paid" : "Not Paid"}</div>
            <div>
              <div>
                {order.products.map(({ product, total, quantity }) => (
                  <div key={product._id}>
                    <span>Title:{product.title}</span>

                    <span>
                      <div>
                        <img width="100px" src={product.images[0]} />
                      </div>
                    </span>
                    <span>
                      {product.price}*{quantity}={total}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default orders;
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
    },
  };
}
