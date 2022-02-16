import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { deleteData, getData, postData, putData } from "../../utils/fetchData";

const tag = () => {
  const [tags, setTags] = useState([]);
  const [id, setId] = useState("");
  const { data: session } = useSession();
  //   console.log(session.accessToken);
  const [title, setTitle] = useState("tag");

  // loading tags
  useEffect(async () => {
    let res = await getData("tag", session.accessToken);
    setTags(res.tags);
  }, [title]);
  //Tag submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (id) {
      res = await putData(`tag/${id}`, { title }, session.token);
      console.log(res);
    } else {
      res = await postData("tag", { title }, session.token);
      console.log(res);
    }
    setTitle("");
    setId("");
  };

  //handle delete for single Tag
  const handleDeleteTag = async (c) => {
    let id = c._id;
    let res = await deleteData(`tag/${id}`, session.accessToken);
    console.log(res);
    setTitle(" ");
    setTitle("");
  };

  //handle edit for single Tag
  const handleEditTag = (catogory) => {
    setId(catogory._id);
    setTitle(catogory.title);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Tag:</label>
        <input
          type="text"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">{id ? "Update" : "Create"}</button>
      </form>
      {!tags ? (
        <h4>Loading...</h4>
      ) : (
        tags.map((c) => (
          <div key={c._id}>
            {c.title}

            <button onClick={(e) => handleDeleteTag(c)}>delete</button>
            <button onClick={(e) => handleEditTag(c)}>edit</button>
          </div>
        ))
        // "hiii"
      )}
    </>
  );
};

export default tag;
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
  //   let tags = getData("tags", session.accessToken);
  return {
    props: {
      session,
      //   tags: tags,
    },
  };
}
