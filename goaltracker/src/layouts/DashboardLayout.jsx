const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold">Goal Tracker</h1>
      </header>

      <main className="p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;