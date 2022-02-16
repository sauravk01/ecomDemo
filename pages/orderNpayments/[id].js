import { getSession } from "next-auth/react";
import { getData } from "../../utils/fetchData";

const orderNpayments = ({ orders }) => {
  return (
    <>
      <div>orderNpayments</div>
      {orders.map((order) => (
        <div
          key={order._id}
          style={{ border: "1px solid black", margin: "5px" }}
        >
          <div>
            <h3>{order._id}</h3>
            <div>Email:{order.user}</div>
            <div>Mobile:{order.mobile}</div>
            <div>Address:{order.address}</div>

            <div>
              Delivered:{order.delivered ? "Delivered" : "Not Delivered"}
            </div>
            <div>Paid:{order.paid ? "Paid" : "Not Paid"}</div>
            <div>
              <div>
                {/* {console.log("products", order.products)} */}

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
    </>
  );
};

export default orderNpayments;
export async function getServerSideProps(context) {
  const session = await getSession(context);
  // console.log(session);
  const { id } = context.query.id;
  console.log("id", id);
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
  return {
    props: {
      order: orders.getOrder,
    },
  };
}
