import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [listId, setListId] = useState("");
  const [newListName, setNewListName] = useState("");
  const [lists, setLists] = useState([]);

  const navigate = useNavigate();

  const fetchLists = async () => {
    const listsSnapshot = await getDocs(collection(db, "lists"));
    const listData = listsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLists(listData);
  };

  const handleCreate = async () => {
    let finalListId = listId;

    if (newListName) {
      const newListRef = doc(collection(db, "lists"));
      await setDoc(newListRef, { name: newListName });
      finalListId = newListRef.id;
    }

    await addDoc(collection(db, "tasks"), {
      name,
      description,
      listId: finalListId,
      status: "in progress",
    });

    navigate("/");
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Add a New Task</h2>
      <input
        placeholder="Task Name"
        className="w-full border p-2 mb-4 rounded"
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Task Description"
        className="w-full border p-2 mb-4 rounded"
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="w-full border p-2 mb-4 rounded"
        value={listId}
        onChange={(e) => setListId(e.target.value)}
      >
        <option value="">Select Existing List</option>
        {lists.map((list) => (
          <option key={list.id} value={list.id}>
            {list.name}
          </option>
        ))}
      </select>
      <input
        placeholder="Or create new list"
        className="w-full border p-2 mb-4 rounded"
        onChange={(e) => setNewListName(e.target.value)}
      />
      <button
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        onClick={handleCreate}
      >
        Create Task
      </button>
    </div>
  );
};

export default CreateTask;
