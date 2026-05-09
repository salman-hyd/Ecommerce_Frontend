import React, { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";

function Wishlist() {

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {

    try {

      const res = await API.get("/wishlist");

      setItems(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  const removeItem = async (id) => {

    try {

      await API.delete(`/wishlist/${id}`);

      toast.success("Removed");

      fetchWishlist();

    } catch (err) {

      console.log(err);

    }
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-8 dark:text-white">
        ❤️ Wishlist
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {items.map((item) => (

          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          >

            {item.Product?.image && (

              <img
                src={item.Product.image}
                alt=""
                className="w-full h-56 object-cover"
              />

            )}

            <div className="p-5">

              <h2 className="text-xl font-bold dark:text-white">
                {item.Product?.name}
              </h2>

              <p className="text-indigo-600 font-bold text-2xl mt-2">
                ₹{item.Product?.price}
              </p>

              <button
                onClick={() => removeItem(item.id)}
                className="w-full mt-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white"
              >
                Remove
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Wishlist;