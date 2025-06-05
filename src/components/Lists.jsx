import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { db } from './firebase';

export default function Lists({ selectedListId, setSelectedListId }) {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'lists'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLists(listsData);
      if (!selectedListId && listsData.length > 0) setSelectedListId(listsData[0].id);
    });
    return unsubscribe;
  }, []);

  const addList = async () => {
    if (!newListName.trim()) return;
    await addDoc(collection(db, 'lists'), { name: newListName.trim() });
    setNewListName('');
  };

  const startEditing = (list) => {
    setEditingListId(list.id);
    setEditingListName(list.name);
  };

  const saveEditing = async (listId) => {
    if (!editingListName.trim()) return;
    await updateDoc(doc(db, 'lists', listId), { name: editingListName.trim() });
    setEditingListId(null);
    setEditingListName('');
  };

  const deleteList = async (listId) => {
    if (!window.confirm('Delete this list and all its tasks?')) return;
    await deleteDoc(doc(db, 'lists', listId));

  };

  return (
    <div style={{ width: 250 }}>
      <h2>Lists</h2>
      <input
        placeholder="New List"
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
      />
      <button onClick={addList}>Add List</button>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {lists.map(list => (
          <li key={list.id} style={{ marginBottom: 8, fontWeight: list.id === selectedListId ? 'bold' : 'normal' }}>
            {editingListId === list.id ? (
              <>
                <input
                  value={editingListName}
                  onChange={(e) => setEditingListName(e.target.value)}
                />
                <button onClick={() => saveEditing(list.id)}>Save</button>
                <button onClick={() => setEditingListId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedListId(list.id)}
                >
                  {list.name}
                </span>
                <button onClick={() => startEditing(list)}>Edit</button>
                <button onClick={() => deleteList(list.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
