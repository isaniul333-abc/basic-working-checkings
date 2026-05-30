import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://jsonplaceholder.typicode.com/users";

export default function App() {
  // =================================================================
  // 1. STATES SECTION (স্টেটসমূহ)
  // =================================================================
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editMethod, setEditMethod] = useState(null); 

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
  });


  // =================================================================
  // 2. HELPER FUNCTIONS (সহায়ক ফাংশনসমূহ)
  // =================================================================
  // ফরম ক্লিয়ার করার ফাংশন
  const resetForm = () => {
    setFormData({ name: "", username: "", email: "", phone: "", website: "" });
    setEditingUserId(null);
    setEditMethod(null);
  };

  // এডিট মোড শুরু করার ফাংশন
  const startEdit = (user, method) => {
    setEditingUserId(user.id);
    setEditMethod(method);
    
    if (method === "PATCH") {
      setFormData({
        name: user.name,
        username: "",
        email: "",
        phone: "",
        website: "",
      });
    } else {
      setFormData({
        name: user.name,
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        website: user.website || "",
      });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  // =================================================================
  // 3. API METHODS SECTION (GET, POST, PUT, PATCH, DELETE)
  // =================================================================
  
  // --- [PART: GET - Fetch Users] ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- [PART: POST - Create User] ---
  const handleCreate = async () => {
    if (!formData.name || !formData.username || !formData.email) {
      alert("Please fill required fields (Name, Username, Email)");
      return;
    }
    try {
      const res = await axios.post(API, formData);
      setUsers([{ ...res.data, id: Date.now() }, ...users]);
      resetForm();
      alert("🟢 User Created Successfully (POST Success)");
    } catch (error) {
      console.log(error);
    }
  };

  // --- [PART: PUT - Full Update] ---
  const handlePutUpdate = async () => {
    if (!formData.name || !formData.username || !formData.email) {
      alert("PUT requires all mandatory fields to be filled!");
      return;
    }
    try {
      const targetId = editingUserId > 10 ? 1 : editingUserId;
      const res = await axios.put(`${API}/${targetId}`, {
        id: editingUserId,
        ...formData,
      });
      setUsers(users.map((user) => (user.id === editingUserId ? { ...res.data, id: editingUserId } : user)));
      resetForm();
      alert("🟡 Whole User Replaced Successfully (PUT Success)");
    } catch (error) {
      console.log(error);
    }
  };

  // --- [PART: PATCH - Partial Update] ---
  const handlePatchUpdate = async () => {
    if (!formData.name) {
      alert("Please enter a name to patch!");
      return;
    }
    try {
      const targetId = editingUserId > 10 ? 1 : editingUserId;
      const res = await axios.patch(`${API}/${targetId}`, { name: formData.name });
      setUsers(users.map((user) => user.id === editingUserId ? { ...user, name: res.data.name } : user));
      resetForm();
      alert("🟣 User Name Patched Successfully (PATCH Success)");
    } catch (error) {
      console.log(error);
    }
  };

  // --- [PART: DELETE - Remove User] ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const targetId = id > 10 ? 1 : id;
      await axios.delete(`${API}/${targetId}`);
      setUsers(users.filter((user) => user.id !== id));
      alert("🔴 User Deleted Successfully");
    } catch (error) {
      console.log(error);
    }
  };


  // =================================================================
  // 4. RENDERING SECTION (UI / JSX)
  // =================================================================
  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-100 to-blue-50 p-4 md:p-8 font-sans antialiased">
      
      {/* --- [UI PART: HEADER] --- */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          User Management Dashboard
        </h1>
        <p className="text-slate-500 font-medium max-w-md mx-auto">
          Manage system users, test HTTP REST methods (GET, POST, PUT, PATCH, DELETE) seamlessly.
        </p>
      </div>

      {/* --- [UI PART: DYNAMIC FORM] --- */}
      <div className={`max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl border shadow-xl p-6 md:p-8 mb-12 transition-all duration-500 ${
        editMethod === 'PUT' ? 'border-amber-400 ring-2 ring-amber-400/20' : 
        editMethod === 'PATCH' ? 'border-indigo-400 ring-2 ring-indigo-400/20' : 'border-slate-200/60'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl font-bold text-white ${
              editMethod === 'PUT' ? 'bg-amber-500' : editMethod === 'PATCH' ? 'bg-indigo-500' : 'bg-blue-600'
            }`}>
              {editMethod === 'PUT' ? '📝' : editMethod === 'PATCH' ? '🛠️' : '➕'}
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              {editMethod === 'PUT' ? 'Edit User (PUT Mode - Complete Update)' : 
               editMethod === 'PATCH' ? 'Patch User (PATCH Mode - Partial Update)' : 'Add New System User'}
            </h2>
          </div>
          {editingUserId && (
            <button onClick={resetForm} className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg font-medium transition-all">
              Cancel Edit
            </button>
          )}
        </div>

        {/* INPUT FIELDS CONTAINER */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Full Name *</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Username {editMethod !== 'PATCH' && '*'}</label>
            <input
              type="text"
              placeholder={editMethod === 'PATCH' ? 'Disabled in PATCH' : 'Enter username'}
              disabled={editMethod === 'PATCH'}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 disabled:opacity-50 disabled:bg-slate-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address {editMethod !== 'PATCH' && '*'}</label>
            <input
              type="email"
              placeholder={editMethod === 'PATCH' ? 'Disabled in PATCH' : 'something@gmail.com'}
              disabled={editMethod === 'PATCH'}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 disabled:opacity-50 disabled:bg-slate-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phone Number</label>
            <input
              type="text"
              placeholder={editMethod === 'PATCH' ? 'Disabled in PATCH' : '+8801*********'}
              disabled={editMethod === 'PATCH'}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 disabled:opacity-50 disabled:bg-slate-100"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Website URL</label>
            <input
              type="text"
              placeholder={editMethod === 'PATCH' ? 'Disabled in PATCH' : 'www.websiteaddress.com'}
              disabled={editMethod === 'PATCH'}
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 disabled:opacity-50 disabled:bg-slate-100"
            />
          </div>
        </div>

        {/* DYNAMIC ACTION BUTTONS */}
        <div className="flex justify-end mt-6">
          {editMethod === "PUT" ? (
            <button
              onClick={handlePutUpdate}
              className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-[0.98] transition-all"
            >
              🔄 Run PUT Request (Full Update)
            </button>
          ) : editMethod === "PATCH" ? (
            <button
              onClick={handlePatchUpdate}
              className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 hover:brightness-105 active:scale-[0.98] transition-all"
            >
              🛠️ Run PATCH Request (Name Only)
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:brightness-105 active:scale-[0.98] transition-all"
            >
              🚀 Run POST Request (Create)
            </button>
          )}
        </div>
      </div>

      {/* --- [UI PART: USER LIST CARDS] --- */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-600">Fetching users from database...</h2>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className={`group bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  editingUserId === user.id 
                    ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-xl scale-[1.01]' 
                    : 'border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* CARD HEADER */}
                <div className="p-6 pb-4 border-b border-slate-50 bg-gradient-to-b from-slate-50/80 to-transparent">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {user.name}
                      </h2>
                      <p className="text-sm font-medium text-slate-400 mt-0.5">
                        @{user.username || "username"}
                      </p>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold shrink-0">
                      ID: {String(user.id).slice(-4)}
                    </span>
                  </div>
                </div>

                {/* CARD BODY */}
                <div className="p-6 pt-4 space-y-3 flex-grow text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <span className="text-base grayscale group-hover:grayscale-0 transition-all">✉️</span>
                    <span className="truncate" title={user.email}>{user.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base grayscale group-hover:grayscale-0 transition-all">📞</span>
                    <span className="truncate">{user.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base grayscale group-hover:grayscale-0 transition-all">🌐</span>
                    <span className="truncate text-blue-500 hover:underline cursor-pointer">
                      {user.website || "N/A"}
                    </span>
                  </div>
                  {user.company && (
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100/80">
                      <span className="text-base grayscale group-hover:grayscale-0 transition-all">🏢</span>
                      <span className="truncate font-medium text-slate-500">{user.company.name}</span>
                    </div>
                  )}
                  {user.address && (
                    <div className="flex items-center gap-3">
                      <span className="text-base grayscale group-hover:grayscale-0 transition-all">📍</span>
                      <span className="truncate font-medium text-slate-500">{user.address.city}</span>
                    </div>
                  )}
                </div>

                {/* CARD ACTIONS (BUTTONS) */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => startEdit(user, "PUT")}
                    className={`border text-xs font-bold py-2.5 px-2 rounded-xl transition-all active:scale-[0.95] ${
                      editingUserId === user.id && editMethod === 'PUT'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                        : 'bg-white hover:bg-amber-50 border-slate-200 text-amber-600'
                    }`}
                  >
                    PUT (Edit)
                  </button>

                  <button
                    onClick={() => startEdit(user, "PATCH")}
                    className={`border text-xs font-bold py-2.5 px-2 rounded-xl transition-all active:scale-[0.95] ${
                      editingUserId === user.id && editMethod === 'PATCH'
                        ? 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                        : 'bg-white hover:bg-indigo-50 border-slate-200 text-indigo-600'
                    }`}
                  >
                    PATCH
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-50 border border-transparent hover:bg-red-100 text-red-600 text-xs font-bold py-2.5 px-2 rounded-xl transition-all active:scale-[0.95]"
                  >
                    DELETE
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}