import { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  // FILTERS
  const [search, setSearch] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // PRODUCT FORM
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: ""
  });

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // EDIT
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, statsRes, productsRes] = await Promise.all([
        API.get("/orders/admin"),
        API.get("/admin/stats"),
        API.get("/products")
      ]);

      const sorted = [...ordersRes.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sorted);
      setStats(statsRes.data);
      setProducts(productsRes.data);

      // REVENUE CHART
      const grouped = {};

      sorted.forEach((o) => {
        const date = new Date(o.createdAt).toLocaleDateString();

        if (!grouped[date]) {
          grouped[date] = {
            date,
            revenue: 0
          };
        }

        grouped[date].revenue += Number(o.totalAmount || 0);
      });

      setChartData(Object.values(grouped));

    } catch (err) {
      console.log(err);
      toast.error("Error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status } : o
        )
      );

      toast.success("Order updated");

    } catch (err) {
      console.log(err);
      toast.error("Failed to update");
    }
  };

  // ADD PRODUCT
  const addProduct = async () => {
    if (uploading) return;

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("stock", newProduct.stock);
      formData.append("description", newProduct.description);

      if (image) {
        formData.append("image", image);
      }

      await API.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Product added");

      setNewProduct({
        name: "",
        price: "",
        stock: "",
        description: ""
      });

      setImage(null);

      fetchData();

    } catch (err) {
      console.log(err);
      toast.error("Failed to add product");
    } finally {
      setUploading(false);
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);

      setProducts((prev) =>
        prev.filter((p) => p.id !== id)
      );

      toast.success("Product deleted");

    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  // START EDIT
  const startEdit = (product) => {
    setEditingProduct(product);

    setNewProduct({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || ""
    });
  };

  // UPDATE PRODUCT
  const updateProduct = async () => {
    try {
      const formData = new FormData();

      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("stock", newProduct.stock);
      formData.append("description", newProduct.description);

      if (image) {
        formData.append("image", image);
      }

      await API.put(
        `/products/${editingProduct.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      toast.success("Product updated");

      setEditingProduct(null);

      setNewProduct({
        name: "",
        price: "",
        stock: "",
        description: ""
      });

      setImage(null);

      fetchData();

    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  // FILTER ORDERS
  const filteredOrders = orders.filter((o) => {
    const text = search.toLowerCase();

    const matchSearch =
      o.id?.toString().includes(text) ||
      o.User?.name?.toLowerCase().includes(text) ||
      o.User?.email?.toLowerCase().includes(text);

    const amount = Number(o.totalAmount || 0);

    const matchMin =
      minAmount ? amount >= Number(minAmount) : true;

    const matchMax =
      maxAmount ? amount <= Number(maxAmount) : true;

    return matchSearch && matchMin && matchMax;
  });

  // PIE CHART
  const statusData = [
    {
      name: "Pending",
      value: orders.filter((o) => o.status === "pending").length
    },
    {
      name: "Shipped",
      value: orders.filter((o) => o.status === "shipped").length
    },
    {
      name: "Delivered",
      value: orders.filter((o) => o.status === "delivered").length
    }
  ];

  // LOW STOCK
  const lowStockProducts = products.filter(
    (p) => p.stock < 5
  );

  if (loading) {
    return (
      <div className="p-10 text-center text-xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-900 dark:text-white">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-8">
        📊 Admin Dashboard
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card
          title="Users"
          value={stats.totalUsers || 0}
        />

        <Card
          title="Products"
          value={stats.totalProducts || 0}
        />

        <Card
          title="Orders"
          value={stats.totalOrders || 0}
        />

        <Card
          title="Revenue"
          value={`₹${stats.revenue || 0}`}
        />
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">

        {/* REVENUE */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">

          <h2 className="text-2xl font-bold mb-5">
            📈 Revenue Analytics
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ORDER STATUS */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">

          <h2 className="text-2xl font-bold mb-5">
            📦 Order Status
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                outerRadius={100}
                label
              >
                <Cell fill="#facc15" />
                <Cell fill="#3b82f6" />
                <Cell fill="#22c55e" />
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LOW STOCK */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow mb-8">

        <h2 className="text-2xl font-bold mb-5">
          ⚠️ Low Stock Products
        </h2>

        {lowStockProducts.length === 0 ? (
          <p>No low stock products</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lowStockProducts}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="stock" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* PRODUCT FORM */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-8">

        <h2 className="text-2xl font-bold mb-6">
          {editingProduct
            ? "✏️ Edit Product"
            : "➕ Add Product"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                name: e.target.value
              })
            }
            className="p-3 rounded bg-gray-100 dark:bg-gray-700"
          />

          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: e.target.value
              })
            }
            className="p-3 rounded bg-gray-100 dark:bg-gray-700"
          />

          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                stock: e.target.value
              })
            }
            className="p-3 rounded bg-gray-100 dark:bg-gray-700"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
            className="p-3 rounded bg-gray-100 dark:bg-gray-700"
          />
        </div>

        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              description: e.target.value
            })
          }
          className="w-full mt-4 p-3 rounded bg-gray-100 dark:bg-gray-700"
          rows={4}
        />

        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="w-40 h-40 object-cover rounded-xl mt-4"
          />
        )}

        <div className="flex gap-4 mt-5">

          {editingProduct ? (
            <>
              <button
                onClick={updateProduct}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl"
              >
                Update Product
              </button>

              <button
                onClick={() => {
                  setEditingProduct(null);

                  setNewProduct({
                    name: "",
                    price: "",
                    stock: "",
                    description: ""
                  });

                  setImage(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={addProduct}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl"
            >
              {uploading
                ? "Uploading..."
                : "Add Product"}
            </button>
          )}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-8">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            📦 Products
          </h2>

          <span>Total: {products.length}</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {products.map((p) => (
            <div
              key={p.id}
              className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden shadow"
            >

              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                  No Image
                </div>
              )}

              <div className="p-5">

                <h3 className="text-xl font-bold mb-2">
                  {p.name}
                </h3>

                <p className="text-sm mb-3">
                  {p.description}
                </p>

                <p className="text-2xl font-bold text-indigo-500 mb-3">
                  ₹{p.price}
                </p>

                <p
                  className={`font-semibold mb-4 ${
                    p.stock === 0
                      ? "text-red-500"
                      : p.stock < 5
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  Stock: {p.stock}
                </p>

                <div className="flex gap-3">

                  <button
                    onClick={() => startEdit(p)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
                  >
                    Delete
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ORDERS */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">

        <h2 className="text-2xl font-bold mb-6">
          📦 Orders
        </h2>

        {/* FILTERS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">

          <input
            type="text"
            placeholder="Search order/user/email"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="p-3 rounded bg-gray-100 dark:bg-gray-700"
          />

          <input
            type="number"
            placeholder="Min Amount"
            value={minAmount}
            onChange={(e) =>
              setMinAmount(e.target.value)
            }
            className="p-3 rounded bg-gray-100 dark:bg-gray-700"
          />

          <input
            type="number"
            placeholder="Max Amount"
            value={maxAmount}
            onChange={(e) =>
              setMaxAmount(e.target.value)
            }
            className="p-3 rounded bg-gray-100 dark:bg-gray-700"
          />
        </div>

        {filteredOrders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border-b border-gray-300 dark:border-gray-700 py-4"
            >

              <div className="flex flex-col md:flex-row md:justify-between gap-3">

                <div>
                  <p className="font-bold">
                    Order #{order.id}
                  </p>

                  <p>
                    User: {order.User?.name}
                  </p>

                  <p>
                    Email: {order.User?.email}
                  </p>

                  <p>
                    Amount: ₹{order.totalAmount}
                  </p>
                </div>

                <div>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(
                        order.id,
                        e.target.value
                      )
                    }
                    className="p-2 rounded bg-gray-100 dark:bg-gray-700"
                  >
                    <option value="pending">
                      pending
                    </option>

                    <option value="shipped">
                      shipped
                    </option>

                    <option value="delivered">
                      delivered
                    </option>
                  </select>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// CARD
function Card({ title, value }) {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl shadow-lg">
      <p className="text-lg">{title}</p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}

export default AdminDashboard;