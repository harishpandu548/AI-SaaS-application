"use client"
import axios from 'axios';
import React ,{useState} from 'react'

type User={
    id:string;
    name:string|null;
    email:string;
    role:"USER"|"ADMIN";
    plan:"FREE"|"PRO";
    credits:number;
    createdAt:string;
}
type Props={
    users:User[]
}

function AdminClient({users:initialUsers}:Props) {
    //just re-naming the users to initial users so same name clash wont occur so from now what the users we got from client page will be stores in initial users
    const [users, setUsers] = useState<User[]>(initialUsers)
    const [loadingId,setLoadingId]=useState<string|null>(null)

    async function updateUser(
        userId:string,
        update:{role?:"USER"|"ADMIN";plan?:"FREE"|"PRO";credits?:number}) {
            setLoadingId(userId)

            try {
                const res=await axios.post("/api/admin/update-user",{userId,...update})
                const data=res.data

                //update local state 
                setUsers((prev)=>
                prev.map((u)=>(u.id===userId?{...u,...data.user}:u)))
                
            } catch (error) {
                console.error(error)
                alert("Error Updating User")
                
            }
            finally{
                setLoadingId(null)
            }
    }
  return (
      <div className="p-6 max-w-6xl mx-auto">
  <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
  <p className="mb-6 text-sm text-gray-600">
    Manage users, roles, plans, and credits.
  </p>

  <div className="overflow-x-auto border shadow-sm rounded-lg bg-white">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-100 text-gray-700 border-b">
        <tr>
          <th className="px-4 py-3 text-left font-semibold">Name</th>
          <th className="px-4 py-3 text-left font-semibold">Email</th>
          <th className="px-4 py-3 text-left font-semibold">Role</th>
          <th className="px-4 py-3 text-left font-semibold">Plan</th>
          <th className="px-4 py-3 text-left font-semibold">Credits</th>
          <th className="px-4 py-3 text-left font-semibold">Created</th>
          <th className="px-4 py-3 text-left font-semibold">Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.map((u) => (
          <tr
            key={u.id}
            className="border-b hover:bg-gray-50 transition-colors"
          >
            <td className="px-4 py-3">{u.name || "-"}</td>
            <td className="px-4 py-3">{u.email}</td>

            <td className="px-4 py-3">
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${
                  u.role === "ADMIN"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {u.role}
              </span>
            </td>

            <td className="px-4 py-3">
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${
                  u.plan === "PRO"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {u.plan}
              </span>
            </td>

            <td className="px-4 py-3">{u.credits}</td>

            <td className="px-4 py-3">
              {new Date(u.createdAt).toLocaleDateString()}
            </td>

            <td className="px-4 py-3 space-x-2 flex flex-wrap gap-2">
              {/* Toggle role */}
              <button
                disabled={loadingId === u.id}
                onClick={() =>
                  updateUser(u.id, {
                    role: u.role === "ADMIN" ? "USER" : "ADMIN",
                  })
                }
                className="border rounded px-3 py-1 text-xs hover:bg-gray-100 transition disabled:opacity-50"
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
                className="border rounded px-3 py-1 text-xs hover:bg-gray-100 transition disabled:opacity-50"
              >
                {u.plan === "PRO" ? "Set FREE" : "Set PRO"}
              </button>

              {/* Reset credits */}
              <button
                disabled={loadingId === u.id}
                onClick={() =>
                  updateUser(u.id, {
                    credits: 20, // or any number you want
                  })
                }
                className="border rounded px-3 py-1 text-xs hover:bg-gray-100 transition disabled:opacity-50"
              >
                Reset Credits
              </button>
            </td>
          </tr>
        ))}

        {users.length === 0 && (
          <tr>
            <td
              colSpan={7}
              className="px-3 py-6 text-center text-gray-500"
            >
              No users found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  )
}

export default AdminClient
