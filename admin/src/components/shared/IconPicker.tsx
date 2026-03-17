import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { NETWORK_ICON_OPTIONS, getNetworkIcon } from '@/lib/network-icons';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

type IconPickerProps = {
  value: string;
  onChange: (iconName: string) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filteredIcons = NETWORK_ICON_OPTIONS.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const SelectedIcon = getNetworkIcon(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            type="button"
          >
            <SelectedIcon className="h-4 w-4" />
            <span>{value || 'Select an icon'}</span>
          </Button>
        }
      />
      <PopoverContent className="w-80" align="start">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1">
            {filteredIcons.map((option) => {
              const Icon = option.Icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    'flex flex-col items-center gap-1 p-2 rounded-md hover:bg-accent transition-colors',
                    value === option.value &&
                      'bg-accent ring-2 ring-cyan-500 ring-offset-2'
                  )}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] truncate w-full text-center">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
