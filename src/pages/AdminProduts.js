import { useEffect, useState } from "react";
import API from "../api";
import Sidebar from "../components/Sidebar";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: "20px", flex: 1 }}>
        <h2>Products</h2>

        {products.map(p => (
          <div key={p.id} style={card}>
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <p>Stock: {p.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const card = {
  border: "1px solid #ccc",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "8px"
};

export default AdminProducts;