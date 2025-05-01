
import * as React from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

interface MultiSelectProps {
  options: { id: string; label: string }[]
  selected: string[]
  onChange: (selectedItems: string[]) => void
  placeholder?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item))
  }

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && selected.length > 0) {
            onChange(selected.slice(0, -1))
          }
        }
        if (e.key === "Escape") {
          input.blur()
        }
      }
    },
    [selected, onChange]
  )

  // Get labels for selected items
  const selectedLabels = React.useMemo(() => {
    return options
      .filter((option) => selected.includes(option.id))
      .map((option) => ({ id: option.id, label: option.label }))
  }, [options, selected])

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group border border-input px-3 py-2 text-sm rounded-md flex flex-wrap gap-1 min-h-10">
        {selectedLabels.map((item) => (
          <Badge
            key={item.id}
            variant="secondary"
            className="rounded-sm px-1 pr-0.5 py-0"
          >
            {item.label}
            <button
              className="ml-1 rounded-sm hover:bg-muted"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUnselect(item.id)
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onClick={() => handleUnselect(item.id)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {item.label}</span>
            </button>
          </Badge>
        ))}
        
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          placeholder={selected.length === 0 ? placeholder : undefined}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground h-8 min-w-[120px] ml-0.5"
        />
      </div>
      
      <div className="relative">
        {open && (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {options
                .filter(option => !selected.includes(option.id))
                .filter(option => 
                  option.label.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((option) => (
                  <CommandItem
                    key={option.id}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={() => {
                      onChange([...selected, option.id])
                      setInputValue("")
                    }}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  )
}
