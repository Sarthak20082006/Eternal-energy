import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div
                className="flex-1 flex flex-col transition-all duration-300"
                style={{ marginLeft: collapsed ? 72 : 260 }}
            >
                <Topbar />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
