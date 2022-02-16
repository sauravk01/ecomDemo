//this is just to refer if i create with cloudinary.Note this is not being used//

import { CLOUD_API, CLOUD_NAME, CLOUD_UPDATE_PRESET } from "./envData";

export const imageUpload = async (images) => {
  let imgArr = [];
  for (const item of images) {
    const formData = new FormData();
    formData.append("file", item);
    formData.append("upload_preset", "iclear_store");
    formData.append("cloud_name", CLOUD_NAME);

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/cloy/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    console.log(data);

    imgArr.push({ public_id: data.public_id, url: data.secure_url });
  }
  return imgArr;
};
