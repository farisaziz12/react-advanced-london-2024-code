import { useState, useRef, useCallback, useEffect } from "react";

interface TimeMeasurementResult {
  time: string | null; // Render time in milliseconds as a string or null if not yet measured
  endMeasurement: () => void; // Call this function to end the measurement
}

export function useTimeRecording(name?: string): TimeMeasurementResult {
  const [time, setTime] = useState<string | null>(null);
  const startTimeRef = useRef<number>(performance.now());

  const endMeasurement = useCallback(() => {
    setTime((performance.now() - startTimeRef.current).toFixed(2));

    if (name && time) {
      console.log(`${name} took:`, `${Number(time) / 1000} seconds`);
    }
  }, [name, time]);

  return { time, endMeasurement };
}
