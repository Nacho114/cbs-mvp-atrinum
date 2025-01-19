export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold">Unauthorized Access</h1>
      <p className="mt-4 text-lg text-gray-400">
        You do not have admin access.
      </p>
    </div>
  )
}
