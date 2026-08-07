export default function ProfileCard() {
  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <div className="flex flex-col items-center">

        <img
          src="https://ui-avatars.com/api/?name=Admin"
          alt="Profile"
          className="h-24 w-24 rounded-full"
        />

        <h2 className="mt-4 text-2xl font-bold">
          Admin User
        </h2>

        <p className="text-gray-500">
          admin@enterprisegpt.com
        </p>

        <span className="mt-3 rounded-full bg-blue-100 px-4 py-1 text-blue-700">
          Administrator
        </span>

      </div>

    </div>
  );
}