import { ModeToggle } from '@/app/components/mode-toggle';
import { UserButton } from '@stackframe/stack';
import Image from 'next/image';
import React from 'react';

function AppHeader() {
    return (
        <div className='p-3 shadow-sm flex items-center justify-between'>
            <Image src={'./logo.svg'} alt='logo' width={100} height={100} />
            <ModeToggle className="left-4" />
            <UserButton />
        </div>
    );
}

export default AppHeader;
