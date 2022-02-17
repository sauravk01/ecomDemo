import { useSession, signIn, signOut, getSession } from "next-auth/react";
import Link from "next/link";
const index = ({ data }) => {
  const { data: session } = useSession();
  console.log(session);
  return !session ? (
    <div>
      <p>Please login :</p>
      <button
        onClick={(e) => {
          e.preventDefault();
          signIn("google");
        }}
      >
        SignIn
      </button>
    </div>
  ) : (
    <>
      <div>
        {session.user.name}
        {session.user.email}
        {session.user.image}
        {data}
        <button
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          SignOut
        </button>
      </div>
      <div>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/create/category">
            <a>Create Category</a>
          </Link>
        </li>
        <li>
          <Link href="/create/color">
            <a>Create Color</a>
          </Link>
        </li>
        <li>
          <Link href="/create/product">
            <a>Create product</a>
          </Link>
        </li>
        <li>
          <Link href="/create/sub-category">
            <a>Create sub category</a>
          </Link>
        </li>
        <li>
          <Link href="/products">
            <a>Products</a>
          </Link>
        </li>
        <li>
          <Link href="/cart">
            <a>Cart</a>
          </Link>
        </li>
      </div>
    </>
  );
};

export default index;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
      data: session ? "data is private" : "its not",
    },
  };
}
