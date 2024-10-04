import { useRouter } from "next/router";
import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import axios from "axios";
import Spinner from "./Spinner";

const ProductForm = ({
  _id,
  title: currentTitle,
  description: currentDescription,
  price: currentPrice,
  images: currentImages,
}) => {
  const [title, setTitle] = useState(currentTitle || "");
  const [description, setDescription] = useState(currentDescription || "");
  const [price, setPrice] = useState(currentPrice || "");
  const [images, setImages] = useState(currentImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, description, price, images };

    if (_id) {
      //update
      await axios.put("/api/products/", { ...data, _id });
    } else {
      //create
      const res = await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  };

  if (goToProducts) {
    router.push("/products");
  }

  const uploadImages = async (ev) => {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();

      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  };

  const updateImagesOrder = (images) => {
    setImages(images);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name</label>
      <input
        type="text"
        placeholder="name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          className="flex flex-wrap"
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className="h-24 flex items-center">
                <img src={link} alt="product-img" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24">
            <Spinner />
          </div>
        )}
        <label className="cursor-pointer h-24 w-24 text-center flex flex-col items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input type="file" className="hidden" onChange={uploadImages} />
        </label>
      </div>

      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label>
        Price <span>(in USD)</span>
      </label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
};

export default ProductForm;
