function Success() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful 🎉
        </h1>

        <p>Your order has been placed.</p>
      </div>
    </div>
  );
}

export default Success;