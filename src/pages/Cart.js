import React, { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";


function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔄 Fetch cart
  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCartItems(res.data.cartItems || []);
    } catch (err) {
      console.log("Cart error:", err.response?.data || err.message);
    }
  };



  // 🔄 Update Quantity (SAFE + STOCK CHECK)
  const updateQty = async (item, newQty) => {
    if (newQty < 1) return;

    // ✅ Stock check (frontend safety)
    if (item.Product && newQty > item.Product.stock) {
      toast.error("Stock limit reached 🚫");
      return;
    }

    try {
      await API.put(`/cart/${item.id}`, { quantity: newQty });
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, quantity: newQty } : i
        )
      );
    } catch (err) {
      toast.error("Update failed ❌");
      console.log(err);
    }
  };

  // 🗑️ Delete item
  const deleteItem = async (id) => {
    const t = toast.loading("Removing item...");
    try {
      await API.delete(`/cart/${id}`);
      toast.success("Item removed 🗑️", { id: t });

      setCartItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.log(err);
      toast.error("Delete failed ❌", { id: t });
    }
  };

  // 🛒 Place Order
  const placeOrder = async () => {
    if (loading) return;
    setLoading(true);

    const toastId = toast.loading("Placing order...");

    try {
      await API.post("/orders");

      toast.success("Order placed successfully", { id: toastId });
      setCartItems([]); // ✅ clear UI instantly
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Order failed ❌",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  // 💰 Total
  const total = cartItems.reduce((sum, item) => {
    if (!item.Product) return sum;
    return sum + item.quantity * item.Product.price;
  }, 0);

  return (
    <div>
      {/* 🧾 Title */}
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        🛒 Your Cart
      </h2>

      {/* ❌ Empty */}
      {cartItems.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">
          No items in cart
        </p>
      ) : (
        <div className="space-y-4">

          {/* 📦 Items */}
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex justify-between items-center"
            >
              {/* LEFT */}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {item.Product?.name}
                </h3>

                <p className="text-gray-600 dark:text-gray-300">
                  ₹{item.Product?.price}
                </p>

                {/* 🔥 Stock info */}
                <p className="text-xs text-gray-400">
                  Stock: {item.Product?.stock}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-4">

                {/* 🔢 Quantity */}
                <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">

                  {/* MINUS */}
                  <button
                    onClick={() => updateQty(item, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className={`px-3 py-1 text-lg font-bold transition-all
                      ${item.quantity <= 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                  >
                    −
                  </button>

                  {/* VALUE */}
                  <span className="px-4 py-1 font-semibold text-gray-900 dark:text-white">
                    {item.quantity}
                  </span>

                  {/* PLUS */}
                  <button
                    onClick={() => updateQty(item, item.quantity + 1)}
                    disabled={
                      item.Product &&
                      item.quantity >= item.Product.stock
                    }
                    className={`px-3 py-1 text-lg font-bold transition-all
                      ${item.Product &&
                        item.quantity >= item.Product.stock
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                  >
                    +
                  </button>
                </div>

                {/* 🗑️ DELETE */}
                <button
                  onClick={() => deleteItem(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

          {/* 💰 TOTAL */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Total: ₹{total}
            </h3>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-all"
            >
              {loading ? "Placing..." : "Place Order"}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default Cart;