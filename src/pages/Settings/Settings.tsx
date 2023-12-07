import React, { useEffect, useState } from 'react';
import { OutlineButton } from '@/components/OutlineButton';

import Cookies from 'js-cookie';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loading } from '@/components/Loading';
import { Error } from '@/components/Error';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const baseUrl =
    process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

type user = {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

export default function Settings() {
    const initialUser: user = {
        id: 0,
        firstName: '',
        lastName: '',
        username: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    };
    const token = Cookies.get('token');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState<user>(initialUser);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileError, setProfileError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        document.title = "MY Cafe | Settings";
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/user_data`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    setError('Failed to fetch user data');
                }
                const data = await response.json();
                setUser(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [token]);

    const handleSaveProfile = async () => {
        try {
            setLoadingProfile(true);

            const response = await fetch(`${baseUrl}/api/update_profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    newUsername: user.username,
                    id: user.id
                })
            });

            if (response.ok) {
                Cookies.remove('token');
                window.location.href = '/';
            } else {
                setProfileError('Profile update failed');
            }
        } catch (error) {
            setProfileError('Profile update failed');
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        try {
            setLoadingPassword(true);

            if (user.newPassword != user.confirmNewPassword) {
                setPasswordError('New Password Doesn\'t match');
                setLoadingPassword(false);
                return;
            }

            console.log(user);

            await fetch(`${baseUrl}/api/update_password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    enteredCurrentPassword: user.currentPassword,
                    newPassword: user.newPassword,
                    id: user.id
                })
            })
                .then((response) => {
                    if (response.status === 200) {
                        setPasswordSuccess('Password updated successfully');
                    } else if (response.status === 401) {
                        response.json().then((data) => {
                            if (data.error === 'Password doesn\'t match') {
                                setPasswordError('Current password is wrong');
                            } else {
                                setPasswordError('Password update failed');
                            }
                        });
                    } else {
                        setPasswordError('Password update failed');
                    }
                })
                .catch((error) => {
                    setPasswordError('Password update failed');
                    console.error('Error updating password:', error);
                });
        } catch (error) {
            console.error('Error updating password:', error);
            setPasswordError('Password update failed');
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            {isLoading ? (
                <Loading message='Fetching user data...' />
            ) : error ? (
                <Error message={error} />
            ) : (
                <div>
                    <div className='flex justify-center space-x-4 p-4 mt-16'>
                        <OutlineButton text={'Return Home'} redirectTo='/' />
                    </div>
                    <div className='h-16'></div>
                    <Tabs defaultValue='account' className='w-96'>
                        <TabsList className='grid w-full grid-cols-2'>
                            <TabsTrigger value='account'>Account</TabsTrigger>
                            <TabsTrigger value='password'>Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value='account'>
                            <form onSubmit={handleSaveProfile}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Account</CardTitle>
                                        <CardDescription>
                                            Make changes to your account here.
                                            Click save when you're done, doing
                                            so will log you out.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className='space-y-2'>
                                        <div className='space-y-1'>
                                            <Label htmlFor='firstName'>
                                                First Name
                                            </Label>
                                            <Input
                                                id='firstName'
                                                defaultValue={user.firstName}
                                                onChange={(e) =>
                                                    setUser({
                                                        ...user,
                                                        firstName:
                                                        e.target.value
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className='space-y-1'>
                                            <Label htmlFor='lastName'>
                                                Last Name
                                            </Label>
                                            <Input
                                                id='lastName'
                                                defaultValue={user.lastName}
                                                onChange={(e) =>
                                                    setUser({
                                                        ...user,
                                                        username:
                                                        e.target.value
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className='space-y-1'>
                                            <Label htmlFor='username'>
                                                Username
                                            </Label>
                                            <Input
                                                id='username'
                                                defaultValue={user.username}
                                                onChange={(e) =>
                                                    setUser({
                                                        ...user,
                                                        username:
                                                        e.target.value
                                                    })
                                                }
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button type='submit'>
                                            {loadingProfile ? (
                                                <div className='animate-spin'>
                                                    <Loader2 />
                                                </div>
                                            ) : (
                                                <span>Save Changed</span>
                                            )}
                                        </Button>
                                        {profileError && (
                                            <p className='text-destructive'>
                                                {profileError}
                                            </p>
                                        )}
                                    </CardFooter>
                                </Card>
                            </form>
                        </TabsContent>
                        <TabsContent value='password'>
                            <form onSubmit={handleChangePassword}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Password</CardTitle>
                                        <CardDescription>
                                            Change your password here. After
                                            saving, you'll be logged out.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className='space-y-2'>
                                        <div className='space-y-1'>
                                            <Label htmlFor='current'>
                                                Current password
                                            </Label>
                                            <Input
                                                id='current'
                                                type='password'
                                                onChange={(e) =>
                                                    setUser({
                                                        ...user,
                                                        currentPassword:
                                                        e.target.value
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className='space-y-1'>
                                            <Label htmlFor='new'>
                                                New password
                                            </Label>
                                            <Input
                                                id='new'
                                                type='password'
                                                onChange={(e) =>
                                                    setUser({
                                                        ...user,
                                                        newPassword:
                                                        e.target.value
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className='space-y-1'>
                                            <Label htmlFor='newConfirm'>
                                                Confirm new password
                                            </Label>
                                            <Input
                                                id='newConfirm'
                                                type='password'
                                                onChange={(e) =>
                                                    setUser({
                                                        ...user,
                                                        confirmNewPassword:
                                                        e.target.value
                                                    })
                                                }
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <div>
                                            <Button type='submit'>
                                                {loadingPassword ? (
                                                    <div className='animate-spin'>
                                                        <Loader2 />
                                                    </div>
                                                ) : (
                                                    <span>Save Password</span>
                                                )}
                                            </Button>
                                            {passwordError && (
                                                <p className='text-destructive'>
                                                    {passwordError}
                                                </p>
                                            )}
                                        </div>
                                    </CardFooter>
                                </Card>
                            </form>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
            <div className='flex justify-center mt-auto'>
                <p className='text-sm text-neutral-700 dark:text-neutral-300'>
                    Made By Shawn
                </p>
            </div>
        </div>
    );
}
