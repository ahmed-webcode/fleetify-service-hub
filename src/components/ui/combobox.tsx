import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList, // for performance with long lists
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface ComboboxOption {
    value: string;
    label: string;
}

interface ComboboxProps {
    options: ComboboxOption[];
    value?: string | null; // Allow null
    onChange: (value: string | null) => void;
    placeholder?: string;
    notFoundText?: string;
    isLoading?: boolean;
    className?: string;
}

export function Combobox({
    options,
    value,
    onChange,
    placeholder = "Select an option...",
    notFoundText = "No results found.",
    isLoading = false,
    className,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);

    // Find the full option object for the currently selected value
    const selectedOption = options.find((option) => option.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                    disabled={isLoading}
                >
                    {isLoading
                        ? "Loading..."
                        : selectedOption
                        ? selectedOption.label
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            {/* Set width to match the trigger button for better aesthetics */}
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandEmpty>{notFoundText}</CommandEmpty>
                    {/* Using CommandList is good practice for scrollable content */}
                    <CommandList> 
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    // Use the LABEL for the value so search works as expected.
                                    value={option.label}
                                    onSelect={() => {
                                        // On select, report the ID (option.value) back.
                                        // This ignores the argument from onSelect and uses the `option` from the map closure.
                                        onChange(option.value === value ? null : option.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            // Compare against the true value from props
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}