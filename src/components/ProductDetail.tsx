import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();
      setProduct(data);
    };
    fetchProduct();
  }, [productId]);

  const addToCart = () => {
    if (quantity > product.stock) {
      setError("Not enough stock available.");
      return;
    }
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ ...product, quantity });
    localStorage.setItem("cart", JSON.stringify(cart));
    setError("");
  };

  if (!product) return <div>Loading...</div>;
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">{product.name}</h2>
      <div>Price: ${product.price}</div>
      <div>Stock: {product.stock}</div>
      <input
        type="number"
        min="1"
        max={product.stock}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="border p-2 my-2"
      />
      <button className="btn btn-primary" onClick={addToCart}>
        Add to Cart
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}
