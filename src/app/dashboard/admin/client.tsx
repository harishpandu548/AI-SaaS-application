"use client";
import axios from "axios";
import React, { useState } from "react";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  plan: "FREE" | "PRO";
  credits: number;
  createdAt: string;
};

type Props = {
  users: User[];
};

function AdminClient({ users: initialUsers }: Props) {
  //just re-naming the users to initial users so same name clash wont occur so from now what the users we got from client page will be stores in initial users
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateUser(
    userId: string,
    update: { role?: "USER" | "ADMIN"; plan?: "FREE" | "PRO"; credits?: number }
  ) {
    setLoadingId(userId);

    try {
      const res = await axios.post("/api/admin/update-user", {
        userId,
        ...update,
      });
      const data = res.data;

      //update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...data.user } : u))
      );
    } catch (error) {
      console.error(error);
      alert("Error Updating User");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <main className="relative min-h-screen px-6 py-12 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* 🌈 AURORA BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-pink-400/25 blur-3xl rounded-full" />
        <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] bg-purple-400/25 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.10),transparent_60%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto animate-fade-in">
        {/* HEADER */}
       {/* HEADER */}
<header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
  {/* LEFT: TITLE */}
  <div>
    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
      Admin Panel
    </h1>
    <p className="mt-2 text-zinc-600 max-w-xl">
      Manage users, roles, subscription plans, and credits securely.
    </p>
  </div>

  {/* RIGHT: DEMO NOTE */}
<div className="
  w-full max-w-md
  lg:ml-12        /* 👈 pulls it left */
  rounded-2xl
  bg-white/70 backdrop-blur
  border border-purple-200
  px-5 py-4
  shadow-[0_10px_30px_rgba(168,85,247,0.15)]
">


   <p className="text-sm text-zinc-700 leading-6">
  <strong>Notice:</strong>{" "}
  This admin panel is normally restricted and accessible only to authorized
  administrators.
</p>

<p className=" text-sm text-zinc-600 leading-6">
  For this project demo, the page has been intentionally made public so that
  recruiters and reviewers can explore user management, subscription plans,
  and credit handling. In a real production environment, this page would not be
  visible to regular users.I can still make this page accessed by admin but to show the working i made this page visible to everyone
</p>

  </div>
</header>


        {/* 🌊 GLASS TABLE CARD */}
        <div
          className="
            relative rounded-3xl
            bg-gradient-to-br from-pink-500/10 via-white/10 to-purple-500/10
            backdrop-blur-2xl

            border border-purple-500/30
            ring-1 ring-purple-500/20

            shadow-[0_25px_60px_rgba(168,85,247,0.25)]
            overflow-x-auto

            transition-all duration-300
            hover:ring-2 hover:ring-pink-500/40
          "
        >
          {/* inner glass line */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20 pointer-events-none" />

          <table className="relative min-w-full text-sm">
            <thead className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              <tr>
                <th className="px-5 py-4 text-left font-semibold">Name</th>
                <th className="px-5 py-4 text-left font-semibold">Email</th>
                <th className="px-5 py-4 text-left font-semibold">Role</th>
                <th className="px-5 py-4 text-left font-semibold">Plan</th>
                <th className="px-5 py-4 text-left font-semibold">Credits</th>
                <th className="px-5 py-4 text-left font-semibold">Created</th>
                <th className="px-5 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/30">
              {users.map((u) => (
                <tr key={u.id} className="transition hover:bg-white/40">
                  <td className="px-5 py-4 font-medium text-zinc-900">
                    {u.name || "-"}
                  </td>

                  <td className="px-5 py-4 text-zinc-700">{u.email}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.role === "ADMIN"
                          ? "bg-purple-500/20 text-purple-700 border border-purple-400/40"
                          : "bg-zinc-500/10 text-zinc-700 border border-zinc-300"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.plan === "PRO"
                          ? "bg-green-500/20 text-green-700 border border-green-400/40"
                          : "bg-yellow-500/20 text-yellow-700 border border-yellow-400/40"
                      }`}
                    >
                      {u.plan}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-medium text-zinc-800">
                    {u.plan === "PRO" ? (
                      <span className="inline-flex items-center gap-1 text-purple-700">
                        💎 ∞
                      </span>
                    ) : (
                      u.credits
                    )}
                  </td>

                  <td className="px-5 py-4 text-zinc-600">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {/* Toggle role */}
                      <button
                        disabled={loadingId === u.id}
                        onClick={() =>
                          updateUser(u.id, {
                            role: u.role === "ADMIN" ? "USER" : "ADMIN",
                          })
                        }
                        className="
                          px-3 py-1 rounded-lg text-xs font-medium
                          bg-white/50 backdrop-blur
                          border border-purple-500/30
                          hover:ring-2 hover:ring-pink-500/40
                          transition
                          disabled:opacity-50
                        "
                      >
                        {u.role === "ADMIN" ? "Make USER" : "Make ADMIN"}
                      </button>

                      {/* Toggle plan */}
                      <button
                        disabled={loadingId === u.id}
                        onClick={() =>
                          updateUser(u.id, {
                            plan: u.plan === "PRO" ? "FREE" : "PRO",
                          })
                        }
                        className="
                          px-3 py-1 rounded-lg text-xs font-medium
                          bg-white/50 backdrop-blur
                          border border-purple-500/30
                          hover:ring-2 hover:ring-pink-500/40
                          transition
                          disabled:opacity-50
                        "
                      >
                        {u.plan === "PRO" ? "Set FREE" : "Set PRO"}
                      </button>

                      {/* Reset credits */}
                      <button
                        disabled={loadingId === u.id}
                        onClick={() =>
                          updateUser(u.id, {
                            credits: 20,
                          })
                        }
                        className="
                          px-3 py-1 rounded-lg text-xs font-medium
                          bg-white/50 backdrop-blur
                          border border-purple-500/30
                          hover:ring-2 hover:ring-pink-500/40
                          transition
                          disabled:opacity-50
                        "
                      >
                        Reset Credits
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default AdminClient;
