import React, { useState } from 'react';
import {
  Calendar as CalIcon,
  ChevronLeft,
  ChevronRight,
  Mail,
  Plus,
  Clock,
  Users,
} from 'lucide-react';
import { CalendarEvent } from '../../types';
import styles from './CalendarView.module.css';

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent?: (event: Partial<CalendarEvent>) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onAddEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 5)); // November 2026
  const [selectedDay, setSelectedDay] = useState<number>(5);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of month & total days
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleJumpToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today.getDate());
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days grid cells
  const dayCells = [];
  // Empty offset cells
  for (let i = 0; i < firstDayOfWeek; i++) {
    dayCells.push(<div key={`empty-${i}`} className={`${styles.dayCell} ${styles.dayCellEmpty}`} />);
  }

  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = events.filter((e) => e.day === day);
    const isToday = day === 5 && month === 10 && year === 2026;
    const isSelected = day === selectedDay;

    dayCells.push(
      <div
        key={`day-${day}`}
        className={`${styles.dayCell} ${isToday ? styles.dayCellToday : ''} ${
          isSelected ? styles.dayCellSelected : ''
        }`}
        onClick={() => setSelectedDay(day)}
      >
        <div className={`${styles.dayNumber} ${isToday ? styles.dayNumberToday : ''}`}>
          {day}
        </div>
        {dayEvents.length > 0 && (
          <div className={styles.dotsRow}>
            {dayEvents.map((ev, idx) => {
              let dotColor = '#10b981';
              if (ev.type === 'coaching') dotColor = '#7c3aed';
              if (ev.type === 'training') dotColor = '#f59e0b';
              if (ev.type === 'calls') dotColor = '#0284c7';
              return (
                <span
                  key={idx}
                  className={styles.eventDot}
                  style={{ backgroundColor: dotColor }}
                  title={ev.title}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const selectedDayEvents = events.filter((e) => e.day === selectedDay);

  return (
    <div className={styles.calContainer}>
      {/* Title */}
      <div className={styles.calHeader}>
        <div>
          <h1 className={styles.title}>
            <CalIcon size={22} color="#185fa5" />
            <span>Shift Calendar & Invites</span>
          </h1>
          <div className={styles.subtitle}>
            Mirrored from your exchange mailbox — invites created here sync automatically
          </div>
        </div>
      </div>

      {/* Sync Banner */}
      <div className={styles.syncBanner}>
        <Mail size={18} color="#185fa5" />
        <span>
          Store visits, 1-on-1 coaching sessions, and meeting invites all sync directly to your mailbox.
        </span>
      </div>

      {/* Month Card */}
      <div className={styles.calGridCard}>
        {/* Navigation Bar */}
        <div className={styles.controlsBar}>
          <button
            className={styles.navArrowBtn}
            onClick={handlePrevMonth}
            title="Previous month"
          >
            <ChevronLeft size={18} />
          </button>

          <div className={styles.monthLabel}>
            {monthNames[month]} {year}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className={styles.todayBtn} onClick={handleJumpToday}>
              Today
            </button>
            <button
              className={styles.navArrowBtn}
              onClick={handleNextMonth}
              title="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Weekday labels */}
        <div className={styles.weekdaysRow}>
          {weekdays.map((wd) => (
            <div key={wd}>{wd}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className={styles.monthDaysGrid}>{dayCells}</div>
      </div>

      {/* Selected Day / Upcoming Events Section */}
      <div className={styles.upcomingSection}>
        <div className={styles.upcomingTitle}>
          {selectedDay
            ? `Events for ${monthNames[month]} ${selectedDay}, ${year}`
            : 'Upcoming Shift Events'}
        </div>

        <div className={styles.eventsList}>
          {selectedDayEvents.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: 13, padding: '12px 0' }}>
              No scheduled events for day {selectedDay}. Click on days with indicator dots to view sessions.
            </div>
          ) : (
            selectedDayEvents.map((ev, idx) => (
              <div key={idx} className={styles.eventCard}>
                <div className={styles.eventLeft}>
                  <div className={styles.eventDateBox}>
                    <span className={styles.eventDayNum}>{ev.day}</span>
                    <span className={styles.eventMonthStr}>
                      {monthNames[month].slice(0, 3)}
                    </span>
                  </div>
                  <div>
                    <div className={styles.eventTitle}>{ev.title}</div>
                    <div className={styles.eventMeta}>{ev.meta}</div>
                  </div>
                </div>

                <div className={styles.eventTimeBadge}>
                  <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                  <span>{ev.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

