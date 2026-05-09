import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

function ProductDetails() {

  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  /* REVIEWS */
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  /* FETCH PRODUCT */
  const fetchProduct = async () => {

    try {

      const res = await API.get(`/products/${id}`);

      setProduct(res.data);

      setReviews(res.data.Reviews || []);

    } catch (err) {

      console.log(err);

      toast.error("Failed to load product");

    }
  };

  useEffect(() => {

    fetchProduct();

  }, [id]);

  /* LOADING */
  if (!product) {

    return (
      <div className="p-6 text-center text-xl dark:text-white">
        Loading product...
      </div>
    );
  }

  /* ADD TO CART */
  const addToCart = async () => {

    const t = toast.loading("Adding to cart...");

    try {

      await API.post("/cart", {
        productId: product.id,
        quantity,
      });

      toast.success("Added to cart 🛒", {
        id: t,
      });

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Error adding to cart",
        {
          id: t,
        }
      );
    }
  };

  /* SUBMIT REVIEW */
  const submitReview = async () => {

    const t = toast.loading("Posting review...");

    try {

      const res = await API.post("/reviews", {
        productId: product.id,
        rating,
        comment,
      });

      setReviews((prev) => [
        res.data,
        ...prev,
      ]);

      setComment("");
      setRating(5);

      toast.success("Review added ⭐", {
        id: t,
      });

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Failed",
        {
          id: t,
        }
      );
    }
  };

  return (

    <div className="max-w-6xl mx-auto p-6">

      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div>

          {product.image ? (

            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-2xl shadow-lg object-cover"
            />

          ) : (

            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-300">
                No Image
              </span>
            </div>

          )}

        </div>

        {/* CONTENT */}
        <div>

          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            {product.name}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-7">
            {product.description || "No description available"}
          </p>

          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
            ₹{product.price}
          </p>

          <p
            className={`mb-6 font-semibold ${
              product.stock === 0
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {product.stock === 0
              ? "Out of Stock"
              : `${product.stock} items available`}
          </p>

          {/* QUANTITY */}
          <div className="flex items-center gap-4 mb-6">

            <button
              onClick={() =>
                setQuantity((prev) =>
                  prev > 1 ? prev - 1 : 1
                )
              }
              className="bg-gray-200 dark:bg-gray-700 dark:text-white px-4 py-2 rounded-lg"
            >
              -
            </button>

            <span className="text-xl font-bold dark:text-white">
              {quantity}
            </span>

            <button
              onClick={() =>
                setQuantity((prev) =>
                  prev < product.stock
                    ? prev + 1
                    : prev
                )
              }
              className="bg-gray-200 dark:bg-gray-700 dark:text-white px-4 py-2 rounded-lg"
            >
              +
            </button>

          </div>

          {/* ADD TO CART */}
          <button
            disabled={product.stock === 0}
            onClick={addToCart}
            className={`px-8 py-4 rounded-xl text-white font-bold text-lg transition ${
              product.stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {product.stock === 0
              ? "Out Of Stock"
              : "Add To Cart"}
          </button>

        </div>

      </div>

      {/* REVIEWS */}
      <div className="mt-16">

        <h2 className="text-3xl font-bold mb-8 dark:text-white">
          ⭐ Reviews
        </h2>

        {/* ADD REVIEW */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl mb-10">

          <div className="flex gap-4 mb-4">

            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value={5}>5 ⭐</option>
              <option value={4}>4 ⭐</option>
              <option value={3}>3 ⭐</option>
              <option value={2}>2 ⭐</option>
              <option value={1}>1 ⭐</option>
            </select>

          </div>

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            rows={4}
          />

          <button
            onClick={submitReview}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl"
          >
            Submit Review
          </button>

        </div>

        {/* REVIEW LIST */}
        {reviews.length === 0 ? (

          <p className="text-gray-500 dark:text-gray-400">
            No reviews yet
          </p>

        ) : (

          <div className="space-y-6">

            {reviews.map((review) => (

              <div
                key={review.id}
                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow"
              >

                <div className="flex items-center gap-4 mb-3">

                  <img
                    src={
                      review.User?.image ||
                      `https://ui-avatars.com/api/?name=${
                        review.User?.name || "User"
                      }`
                    }
                    alt="user"
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div>

                    <h3 className="font-bold text-lg dark:text-white">
                      {review.User?.name || "Anonymous"}
                    </h3>

                    <p className="text-yellow-500">
                      {"⭐".repeat(review.rating)}
                    </p>

                  </div>

                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-7">
                  {review.comment}
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default ProductDetails;