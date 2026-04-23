import React, { useState } from 'react';
import AdminLayout from '@/components/admin-layout';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Booking {
    id: number;
    user: { name: string };
    court: { name: string };
    booking_date: string;
    status: string;
}

interface CalendarProps {
    bookings: Booking[];
}

export default function Calendar({ bookings }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthYear = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    const getBookingsForDate = (day: number) => {
        const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
        return bookings.filter((b) => b.booking_date.startsWith(dateStr));
    };

    const calendarDays = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Jadwal Booking</h1>
                </div>

                {/* Calendar */}
                <div className="bg-white rounded-lg shadow p-6">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={prevMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900">{monthYear}</h2>
                        <button
                            onClick={nextMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                            <div key={day} className="text-center font-bold text-gray-700 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((day, index) => {
                            const dayBookings = day ? getBookingsForDate(day) : [];
                            return (
                                <div
                                    key={index}
                                    className={`min-h-24 p-2 rounded-lg border ${
                                        !day
                                            ? 'bg-gray-50 border-gray-200'
                                            : dayBookings.length > 0
                                            ? 'bg-blue-50 border-blue-300'
                                            : 'bg-white border-gray-200 hover:border-blue-300'
                                    }`}
                                >
                                    {day && (
                                        <>
                                            <p className="font-bold text-gray-900 mb-1">{day}</p>
                                            <div className="space-y-1">
                                                {dayBookings.slice(0, 2).map((booking) => (
                                                    <div
                                                        key={booking.id}
                                                        className="text-xs bg-blue-200 text-blue-900 p-1 rounded truncate"
                                                        title={`${booking.court.name} - ${booking.user.name}`}
                                                    >
                                                        {booking.court.name}
                                                    </div>
                                                ))}
                                                {dayBookings.length > 2 && (
                                                    <p className="text-xs text-gray-600">+{dayBookings.length - 2} lainnya</p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold text-gray-900 mb-3">Legenda</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-50 border border-blue-300 rounded"></div>
                            <span className="text-gray-700">Hari dengan booking</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
                            <span className="text-gray-700">Hari kosong</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
