
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayPickerProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { 
  getNepaliDateObject, 
  getEnglishDateFromNepaliBS, 
  nepaliMonths, 
  toNepaliDate, 
  formatNepaliDateShort
} from "@/lib/nepaliDateUtils";

export type NepaliCalendarProps = React.ComponentProps<typeof DayPicker>;

function NepaliCalendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: NepaliCalendarProps) {
  const today = new Date();
  const nepaliToday = getNepaliDateObject(today);
  
  // Custom formatter for the month caption
  const formatCaption = (date: Date) => {
    const nepaliDate = toNepaliDate(date);
    const year = nepaliDate.getBS().year;
    const month = nepaliMonths[nepaliDate.getBS().month];
    return `${month} ${year}`;
  };

  // Custom formatter for days
  const formatDay = (date: Date) => {
    const nepaliDate = toNepaliDate(date);
    return nepaliDate.getBS().day.toString();
  };

  // Override month navigation
  const handlePrevMonth = (
    currentMonth: Date,
    handleMonthChange: (newMonth: Date) => void
  ) => {
    const nepaliDate = toNepaliDate(currentMonth);
    let newMonth = nepaliDate.getBS().month - 1;
    let newYear = nepaliDate.getBS().year;
    
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    
    const newDate = getEnglishDateFromNepaliBS(newYear, newMonth, 1);
    handleMonthChange(newDate);
  };

  const handleNextMonth = (
    currentMonth: Date,
    handleMonthChange: (newMonth: Date) => void
  ) => {
    const nepaliDate = toNepaliDate(currentMonth);
    let newMonth = nepaliDate.getBS().month + 1;
    let newYear = nepaliDate.getBS().year;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    
    const newDate = getEnglishDateFromNepaliBS(newYear, newMonth, 1);
    handleMonthChange(newDate);
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: (props) => {
          // Type cast props to access navigate function properties
          const iconProps = props as unknown as { 
            month: Date;
            onClick: (newMonth: Date) => void 
          };
          
          return (
            <ChevronLeft 
              className="h-4 w-4" 
              onClick={(e) => {
                e.stopPropagation();
                if (iconProps.onClick && iconProps.month) {
                  // Create a wrapper function that calls handlePrevMonth with the correct types
                  handlePrevMonth(iconProps.month, iconProps.onClick);
                }
              }}
            />
          );
        },
        IconRight: (props) => {
          // Type cast props to access navigate function properties
          const iconProps = props as unknown as { 
            month: Date;
            onClick: (newMonth: Date) => void 
          };
          
          return (
            <ChevronRight 
              className="h-4 w-4" 
              onClick={(e) => {
                e.stopPropagation();
                if (iconProps.onClick && iconProps.month) {
                  // Create a wrapper function that calls handleNextMonth with the correct types
                  handleNextMonth(iconProps.month, iconProps.onClick);
                }
              }}
            />
          );
        },
        Caption: ({ displayMonth }) => (
          <div className="flex justify-center items-center h-9 relative">
            <span className="text-sm font-medium">
              {formatCaption(displayMonth)}
            </span>
          </div>
        ),
      }}
      formatters={{
        formatDay,
      }}
      footer={
        <div className="mt-3 text-xs text-center text-muted-foreground">
          Today (Nepali): {formatNepaliDateShort(today)}
        </div>
      }
      {...props}
    />
  );
}
NepaliCalendar.displayName = "NepaliCalendar";

export { NepaliCalendar };
