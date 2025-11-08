"use client";
export default function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await fetch("/api/session", { method: "DELETE" });
        window.location.href = "/login";
      }}
      className="border px-3 py-1 rounded bg-gray-50 hover:bg-gray-100"
    >
      Logout
    </button>
  );
}
