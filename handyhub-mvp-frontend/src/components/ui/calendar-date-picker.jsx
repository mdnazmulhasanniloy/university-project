import React, { useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays } from "lucide-react";

export default function CalendarDatePicker({ field, disabledBeforeToday }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(undefined);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleYearChange = (year) => {
    setSelectedYear(parseInt(year));
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(months.indexOf(month));
  };

  const handlePrevYear = () => {
    setSelectedYear((prev) => Math.max(prev - 1, currentYear - 99));
  };

  const handleNextYear = () => {
    setSelectedYear((prev) => Math.min(prev + 1, currentYear));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) {
      setSelectedYear(date.getFullYear());
      setSelectedMonth(date.getMonth());
    }
  };

  // Function to disable dates before today
  const isDateDisabledBeforeToday = (date) => {
    return date < new Date().setHours(0, 0, 0, 0); // Disable dates before today
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`h-9 w-full justify-start rounded-md border !border-[#d0d0d0] py-5 text-left text-base font-normal shadow-none ${!field.value ? "text-muted-foreground" : ""}`}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {field.value ? format(field.value, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 font-dm-sans" align="start">
        <div className="flex items-center justify-between p-3">
          <Button variant="outline" size="icon" onClick={handlePrevYear}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={selectedYear.toString()} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleNextYear}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="border-t p-3">
          <Select
            value={months[selectedMonth]}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={months[selectedMonth]} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={(date) => {
            field.onChange(date);
            handleDateSelect(date);
          }}
          month={new Date(selectedYear, selectedMonth)}
          onMonthChange={(newMonth) => {
            setSelectedMonth(newMonth.getMonth());
            setSelectedYear(newMonth.getFullYear());
          }}
          initialFocus
          disabled={disabledBeforeToday ? isDateDisabledBeforeToday : false}
        />
      </PopoverContent>
    </Popover>
  );
}
