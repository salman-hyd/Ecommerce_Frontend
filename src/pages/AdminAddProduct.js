import { useState } from "react";
import API from "../api";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

function AdminAddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Submit Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const toastId = toast.loading("Adding product...");

      // ✅ FormData for Cloudinary upload
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("description", form.description);

      if (image) {
        formData.append("image", image);
      }

      await API.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully 🎉", {
        id: toastId,
      });

      // ✅ Reset form
      setForm({
        name: "",
        price: "",
        description: "",
        stock: "",
      });

      setImage(null);

    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message || "Failed to add product ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 p-6">

        {/* Card */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">

          {/* Heading */}
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            ➕ Add Product
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 
                           bg-gray-50 dark:bg-gray-700 
                           text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 
                           bg-gray-50 dark:bg-gray-700 
                           text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                required
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 
                           bg-gray-50 dark:bg-gray-700 
                           text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="4"
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 
                           bg-gray-50 dark:bg-gray-700 
                           text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 
                           bg-gray-50 dark:bg-gray-700 
                           text-gray-900 dark:text-white"
              />
            </div>

            {/* Preview */}
            {image && (
              <div>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-xl border"
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 
                         text-white font-semibold py-3 rounded-xl
                         transition-all duration-300
                         disabled:opacity-50"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminAddProduct;