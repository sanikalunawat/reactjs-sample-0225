import React, { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, query, where, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "../styles/Dashboard.css";
import Header from "../components/Header";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: "", description: "", list: "" });
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [uid, setUid] = useState(null);

  const predefinedLists = [
    { id: "personal", name: "Personal" },
    { id: "work", name: "Work" }
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUid(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!uid) return;

    const q = query(collection(db, "tasks"), where("userId", "==", uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(fetchedTasks);
    });

    const listsQuery = query(collection(db, "lists"), where("userId", "==", uid));
    const unsubscribeLists = onSnapshot(listsQuery, (snapshot) => {
      const fetchedLists = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLists(fetchedLists);
    });

    return () => {
      unsubscribe();
      unsubscribeLists();
    };
  }, [uid]);

  // Merge predefined lists with user-created lists, avoiding duplicates
  const allLists = [
    ...predefinedLists,
    ...lists.filter(
      (list) => !predefinedLists.some((pre) => pre.name.toLowerCase() === list.name.toLowerCase())
    ),
  ];

  const handleAddTask = async () => {
    if (!uid || !newTask.name || !newTask.description || !newTask.list) return;

    await addDoc(collection(db, "tasks"), {
      ...newTask,
      userId: uid,
      status: "in-progress",
      createdAt: new Date(),
    });

    setNewTask({ name: "", description: "", list: "" });
  };

  const handleAddList = async () => {
    if (!uid || !newListName) return;
    // Prevent adding predefined lists
    if (
      predefinedLists.some(
        (pre) => pre.name.toLowerCase() === newListName.trim().toLowerCase()
      )
    ) {
      setNewListName("");
      return;
    }
    // Prevent duplicate custom lists
    if (
      lists.some(
        (list) => list.name.toLowerCase() === newListName.trim().toLowerCase()
      )
    ) {
      setNewListName("");
      return;
    }
    await addDoc(collection(db, "lists"), {
      name: newListName.trim(),
      userId: uid,
    });
    setNewListName("");
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "done" ? "in-progress" : "done";
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { status: newStatus });
  };

  return (
    <div className="dashboard">
      <Header />

      <div className="add-task-form">
        <input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <select
          value={newTask.list}
          onChange={(e) => setNewTask({ ...newTask, list: e.target.value })}
        >
          <option value="">Select List</option>
          {allLists.map((list) => (
            <option key={list.id} value={list.name}>
              {list.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddTask} disabled={!uid}>Add Task</button>
      </div>

      <div className="add-list-form">
        <input
          type="text"
          placeholder="New List Name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <button onClick={handleAddList} disabled={!uid}>Create List</button>
      </div>

      <div className="task-lists">
        {allLists.map((list) => (
          <div key={list.id} className="task-list">
            <h3>{list.name}</h3>
            {tasks
              .filter((task) => task.list === list.name)
              .map((task) => (
                <div key={task.id} className={`task-card ${task.status}`}>
                  <h4>{task.name}</h4>
                  <p>{task.description}</p>
                  <button onClick={() => toggleTaskStatus(task.id, task.status)}>
                    Mark as {task.status === "done" ? "In Progress" : "Done"}
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;