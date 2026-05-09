import React, { useEffect, useState } from 'react';
import API from '../api';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Products() {

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {

    try {

      const res = await API.get('/products');

      setProducts(res.data);

    } catch (err) {

      console.log("Error fetching products:", err);

    }
  };

  const addToCart = async (id) => {

    const t = toast.loading("Adding to cart...");

    try {

      await API.post("/cart", {
        productId: id,
        quantity: 1
      });

      toast.success("Added to cart 🛒", {
        id: t
      });

    } catch (err) {

      console.log(err.response?.data);

      toast.error(
        err.response?.data?.message || "Error adding to cart",
        { id: t }
      );
    }
  };
  const addToWishlist = async (id) => {

  const t = toast.loading("Adding to wishlist...");

  try {

    await API.post("/wishlist", {
      productId: id
    });

    toast.success("Added to wishlist ❤️", {
      id: t
    });

  } catch (err) {

    toast.error(
      err.response?.data?.message || "Error",
      { id: t }
    );
  }
};

  /* SEARCH FILTER */
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          🛍️ Products
        </h2>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
        />

      </div>

      {/* EMPTY */}
      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 text-xl mt-20">
          No products found
        </div>
      )}

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredProducts.map((product) => (

          <div
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer hover:scale-[1.01]"
          >

            {/* PRODUCT IMAGE */}
            {product.image ? (

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover"
              />

            ) : (

              <div className="w-full h-56 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">

                <span className="text-gray-500 dark:text-gray-300">
                  No Image
                </span>

              </div>

            )}

            {/* CONTENT */}
            <div className="p-5">

              {/* PRODUCT NAME */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 min-h-[60px]">

                {product.description
                  ? product.description
                  : "No description available"}

              </p>

              {/* PRICE */}
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">
                ₹{product.price}
              </p>

              {/* STOCK */}
              <p
                className={`mb-4 font-medium ${
                  product.stock === 0
                    ? "text-red-500"
                    : "text-green-600 dark:text-green-400"
                }`}

              >
               
                {product.stock === 0
                  ? "Out of Stock"
                  : `Stock: ${product.stock}`}

              </p>

              {/* BUTTON */}
              <button
                disabled={product.stock === 0}
                onClick={(e) => {

                  e.stopPropagation();

                  addToCart(product.id);

                }}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                  product.stock === 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-indigo-500 hover:bg-indigo-600 text-white hover:scale-[1.02]"
                }`}
              >
                 


                {product.stock === 0
                  ? "Out of Stock"
                  : "Add to Cart"}

              </button>
              <button
  onClick={(e) => {

    e.stopPropagation();

    addToWishlist(product.id);

  }}
  className="w-full mb-3 py-3 rounded-xl border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white transition"
>
  ❤️ Wishlist
</button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Products;