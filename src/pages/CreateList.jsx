import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function CreateList() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addDoc(collection(db, "lists"), {
      name: name.trim(),
    });

    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Create New List</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full border px-3 py-2 mb-4 rounded"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="List name (e.g. Personal, Work)"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
          Create List
        </button>
      </form>
    </div>
  );
}

export default CreateList;
