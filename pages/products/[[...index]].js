import { getSession, useSession } from "next-auth/react";
import { useContext, useEffect, useMemo, useState } from "react";
import Filter from "../../components/Filter";
import NavBar from "../../components/NavBar";
import { addToCart } from "../../store/Actions";
import { DataContext } from "../../store/globalState";
import { getData } from "../../utils/fetchData";
import { useRouter } from "next/router";
import LoadMore from "../../components/LoadMore";
import { sum } from "lodash";
import filterSearch from "../../utils/filterSearch";
import { getProducts } from "../../utils/getItems";

const products = () => {
  const router = useRouter();
  const { query } = router;
  const [selectedProducts, setSelectedProducts] = useState([]);
  // console.log("router", router);
  const [search, setSearch] = useState("");
  const { state, dispatch } = useContext(DataContext);
  const { cart, notify } = state;
  const [page, setPage] = useState(1);
  let products;
  useEffect(async () => {
    products = await getProducts("product", page);
    console.log(products);
    setSelectedProducts([...selectedProducts, ...products.products]);
    setPage(products.page + 1);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    // console.log("search", search);
    products = await getProducts(`product/?title=${search}`);
    // console.log(products);
    if (products.lenght == 0) {
      setSelectedProducts([]);
    } else {
      if (products.page == 1) {
        setSelectedProducts([...products.products]);
      }
      if (products.page > 1) {
        console.log("productsPage", products.page);
        setSelectedProducts([...selectedProducts, ...products.products]);
        setPage(products.page);
      }
    }
  };

  const LoadMore = async (e) => {
    e.preventDefault();
    console.log(page);
    products = await getProducts(`product/?title=${search}`, page);
    setSelectedProducts([...selectedProducts, ...products.products]);

    setPage(products.page + 1);
  };
  console.log("products", selectedProducts);

  return (
    <>
      <NavBar />
      <Filter
        search={search}
        setSearch={setSearch}
        // handleKeyPress={handleKeyPress}
        handleSearch={handleSearch}
      />
      {/* {!notify ? "no notification" : notify.error} */}
      <div>Products</div>
      <div>
        {selectedProducts.length == 0
          ? "No products found"
          : selectedProducts.map((product) => (
              <div
                key={product._id}
                style={{
                  width: "150px",
                  border: "1px solid black",
                  margin: "5px",
                }}
              >
                <div>{product.title}</div>
                <div
                  style={{
                    width: "150px",
                    border: "1px solid black",
                  }}
                >
                  <span
                    style={{ width: "100px", margin: "5px", cursor: "pointer" }}
                    onClick={() => dispatch(addToCart(product, cart))}
                  >
                    add to cart
                  </span>
                  <span style={{ cursor: "pointer" }}>WL</span>
                </div>
              </div>
            ))}
      </div>
      <button onClick={LoadMore}>Load More</button>
    </>
  );
};

export default products;
// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//   const { params } = context.query;
//   if (!session) {
//     return {
//       redirect: {
//         destination: `http://localhost:3000`,
//         permanent: false,
//       },
//     };
//   }
//   let products;
//   if (params) {
//     products = await getData(`product/${params}`);
//   } else {
//     products = await getData(`product`);
//   }
//   return {
//     props: {
//       products: products.products,
//     },
//   };
// }
