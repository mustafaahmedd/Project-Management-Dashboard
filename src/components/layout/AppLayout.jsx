import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[#0B0D11]">
      <Sidebar />
      <main className="ml-[260px] flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
