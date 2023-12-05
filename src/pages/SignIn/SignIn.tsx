import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    username: z.string().min(1, {
        message: "Username is required.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
});

export default function SignIn() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const navigation = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);

        try {
            const response = await fetch(`${baseUrl}/api/signIn`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: values.username,
                    password: values.password,
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                const token = responseData.token;
                Cookies.set("token", token);

                try {
                    const decodedToken: { username: string } = jwtDecode(token);
                    const { username } = decodedToken;

                    navigation("/");
                    setIsSubmitting(false);
                } catch (error: any) {
                    console.error("Error decoding token:", error);
                    setError(
                        `Error decoding token: ${
                            error.message || "Unknown error"
                        }`,
                    );
                }
            } else {
                setIsSubmitting(false);

                if (response.status === 401) {
                    setError("Incorrect username or password");
                } else {
                    setError(`Error: ${response.statusText}`);
                }
            }
        } catch (error) {
            setIsSubmitting(false);
            setError("Error: Something went wrong, please try again later");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col space-y-4 w-11/12 max-w-md p-6 bg-white rounded-lg shadow-md mt-auto dark:bg-gray-800"
                >
                    <h1 className="text-3xl font-bold text-center">Sign In</h1>
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
                                <span className="ml-2">Signing In...</span>
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                    <FormDescription className="text-center">
                        Don't have an account?{" "}
                        <span
                            className="text-sky-500 cursor-pointer"
                            onClick={() => navigation("/signup")}
                        >
                            Sign Up
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
