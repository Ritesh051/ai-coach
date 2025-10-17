"use client";
import { useUser } from '@stackframe/stack';
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExpertsList } from '@/services/Options';
import Image from "next/image";
import { BlurFade } from '@/components/ui/blur-fade';
import Dialogbox from './Dialogbox';

import { User } from 'lucide-react';

function Features() {
  const user = useUser();
  
  return (
    <div className="p-6 transition-colors">
      {/* Header Section */}
      <div className='flex items-center justify-between mb-8'>
        <div className='flex-1'>
          <h2 className='font-medium text-gray-500 dark:text-gray-400'>My workspace</h2>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mt-1'>
            Welcome back, {user?.displayName}
          </h2>
        </div>
        
        <div className='flex items-center gap-3'>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </div>
      </div>

      {/* Experts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-10">
        {ExpertsList.map((option, index) => (
          <BlurFade key={option.icon} delay={0.25 + index * 0.05} inView>
            <Dialogbox ExpertsList={option}>
              <div className="group p-5 flex flex-col items-center rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <Image
                    src={option.icon}
                    alt={option.name}
                    width={60}
                    height={60}
                    className="relative rounded-xl group-hover:rotate-12 transition-transform duration-300 ring-2 ring-transparent group-hover:ring-blue-500"
                  />
                </div>
                <p className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {option.name}
                </p>
              </div>
            </Dialogbox>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}

export default Features;