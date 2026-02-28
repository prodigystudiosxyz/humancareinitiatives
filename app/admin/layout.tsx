import { ReactNode } from 'react';
import { AdminDataProvider } from './AdminDataContext';
import AdminShell from './components/AdminShell';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminDataProvider>
      <AdminShell>{children}</AdminShell>
    </AdminDataProvider>
  );
}
