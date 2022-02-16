import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { deleteData, getData, postData, putData } from "../../utils/fetchData";

const category = () => {
  const [categories, setCategories] = useState([]);
  const [id, setId] = useState("");
  const { data: session } = useSession();
  //   console.log(session.accessToken);
  const [title, setTitle] = useState("category1");

  // loading categories
  useEffect(async () => {
    let res = await getData("categories", session.accessToken);
    setCategories(res.categories);
  }, [title]);

  //category submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (id) {
      res = await putData(`categories/${id}`, { title }, session.token);
      console.log(res);
    } else {
      res = await postData("categories", { title }, session.token);
      console.log(res);
    }
    setTitle("");
    setId("");
  };

  //handle delete for single category
  const handleDeleteCategory = async (c) => {
    let id = c._id;
    let res = await deleteData(`categories/${id}`, session.accessToken);
    console.log(res);
    setTitle("");
  };

  //handle edit for single category
  const handleEditCategory = (catogory) => {
    setId(catogory._id);
    setTitle(catogory.title);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Category:</label>
        <input
          type="text"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">{id ? "Update" : "Create"}</button>
      </form>
      {!categories ? (
        <h4>Loading...</h4>
      ) : (
        categories.map((c) => (
          <div key={c._id}>
            {c.title}

            <button onClick={(e) => handleDeleteCategory(c)}>delete</button>
            <button onClick={(e) => handleEditCategory(c)}>edit</button>
          </div>
        ))
        // "hiii"
      )}
    </>
  );
};

export default category;
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: `http://localhost:3000`,
        permanent: false,
      },
    };
  }
  //   let categories = getData("categories", session.accessToken);
  return {
    props: {
      session,
      //   categories: categories,
    },
  };
}
