import { useEffect, useState } from "react";
import API from "../api";
import Sidebar from "../components/Sidebar";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await API.get("/orders/all");
    setOrders(res.data.orders);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: "20px", flex: 1 }}>
        <h2>Orders</h2>

        {orders.map(order => (
          <div key={order.id} style={card}>
            <p>Order ID: {order.id}</p>
            <p>Total: ₹{order.totalAmount}</p>
            <p>User: {order.User?.email}</p>
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

export default AdminOrders;