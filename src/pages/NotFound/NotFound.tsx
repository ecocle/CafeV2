import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
    const navigation = useNavigate();

    return (
        <div className='flex flex-col items-center justify-center h-96'>
            <div className='flex flex-col items-center space-y-4'>
                <h1 className='text-4xl font-bold'>Not Found</h1>
                <p className='text-lg text-center'>
                    The page you are looking for does not exist.
                </p>
                <Button
                    className='w-36 font-semibold text-lg'
                    onClick={() => navigation('/')}
                >
                    Go back home
                </Button>
            </div>
        </div>
    );
}
