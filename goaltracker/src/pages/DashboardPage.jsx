import DashboardLayout from "../layouts/DashboardLayout";
import Summary from "../component/dashboard/Summary";


const DashboardPage = () => {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold mb-6">
        Welcome back
      </h2>
      <Summary />
      
    </DashboardLayout>
  );
};

export default DashboardPage;