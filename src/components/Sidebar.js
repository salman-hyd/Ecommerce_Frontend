import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#1e293b",
      color: "white",
      padding: "20px"
    }}>
      <h2>Admin</h2>

      <Link to="/admin" style={link}>Dashboard</Link>
      <Link to="/admin/products" style={link}>Products</Link>
      <Link to="/admin/add-product" style={link}>Add Product</Link>
      <Link to="/admin/orders" style={link}>Orders</Link>
    </div>
  );
}

const link = {
  display: "block",
  color: "white",
  margin: "10px 0",
  textDecoration: "none"
};

export default Sidebar;