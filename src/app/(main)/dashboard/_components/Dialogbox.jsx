import React, { useState } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { AiExpertsList } from '@/services/Options';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
function Dialogbox({ children, ExpertsList }) {

    const [selectedExpert, setSelectedExpert] = useState();
    const [topic, setTopic] = useState('');
    const [Loading, setLoading] = useState(false);
    const [openDialog, setOpenDailog] = useState(false);
    const router  = useRouter();
    const createDiscussionRoom = useMutation(api.InterviewRoom.createNewRoom);
    
    const onClickNext = async () => {
        setLoading(true);
        const result = await createDiscussionRoom({
            topic: topic,
            expertName: selectedExpert,
            coachOptions: ExpertsList.name
        })
        console.log("Room created with id:", result);
        setLoading(false);
        setOpenDailog(false)
        router.push(`/discussion-room/${result}`);
    }
    return (
        <div>
            <Dialog open = {openDialog} onOpenChange = {setOpenDailog}>
                <DialogTrigger>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{ExpertsList.name}</DialogTitle>
                        <DialogDescription asChild>
                            <div className='mt-4'>
                                <h2 className='font-medium text-black'>
                                    Enter your topic to master your skills in {ExpertsList.name}
                                    <Textarea placeholder="Enter your topic here..." className="mt-2"
                                        onChange={(e) => setTopic(e.target.value)} value={topic}
                                    />
                                </h2>
                                <h2 className='text-black mt-4'>
                                    (This is a demo version, actual feature will be available soon!)
                                </h2>
                                <div className="grid grid-cols-4 md:grid-col-5 gap-6 mt-4">
                                    {AiExpertsList.map((expert, index) => (
                                        <div key={index} onClick={() => setSelectedExpert(expert.name)}
                                        >
                                            <Image
                                                src={expert.avatar}
                                                alt={expert.name}
                                                width={100}
                                                height={100}
                                                className={`rounded-2xl h-[80px] w-[90px] object-cover hover:scale-105 transition-all cursor-pointer ${selectedExpert === expert.name && 'border-2'}`}
                                            />
                                            <h2 className="text-sm mt-1">{expert.name}</h2>
                                        </div>
                                    ))}
                                </div>
                                <div className='flex items-center justify-end gap-3 mt-6'>
                                    <DialogClose asChild>
                                        <Button variant={'ghost'}>Cancel</Button>
                                    </DialogClose>
                                    <Button disabled={!selectedExpert || !topic || Loading} onClick={onClickNext} >
                                    {Loading && <LoaderCircle className='animate-spin'/>}
                                    Next</Button>
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Dialogbox;
