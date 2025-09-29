import { UserButton } from '@stackframe/stack';
import Image from 'next/image';
import React from 'react';

function AppHeader() {
    return (
        <div className='p-3 shadow-sm flex items-center justify-between'>
            <Image src={'./logo.svg'} alt='logo' width={100} height={100} />
            <UserButton />
        </div>
    );
}

export default AppHeader;
