"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
const projects = [
  { value: "", label: "All Projects" },
  { value: "dev-journal", label: "dev-journal" },
  { value: "chat-website-omw2", label: "chat-website-omw2" },
  { value: "chat-website", label: "chat-website" },
  { value: "tick-now", label: "tick-now" },
];
const MenuBar = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("dev-journal"); // Giá trị mặc định ban đầu

  return (
    <div className="w-full flex items-center p-4 border-b border-b-border sticky bg-background top-0 left-0">
      <Popover open={open} onOpenChange={setOpen}>
        {/* Nút bấm đóng vai trò như ô Select hiển thị dự án hiện tại */}
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-40 justify-between"
            >
              <span className="truncate text-left flex-1">
                {value
                  ? projects.find((project) => project.value === value)?.label
                  : "All Projects"}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          }
        />

        {/* Phần nội dung Command chứa tìm kiếm và danh sách hiện ra khi mở Popover */}
        <PopoverContent className="w-62.5 p-0">
          <Command>
            <CommandInput placeholder="Find Project..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              {/* Nhóm danh sách Project */}
              <CommandGroup>
                {projects.map((project) => (
                  <CommandItem
                    key={project.value}
                    value={project.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false); // Đóng menu sau khi chọn xong
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === project.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {project.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>

            {/* Dùng div bên ngoài CommandList để nút Create LUÔN LUÔN hiển thị kể cả khi tìm kiếm */}
            <div
              onClick={() => {
                console.log("Create project clicked");
                setOpen(false); // Đóng menu sau khi bấm tạo
              }}
              className="flex items-center p-2 border-t cursor-pointer hover:bg-accent text-sm text-muted-foreground font-medium"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </div>
          </Command>
        </PopoverContent>
      </Popover>
      <h3 className="text-center flex-1 font-semibold">Title page</h3>
    </div>
  );
};
export default MenuBar;
