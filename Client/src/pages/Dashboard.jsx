
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/Api.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 👈 Hamburger menu state

  // ================= FETCH =================
  const fetchTasks = async () => {
    const { data } = await API.get("/task");
    setTasks(data);
  };

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();
    };
    loadTasks();
  }, []);

  // ================= ADD / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    if (editId) {
      const existingTask = tasks.find((task) => task._id === editId);
      await API.put(`/task/${editId}`, {
        title,
        description,
        status: existingTask?.status || "pending",
      });
      setEditId(null);
    } else {
      await API.post("/task", { title, description });
    }

    setTitle("");
    setDescription("");
    fetchTasks();
  };

  // ================= EDIT =================
  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setEditId(task._id);
    setIsMenuOpen(false); // 👈 Menu band karo edit karne ke baad
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    await API.delete(`/task/${id}`);
    fetchTasks();
  };

  // ================= STATUS TOGGLE =================
  const toggleStatus = async (task) => {
    const newStatus =
      task.status === "completed" ? "pending" : "completed";

    await API.put(`/task/${task._id}`, {
      title: task.title,
      description: task.description,
      status: newStatus,
    });

    fetchTasks();
  };

  // ================= DATE FORMAT =================
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* ========== NAVBAR with HAMBURGER ========== */}
      <div className="bg-stone-800 text-stone-100 px-4 sm:px-8 py-4 flex justify-between items-center shadow-md border-b-4 border-amber-500 relative">
        
        {/* Left side - Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl">📋</span>
          <h1 className="text-xl sm:text-2xl font-mono font-bold tracking-tight">
            TASKFLOW
          </h1>
        </div>

        {/* Desktop View - Normal (Hidden on mobile) */}
        <div className="hidden sm:flex gap-6 items-center">
          <span className="flex items-center gap-2 font-mono text-sm bg-stone-700 px-4 py-2 rounded-full">
            <span className="text-amber-400">●</span> {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="border border-stone-500 px-5 py-2 rounded-full text-sm font-mono hover:bg-stone-700 hover:border-stone-400 transition-all"
          >
            SIGN OUT
          </button>
        </div>

        {/* Mobile View - Hamburger Icon (Visible only on mobile) */}
        <div className="sm:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-stone-700 transition-colors"
          >
            {isMenuOpen ? (
              <span className="text-2xl">✕</span> // Close icon
            ) : (
              <span className="text-2xl">☰</span> // Hamburger icon
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full right-4 mt-2 w-48 bg-stone-800 border border-stone-700 rounded-xl shadow-lg py-2 z-50 sm:hidden">
            <div className="px-4 py-3 border-b border-stone-700">
              <span className="flex items-center gap-2 font-mono text-sm text-stone-100">
                <span className="text-amber-400">●</span> {user?.name}
              </span>
            </div>
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm font-mono text-stone-100 hover:bg-stone-700 transition-colors flex items-center gap-2"
            >
              <span>🚪</span> SIGN OUT
            </button>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        {/* TASK FORM */}
        <div className="bg-white border-l-8 border-amber-600 p-5 sm:p-7 rounded-r-2xl shadow-sm mb-8 sm:mb-12">
          <h2 className="font-mono text-xs sm:text-sm uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
            <span className="bg-amber-600 w-2 h-2 rounded-full"></span>
            {editId ? "UPDATE ENTRY" : "NEW ENTRY"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full bg-stone-50 border-b-2 border-stone-200 p-3 text-base sm:text-lg focus:outline-none focus:border-amber-600 font-serif"
              placeholder="what needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full bg-stone-50 border-b-2 border-stone-200 p-3 text-sm focus:outline-none focus:border-amber-600 font-serif"
              placeholder="add details ..."
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button className="w-full bg-stone-800 text-amber-100 py-3 font-mono text-sm tracking-wider hover:bg-stone-900 transition-colors rounded-none">
              {editId ? "→ UPDATE TASK" : "→ CREATE TASK"}
            </button>
          </form>
        </div>

        {/* TASK LIST */}
        <div className="space-y-4 sm:space-y-5">
          {tasks.length === 0 ? (
            <div className="text-center py-12 sm:py-16 border-2 border-dashed border-stone-200 rounded-2xl sm:rounded-3xl bg-white/50">
              <span className="text-5xl sm:text-6xl block mb-4">🗂️</span>
              <p className="text-stone-400 font-mono text-xs sm:text-sm">
                no tasks yet. create one.
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white border border-stone-200 p-5 sm:p-6 rounded-2xl sm:rounded-3xl hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  {/* LEFT CONTENT */}
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                          task.status === "completed"
                            ? "bg-emerald-400"
                            : "bg-amber-400"
                        }`}
                      ></div>
                      <h3
                        className={`font-serif text-lg sm:text-xl ${
                          task.status === "completed"
                            ? "line-through text-stone-400"
                            : "text-stone-800"
                        }`}
                      >
                        {task.title}
                      </h3>
                    </div>

                    <p className="text-stone-500 text-xs sm:text-sm mt-2 ml-5 font-light italic border-l-2 border-stone-200 pl-3">
                      {task.description || "— no description —"}
                    </p>

                    {/* status chip */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 ml-5">
                      <span
                        className={`text-xs font-mono px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border ${
                          task.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {task.status}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">
                        ✎ created{" "}
                        {new Date(task.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS - Mobile friendly */}
                  <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => toggleStatus(task)}
                      className="flex-1 sm:flex-none text-xs font-mono bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 sm:px-4 py-2 rounded-full transition flex items-center justify-center gap-1"
                      title="toggle status"
                    >
                      <span className="text-base">↻</span>
                      <span className="sm:hidden">status</span>
                      <span className="hidden sm:inline">status</span>
                    </button>

                    <button
                      onClick={() => handleEdit(task)}
                      className="flex-1 sm:flex-none text-xs font-mono bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 sm:px-4 py-2 rounded-full transition flex items-center justify-center gap-1"
                    >
                      <span className="text-base">✎</span>
                      <span className="sm:hidden">edit</span>
                      <span className="hidden sm:inline">edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(task._id)}
                      className="flex-1 sm:flex-none text-xs font-mono bg-red-100 hover:bg-red-200 text-red-700 px-3 sm:px-4 py-2 rounded-full transition flex items-center justify-center gap-1"
                    >
                      <span className="text-base">✕</span>
                      <span className="sm:hidden">delete</span>
                      <span className="hidden sm:inline">delete</span>
                    </button>
                  </div>
                </div>

                {/* timestamp line */}
                <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] font-mono text-stone-400 flex flex-col sm:flex-row justify-between gap-1 sm:gap-0">
                  <span>📅 created: {formatDate(task.createdAt)}</span>
                  <span>🕒 updated: {formatDate(task.updatedAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
