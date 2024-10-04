import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

const Categories = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const saveCategory = async (ev) => {
    ev.preventDefault();
    await axios.post("/api/categories/", { name });
    setName("");
  };

  return (
    <Layout>
      <h1>Categories</h1>
      <label>New category name</label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Category name"
            className="mb-0"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="btn btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>Category</td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr>
                <td>{category.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Categories;
