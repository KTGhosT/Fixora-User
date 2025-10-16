function Cart({ cart, removeFromCart }) {
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price (Rs)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(index)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Total: Rs. {total}</h4>
        </>
      )}
    </div>
  );
}
export default Cart;
