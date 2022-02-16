import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Color() {
  const [title, setTitle] = useState("");
  //to display the image in the browser with the help of filereader
  const [image, setImage] = useState(null);
  const [imageInput, setImageInput] = useState(null);
  const [id, setId] = useState("");
  const [colors, setColors] = useState([]);

  //useref to clear the value of files used in submit function and input file
  const ref = useRef();

  useEffect(async () => {
    let res = await axios.get("http://localhost:3000/api/color");
    setColors(res.data.getColors);
  }, [title]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    //collecting file in the state to sent backend which is quick then data
    setImageInput(file);
    console.log("file", file);
    //file reader= to get the raw image which can be shown in the browser
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      // console.log(e.target.result);
      //when filereader gets the file from the form, it sents to image state to display
      setImage(e.target.result);
    };
    fileReader.readAsDataURL(file);
  };
  // deleting color item from the list of color
  const handleColorDelete = async (img) => {
    let res = await axios.delete(`http://localhost:3000/api/color/${img._id}`);
    console.log(res);
    // just to reload the content
    setTitle("reload");
    setTitle("");
  };
  console.log(id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //creating formdata where the property and value are defined which will be added with the help of append
    const form = new FormData();
    form.append("title", title);
    form.append("image", imageInput);
    console.log("formData", form.get("image"));
    if (id) {
      form.append("id", id);
      const res = await axios.put(
        `http://localhost:3000/api/color/${id}`,
        form
      );
      console.log(res.data);
    } else {
      const res = await axios.post("http://localhost:3000/api/color", form);
      console.log(res.data);
    }
    ref.current.value = "";
    setTitle("");
    setImage(null);
    setImageInput(null);
  };
  //handle edit for single color
  const handleEditColor = (color) => {
    setId(color._id);
    setTitle(color.title);
  };
  return (
    <>
      <div>Create Color Page</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the new color title"
          />
        </div>
        <div>
          <label>Color Image:</label>
          <input type="file" onChange={handleImage} ref={ref} />
        </div>
        <div>{image && <img src={image} style={{ width: "100px" }} />}</div>
        <button type="submit">{id ? "Update" : "create"}</button>
      </form>
      {colors &&
        colors.map((cImg) => (
          <div key={cImg._id}>
            <div>
              {cImg.title}
              <button onClick={() => handleEditColor(cImg)}>edit</button>
              <button onClick={() => handleColorDelete(cImg)}>Delete</button>
            </div>
          </div>
        ))}
    </>
  );
}
