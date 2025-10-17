"use client";

import { UserContext } from '@/app/_context/UserContext';
import { useConvex } from 'convex/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../../../../../convex/_generated/api';
import { ExpertsList } from '@/services/Options';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import Link from 'next/link';

function History() {
  const convex = useConvex();
  const { userData } = useContext(UserContext);
  const [discussionRoomList, setDiscussionRoomList] = useState([]);

  useEffect(() => {
    if (userData?._id) GetInterviewRooms();
  }, [userData]);

  const GetInterviewRooms = useCallback(async () => {
      if (!userData?._id) {
        console.warn("User data not loaded yet, skipping fetch.");
        return;
      }
      try {
        const result = await convex.query(api.InterviewRoom.GetAllDiscussionRooms, {
          uid: userData._id,
        });
        setDiscussionRoomList(result);
        console.log("All rooms:", result);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    }, [convex, userData?._id]);
    useEffect(() => {
      if (userData?._id) {
        GetInterviewRooms();
      }
    }, [userData, GetInterviewRooms]);

  const GetAbstractImages = (option) => {
    const coachingOption = ExpertsList.find((item) => item.name === option);
    return coachingOption?.abstract ?? '/ab1.png';
  }

  return (
    <div>
      <h1 className='font-bold text-lg'>Your previous Interviews</h1>
      {discussionRoomList?.length === 0 && (
        <h2 className='text-gray-500'>You don't have any previous interviews here</h2>
      )}

      <div className='mt-5'>
        {discussionRoomList?.map((item, index) => (
          <div key={index} className='border-b-[1px] pb-3 mb-4 group flex justify-between items-center cursor-pointer'>
            <div className='flex gap-5 items-center'>
              <Image
                className='rounded-full h-[50px] w-[50px] object-cover'
                src={GetAbstractImages(item.coachOptions)}
                alt="abstract image"
                width={70}
                height={70}
              />
              <div>
                <h2 className='font-semibold text-black dark:text-white'>{item.topic}</h2>
                <h2 className='text-sm text-gray-600 dark:text-gray-300'>
                  {ExpertsList.find(expert => expert.name === item.coachOptions)?.name || item.coachOptions}
                </h2>
                <h2 className='text-gray-600 dark:text-gray-400 text-sm'>{moment(item._creationTime).fromNow()}</h2>
              </div>
            </div>
            <Link href={`/view-summary/${item._id}`}>
              <Button variant="outline" className="invisible group-hover:visible">View Notes</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
