import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

export function NotAuthorized() {
    const navigation = useNavigate();

    useEffect(() => {
        document.title = "MY Cafe | Not Authorized";
    }, []);

    return (
        <div className='flex flex-col items-center justify-center h-96'>
            <div className='flex flex-col items-center space-y-4'>
                <h1 className='text-4xl font-bold'>Not Authorized</h1>
                <p className='text-lg text-center'>
                    You are not authorized to view this page.
                </p>
                <div className='space-x-4'>
                    <Button
                        className='w-36 font-semibold text-lg'
                        onClick={() => navigation('/')}
                    >
                        Go back home
                    </Button>
                    <Button
                        className='w-36 font-semibold text-lg'
                        onClick={() => navigation('/signin')}
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        </div>
    );
}
