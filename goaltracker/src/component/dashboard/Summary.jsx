const Summary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">Active Goals</p>
        <h3 className="text-2xl font-bold">5</h3>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">Completed</p>
        <h3 className="text-2xl font-bold">12</h3>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">Total XP</p>
        <h3 className="text-2xl font-bold">340</h3>
      </div>
    </div>
  );
};

export default Summary;