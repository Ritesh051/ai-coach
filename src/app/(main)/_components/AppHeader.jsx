import React from 'react';
import { DashboardNavbar } from '../dashboard/_components/DashboardNavbar';

function AppHeader() {
    return (
        <div>
            <DashboardNavbar className="bg-white dark:bg-gray-900 flex" />
        </div>
    );
}

export default AppHeader;
