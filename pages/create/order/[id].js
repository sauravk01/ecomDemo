import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { deleteData, getData, patchData } from "../../../utils/fetchData";

const editOrder = ({ order }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  console.log("pid", id);

  const handleUpdate = async (e) => {
    e.preventDefault();
    let res;
    console.log("handle clicked", e.target.value);
    if (e.target.value) {
      res = await patchData(`order/${id}`, order._id, session.accessToken);
      console.log("updated res", res);
    }
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    let res = await deleteData(`order/${id}`, session.accessToken);
    console.log("res", res);
    router.push("http://localhost:3000/create/order");
  };
  return (
    <>
      <div>{id}</div>
      <div>
        <div>{order.user}</div>
        <button onClick={handleDelete}>Delete order</button>
      </div>
      <div>{order.address}</div>
      <div>{order.mobile}</div>
      {order.method && <div>{order.method}</div>}
      <div>
        Delivered:
        <select
          defaultValue={order.delivered || "false"}
          onChange={handleUpdate}
        >
          <option value="false">Not Delivered</option>
          <option value="true">Delivered</option>
        </select>
      </div>
      <div>Paid:{order.paid ? "Paid" : "Not Paid"}</div>
      <div>
        {order.products.map(({ product, total, quantity }) => (
          <div key={product._id}>
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
          </div>
        ))}
      </div>
    </>
  );
};

export default editOrder;
export async function getServerSideProps(context) {
  const session = await getSession(context);
  const id = context.query.id;
  if (!session) {
    return {
      redirect: {
        destination: `http://localhost:3000`,
        permanent: false,
      },
    };
  }
  let orders = await getData(`order/${id}`, session.accessToken).catch(
    (error) => {
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
    }
  );
  console.log("order", orders);
  return {
    props: {
      order: orders.getOrder,
    },
  };
}
