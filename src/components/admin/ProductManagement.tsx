import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    setProducts(data || []);
  };

  const handleEdit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      status: product.status,
    });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editing) {
      await supabase.from("products").update(form).eq("id", editing);
    } else {
      await supabase.from("products").insert([form]);
    }
    setEditing(null);
    setForm({ name: "", price: "", stock: "", status: "active" });
    fetchProducts();
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Product Management</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2 flex-wrap">
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Name"
          className="border p-2"
          required
        />
        <input
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          placeholder="Price"
          type="number"
          className="border p-2"
          required
        />
        <input
          value={form.stock}
          onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
          placeholder="Stock"
          type="number"
          className="border p-2"
          required
        />
        <select
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          className="border p-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button type="submit" className="btn btn-primary">
          {editing ? "Update" : "Add"}
        </button>
        {editing && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setEditing(null);
              setForm({ name: "", price: "", stock: "", status: "active" });
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>{product.status}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(product.id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
