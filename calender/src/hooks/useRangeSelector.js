import { useState, useCallback } from 'react';

const useRangeSelector = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [step, setStep] = useState(0);

  const handleDayClick = useCallback((date) => {
    if (step === 0) {
      setStartDate(date);
      setEndDate(null);
      setStep(1);
    } 
    else if (step === 1) {
      if (date.getTime() === startDate.getTime()) {
        setStartDate(null);
        setEndDate(null);
        setStep(0);
        return;
      }
      const [s, e] = date < startDate ? [date, startDate] : [startDate, date];
      setStartDate(s);
      setEndDate(e);
      setStep(2);
    } else {
      setStartDate(null);
      setEndDate(null);
      setHoverDate(null);
      setStep(0);
    }
  }, [step, startDate]);

  const handleDayHover = useCallback((date) => {
    if (step === 1) setHoverDate(date);
  }, [step]);

  const handleDayLeave = useCallback(() => {
    setHoverDate(null);
  }, []);

  const reset = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    setHoverDate(null);
    setStep(0);
  }, []);

  const sameDay = (a, b) => a && b && a.getTime() === b.getTime();

  const isStart = (date) => sameDay(date, startDate);
  const isEnd   = (date) => sameDay(date, endDate);

  const isInRange = (date) => {
    if (!startDate || !endDate) return false;
    return date > startDate && date < endDate;
  };

  const isHoverRange = (date) => {
    if (step !== 1 || !startDate || !hoverDate) return false;
    const lo = hoverDate < startDate ? hoverDate : startDate;
    const hi = hoverDate < startDate ? startDate : hoverDate;
    return date > lo && date < hi;
  };

  const isHoverStart = (date) => step === 1 && sameDay(date, hoverDate) && hoverDate < startDate;
  const isHoverEnd   = (date) => step === 1 && sameDay(date, hoverDate) && hoverDate > startDate;

  return {
    startDate,
    endDate,
    hoverDate,
    step,
    reset,
    handleDayClick,
    handleDayHover,
    handleDayLeave,
    isStart,
    isEnd,
    isInRange,
    isHoverRange,
    isHoverStart,
    isHoverEnd,
  };
};

export default useRangeSelector;
