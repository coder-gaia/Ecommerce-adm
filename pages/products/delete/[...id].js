import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DeleteProduct = () => {
  const router = useRouter();
  const { id } = router.query;
  const [productInfo, setproductInfo] = useState();

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((res) => {
      setproductInfo(res.data);
    });
  }, [id]);

  const goBack = () => {
    router.push("/products");
  };

  const deleteProduct = async () => {
    await axios.delete("/api/products?id=" + id);
    goBack();
  };

  return (
    <Layout>
      <h1 className="text-center">
        Are you sure you wanna delete "{productInfo?.title}" ?
      </h1>
      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={deleteProduct}>
          Yes
        </button>
        <button onClick={goBack} className="btn-default">
          No
        </button>
      </div>
    </Layout>
  );
};

export default DeleteProduct;
