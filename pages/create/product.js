import { getSession, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import SelectOption from "../../components/SelectOption";
import { deleteData, getData, postData, putData } from "../../utils/fetchData";
const initialState = {
  title: "item0",
  description:
    "jnjsadnjnsadjnjdsnjasdnjsanldsnlnsdsalnlsnladsnsllds ndslan lsndlndsalnasdl nlsn lan lnjas njn",
  price: 1000,
  quantity: 100,
  // color: [],
  featuredProduct: false,
  // size: 0,
  category: {},
  subCategory: {},
  featuredProduct: "No",
};

const product = ({ categories, subcategories, allTags }) => {
  const { data: session } = useSession();

  const [product, setProduct] = useState(initialState);
  const [tags, setTags] = useState([]);
  const [tagsA, setTagA] = useState(allTags);
  const [products, setProducts] = useState([]);
  const [id, setId] = useState("");
  const [images, setImages] = useState([]);
  //useref to clear the value of files used in submit function and input file
  const ref = useRef();
  const {
    title,
    price,
    description,
    quantity,
    color,
    // size,
    category,
    subCategory,
    featuredProduct,
  } = product;
  console.log("tags", tags);
  useEffect(async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    await getProducts(signal);

    return () => controller.abort();
  }, [product]);
  const getProducts = async (signal) =>
    await getData("product", session.accessToken, signal)
      .then((res) => {
        console.log("res", res);
        console.log("products", res.products);
        setProducts(res.products);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("fetch aborted");
        } else {
          console.log(err);
        }
      });

  //for most items of product
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };
  //product delete and edit
  const handleDelete = async (product) => {
    id = product._id;
    console.log(id);
    let res = await deleteData(`product/${id}`, session.accessToken);
    console.log(res);
  };
  const handleEdit = async (product) => {
    setProduct({
      category: product.category._id,
      subCategory: product.subCategory._id,
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      featuredProduct: product.featuredProduct,
    });
    setId(product._id);
    let restTags = allTags.filter(
      (pTag) => !product.tags.some((tags) => tags._id == pTag._id)
    );
    setTags(product.tags);
    setTagA(restTags);

    console.log("Edittags", restTags);
    console.log("alltags", product.tags);
    // setTagA()
  };
  console.log("tags", tags);

  //....---xx***xx---....//

  // tag sections changing and deleting-------

  const handleChangeTag = (e) => {
    const { value } = e.target;
    //comparing the every tag and filtering out the same id value in object
    let newValue = tagsA.filter((t) => t._id == value);
    // finding whether tags are already in the array or not

    if (tags.some((tag) => tag._id == newValue[0]._id)) {
      console.log(`Given tag is already selected.`);
    } else {
      //inserting in the state
      setTags([...tags, newValue[0]]);
      //removing the values from select
      setTagA(tagsA.filter((t) => t != newValue[0]));
    }
  };
  //   console.log(tags);
  const handleTagDelete = (tag) => {
    // remove tags from input (state tags)
    let tagsR = tags.filter((t) => t != tag);

    setTags([...tagsR]);
    //adding tags value back to select array
    setTagA([...tagsA, tag]);
  };
  let tagItems = tags.map((tag) => tag._id);
  useEffect(() => setProduct({ ...product, tags: tagItems }), [tags]);

  //----------------------------//-------------//-------//

  //images///
  //images input file and delete
  const handleUploadInput = (e) => {
    let newImages = [];
    let num = 0;
    const files = [...e.target.files];

    if (files.length === 0) return console.log("Files does not exist.");

    files.forEach((file) => {
      if (file.size > 1024 * 1024)
        return console.log("The largest image size is 1mb");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return console.log("Image format is incorrect.");

      num += 1;
      if (num <= 5) newImages.push(file);
      return newImages;
    });

    const imgCount = images.length;
    if (imgCount + newImages.length > 5)
      return console.log("Select up to 5 images.");

    setImages([...images, ...newImages]);
  };

  const deleteImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };
  //+++++++++//
  //----------------------//-------------//--------//
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(product);
    const formData = new FormData();
    // putting each images from images state in form within images
    for (const file of images) {
      formData.append(`images`, file);
    }
    // putting each tag from tags state in form within tags
    for (const tag of product.tags) {
      formData.append(`tags`, tag);
    }

    formData.append("category", product.category);
    formData.append("subCategory", product.subCategory);
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("inStock", product.quantity);
    formData.append("featuredProduct", product.featuredProduct);

    console.log("form data tags", formData.get("tags"));
    console.log("form data images", formData.get("images"));
    let res;
    if (id) {
      formData.append("id", id);
      res = await putData(`product/${id}`, formData, session.accessToken);
      console.log("res", res);
    } else {
      res = await postData("product", formData, session.accessToken);
      console.log("res", res);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h4>product page</h4>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            name="price"
            value={price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            name="description"
            value={description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            name="quantity"
            value={quantity}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="color">color</label>
          <input
            id="color"
            type="text"
            name="color"
            value={color}
            onChange={handleChange}
          />
        </div>
        {/* <div>
          <label htmlFor="size">Size</label>
          <select id="size" name="size" value={size} onChange={handleChange}>
            <option value="all">select</option>
            {others.sizes.map((size) => (
              <option key={size.toString()}>{size}</option>
            ))}
          </select>
        </div> */}
        <div>
          <label htmlFor="category">category</label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={handleChange}
          >
            <option value="all">select</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sub-category">sub-category</label>
          <select
            id="sub-category"
            name="subCategory"
            value={subCategory}
            onChange={handleChange}
          >
            <option value="all">select</option>
            {subcategories.map((subCategory) => (
              <option key={subCategory._id} value={subCategory._id}>
                {subCategory.title}
              </option>
            ))}
          </select>
        </div>
        <SelectOption
          tags={tags}
          tagsA={tagsA}
          setTags={setTags}
          setTagA={setTagA}
          handleChangeTag={handleChangeTag}
          handleTagDelete={handleTagDelete}
        />
        <div>
          <label>Check to feature the product:</label>
          <input
            type="checkbox"
            id="featuredProduct"
            name="featuredProduct"
            value="Yes"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Color Image:</label>
          <input type="file" multiple onChange={handleUploadInput} ref={ref} />
        </div>
        <div>
          {images &&
            images.map((img, index) => (
              <div key={index}>
                <img
                  key={index}
                  style={{ width: "100px" }}
                  src={img.url ? img.url : URL.createObjectURL(img)}
                  alt=""
                />

                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteImage(index)}
                >
                  X
                </span>
              </div>
            ))}
        </div>
        <button type="submit">{id ? "Update" : "Create"}</button>
      </form>
      <br />
      {!products
        ? "Loading..."
        : //  "loaded..."
          products.map((product) => (
            <div key={product._id}>
              {product.title}
              <button onClick={(e) => handleEdit(product)}>Edit</button>
              <button onClick={(e) => handleDelete(product)}>Delete</button>
            </div>
          ))}
    </>
  );
};

export default product;

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
  let subcategories = await getData("sub-categories", session.accessToken);
  let categories = await getData("categories", session.accessToken);
  let allTags = await getData("tag", session.accessToken);
  console.log(categories.data);

  return {
    props: {
      session,
      categories: categories.categories,
      subcategories: subcategories.data,
      allTags: allTags.tags,
    },
  };
}
