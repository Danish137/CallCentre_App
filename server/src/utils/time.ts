/**
 * Consistently format dates and times in IST (Asia/Kolkata).
 */
export function getISTTime(dateInput: Date | string | number = new Date()): string {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  return d.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getISTDateTime(dateInput: Date | string | number = new Date()): string {
  const time = getISTTime(dateInput);
  return `Today ${time}`;
}

