import React from 'react';
import Features from './_components/Features';
import Feedback from './_components/Feedback';
import History from './_components/History';

function Dashboard () {
  return (
    <div>
      <Features />
      <div className='grid grid-cols-2 md:grid-cols-2 gap-10 mt-10'>
        <History />
        <Feedback />
      </div>
    </div>
  );
}

export default Dashboard;
