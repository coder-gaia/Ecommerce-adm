import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  };

  const saveCategory = async (ev) => {
    ev.preventDefault();

    const data = {
      name,
      parentCategory,
      properties: properties.map((property) => ({
        name: property.name,
        values: property.values.split(","),
      })),
    };

    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories/", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    getCategories();
  };

  const editCategory = (category) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  };

  const deleteCategory = (category) => {
    swal
      .fire({
        title: `Are you sure?`,
        text: `Do you wanna delete "${category.name}"?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, delete",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        const { _id } = category;
        if (result.isConfirmed) {
          await axios.delete("/api/categories?_id=" + _id);
          getCategories();
        }
      });
  };

  const addProperty = () => {
    setProperties((prev) => {
      return [
        ...prev,
        {
          name: "",
          values: "",
        },
      ];
    });
  };

  const handlePropertyChangeName = (index, property, newName) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  };

  const handlePropertyValuesChange = (index, property, newValues) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  };

  const removeProperty = (indexToRemove) => {
    setProperties((prev) => {
      return [...prev].filter((prop, propIndex) => {
        return propIndex !== indexToRemove;
      });
    });
  };

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "Create New Category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            W
            onChange={(e) => setName(e.target.value)}
          />
          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            type="button"
            className="btn-default text-sm mb-2"
            onClick={addProperty}
          >
            Add new Property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mb-2">
                <input
                  value={property.name}
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyChangeName(index, property, ev.target.value)
                  }
                  type="text"
                  placeholder="property name (ex: color)"
                />
                <input
                  type="text"
                  className="mb-0"
                  placeholder="values (separated by comma)"
                  value={property.values}
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, property, ev.target.value)
                  }
                />
                <button
                  className="btn-default"
                  type="button"
                  onClick={() => removeProperty(index)}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-2">
          {editedCategory && (
            <button
              type="button"
              className="btn-default py-1"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-2">
          <thead>
            <tr>
              <td>Category</td>
              <td>Parent Category</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      className="btn btn-primary mr-1"
                      onClick={() => editCategory(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => deleteCategory(category)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
