import { getNetWorthData } from "@/lib/data";
import { NetWorthPage } from "@/components/NetWorthPage";
import { Navigation } from "@/components/Navigation";

export default function NetWorth() {
  const data = getNetWorthData();

  return (
    <main className="max-w-lg mx-auto px-4 pt-4 pb-24 lg:max-w-7xl lg:px-6">
      <h1 className="text-xl font-bold text-gray-100 text-center mb-4">שווי נקי</h1>
      <NetWorthPage data={data} />
      <Navigation />
    </main>
  );
}
