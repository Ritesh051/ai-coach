"use client";
import { useUser } from '@stackframe/stack';
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExpertsList } from '@/services/Options';
import Image from "next/image";
import { BlurFade } from '@/components/ui/blur-fade';
import Dialogbox from './Dialogbox';

function Features() {
  const user = useUser();
  return (
    <div>
      <div className='p-3 flex items-center justify-between'>
        <div>
          <h2 className='font-medium text-gray-500'>My workspace</h2>
          <h2 className='text-3xl font-bold'>
            Welcome back, {user?.displayName}
          </h2>
        </div>
        <Button className={"bg-blue-500 text-white"}>Profile</Button>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-10 mt-10">
        {ExpertsList.map((option, index) => (
          <BlurFade key={option.icon} delay={0.25 + index * 0.05} inView>
            <div key={index} className="p-3 flex flex-col items-center rounded-3xl bg-secondary">
              <Dialogbox ExpertsList={option}>
                <div key={index} className="p-3 flex flex-col items-center rounded-3xl bg-secondary">
                  <Image
                    src={option.icon}
                    alt={option.name}
                    width={50}
                    height={50}
                    className="rounded-md hover:rotate-12 cursor-pointer transition-transform duration-300"
                  />
                  <p className="mt-4 text-sm font-medium">{option.name}</p>
                </div>
              </Dialogbox>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}

export default Features;
