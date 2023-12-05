import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
    date: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
};

export function DatePicker({ date, onDateChange }: DatePickerProps) {
    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (
            selectedDate &&
            date &&
            format(selectedDate, "PPP") === format(date, "PPP")
        ) {
            onDateChange(undefined);
        } else if (selectedDate) {
            onDateChange(selectedDate);
        }
    };

    const handleClearClick = () => {
        onDateChange(undefined);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                <div className="rounded-md border">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        disabled={(date) =>
                            date > new Date() || date < new Date("2023-09-19")
                        }
                        defaultMonth={date || new Date()}
                        initialFocus
                    />
                </div>
                {date && (
                    <Button onClick={handleClearClick} className="mt-2">
                        Clear
                    </Button>
                )}
            </PopoverContent>
        </Popover>
    );
}
