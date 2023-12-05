import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
const baseUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

const formSchema = z.object({
    firstName: z.string().min(1, {
        message: "First Name is required.",
    }),
    lastName: z.string().optional(),
    username: z.string().min(1, {
        message: "Username is required.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
});

export default function SignUp() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const navigation = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);

        try {
            const response = await fetch(`${baseUrl}/api/signUp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: values.username,
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName,
                }),
            });

            if (!response.ok) {
                const responseData = await response.json();
                if (response.status === 400) {
                    setError("Username already exists");
                } else {
                    setError(responseData.message || "Error signing up");
                }
            } else {
                navigation("/");
            }
        } catch (error) {
            setError("Error signing up");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col space-y-4 w-11/12 max-w-md p-6 bg-white rounded-lg shadow-md mt-auto dark:bg-gray-800"
                >
                    <h1 className="text-3xl font-bold text-center">Sign Up</h1>
                    <div className="flex flex-row space-x-5">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            placeholder="John"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            placeholder="Doe"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username *</FormLabel>
                                <FormControl>
                                    <Input
                                        className="w-full"
                                        placeholder="johndoe"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password *</FormLabel>
                                <FormControl>
                                    <Input
                                        className="w-full"
                                        type="password"
                                        placeholder="12345"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        className={`w-full transition-all duration-500 hover:bg-sky-600 ${
                            error
                                ? "bg-destructive hover:bg-destructive"
                                : "bg-sky-500"
                        }`}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {error ? (
                            <span className="text-destructive-foreground">
                                {error}
                            </span>
                        ) : isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                                <span className="ml-2">Signing Up...</span>
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>
                    <FormDescription className="text-center">
                        Already have an account?{" "}
                        <span
                            className="text-sky-500 cursor-pointer"
                            onClick={() => navigation("/signin")}
                        >
                            Sign In
                        </span>
                    </FormDescription>
                </form>
            </Form>
            <div className="mt-auto"></div>
            <div className="flex justify-center p-3 mt-auto">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Made By Shawn
                </p>
            </div>
        </div>
    );
}
