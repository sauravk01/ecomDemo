import { useSession, signIn, signOut, getSession } from "next-auth/react";
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
