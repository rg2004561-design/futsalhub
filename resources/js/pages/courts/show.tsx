import React, { useState, useEffect } from 'react';
import { useForm, Link, router } from '@inertiajs/react';
import { TopbarNavigation } from '@/components/topbar-navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimeSlot {
    start_time: string;
    end_time: string;
    price: number;
    available: boolean;
}

interface Court {
    id: number;
    name: string;
    slug: string;
    description: string;
    facilities: string[];
    photos: any[];
}

interface CourtShowProps {
    court: Court;
    availableSlots: TimeSlot[];
}

export default function CourtShow({ court, availableSlots }: CourtShowProps) {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [slots, setSlots] = useState<TimeSlot[]>(availableSlots);
    const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Fetch available slots when date changes
    useEffect(() => {
        if (selectedDate) {
            setIsLoadingSlots(true);
            const params = new URLSearchParams({ date: selectedDate });
            fetch(`/courts/${court.slug}?${params.toString()}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.availableSlots) {
                        setSlots(data.availableSlots);
                    } else {
                        setSlots([]);
                    }
                })
                .catch(err => {
                    console.error('Error fetching slots:', err);
                    setSlots([]);
                })
                .finally(() => setIsLoadingSlots(false));
        } else {
            setSlots([]);
        }
    }, [selectedDate, court.slug]);

    // Handle slot selection (card UI - dapat memilih multiple slots)
    const toggleSlotSelection = (slot: TimeSlot) => {
        const exists = selectedSlots.some(
            (s) => s.start_time === slot.start_time && s.end_time === slot.end_time
        );

        if (exists) {
            setSelectedSlots(selectedSlots.filter((s) => !(s.start_time === slot.start_time && s.end_time === slot.end_time)));
        } else {
            setSelectedSlots([...selectedSlots, slot]);
        }
    };

    const totalPrice = selectedSlots.reduce((sum, slot) => sum + slot.price, 0);

    const handleBooking = () => {
        // Show loading/redirect to booking form
        if (selectedSlots.length > 0) {
            // Pass to booking create page
            const params = new URLSearchParams({
                court_id: court.id.toString(),
                booking_date: selectedDate,
                slots: JSON.stringify(selectedSlots),
            });
            
            router.get(`/bookings/create?${params}`);
        }
    };

    // Get minimum date (today + 1)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gray-50">
            <TopbarNavigation />
            
            {/* Header */}
            <div className="bg-white shadow mt-16">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <Link href={route('courts.index')} className="text-blue-600 hover:text-blue-800">← Kembali</Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">{court.name}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Court Info & Gallery */}
                    <div className="lg:col-span-2">
                        {/* Gallery */}
                        {court.photos.length > 0 && (
                            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                                {/* Main Image */}
                                <div className="relative bg-gray-100">
                                    <img
                                        src={`/storage/${court.photos[currentPhotoIndex].path}`}
                                        alt={`${court.name} - Foto ${currentPhotoIndex + 1}`}
                                        className="w-full h-96 object-cover"
                                    />
                                    
                                    {/* Image Counter */}
                                    <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                                        {currentPhotoIndex + 1} / {court.photos.length}
                                    </div>

                                    {/* Navigation Arrows */}
                                    {court.photos.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setCurrentPhotoIndex((prev) => 
                                                    prev === 0 ? court.photos.length - 1 : prev - 1
                                                )}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition"
                                                aria-label="Foto sebelumnya"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentPhotoIndex((prev) => 
                                                    prev === court.photos.length - 1 ? 0 : prev + 1
                                                )}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition"
                                                aria-label="Foto berikutnya"
                                            >
                                                <ChevronRight size={24} />
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Thumbnails */}
                                {court.photos.length > 1 && (
                                    <div className="p-4 bg-white">
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {court.photos.map((photo, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentPhotoIndex(idx)}
                                                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition ${
                                                        currentPhotoIndex === idx
                                                            ? 'border-blue-600'
                                                            : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                >
                                                    <img
                                                        src={`/storage/${photo.path}`}
                                                        alt={`Thumbnail ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Description */}
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Tentang Lapangan</h2>
                            <p className="text-gray-600 mt-2">{court.description}</p>

                            {/* Facilities */}
                            <div className="mt-4">
                                <h3 className="font-semibold text-gray-900">Fasilitas:</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {court.facilities?.map((facility, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                                        >
                                            ✓ {facility}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Form */}
                    <div>
                        <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Pesan Lapangan</h2>

                            {/* Date Picker */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700">Pilih Tanggal</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={minDate}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                />
                            </div>

                            {/* Time Slots - Card UI */}
                            {isLoadingSlots && selectedDate && (
                                <div className="mb-6 text-center py-4">
                                    <p className="text-gray-600">Memuat jam tersedia...</p>
                                </div>
                            )}
                            
                            {selectedDate && !isLoadingSlots && slots.length === 0 && (
                                <div className="mb-6 bg-yellow-50 p-4 rounded-lg text-center">
                                    <p className="text-yellow-800 text-sm">Tidak ada jam tersedia untuk tanggal ini</p>
                                </div>
                            )}

                            {selectedDate && !isLoadingSlots && slots.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Pilih Jam</label>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {slots.map((slot, idx) => {
                                            const isSelected = selectedSlots.some(
                                                (s) => s.start_time === slot.start_time && s.end_time === slot.end_time
                                            );

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => slot.available && toggleSlotSelection(slot)}
                                                    disabled={!slot.available}
                                                    className={`w-full p-3 rounded-lg border-2 transition ${
                                                        isSelected
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : slot.available
                                                            ? 'border-gray-200 bg-white hover:border-blue-300'
                                                            : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium text-gray-900">
                                                            {slot.start_time} - {slot.end_time}
                                                        </span>
                                                        <span className="text-blue-600 font-semibold">
                                                            Rp {slot.price.toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                    {!slot.available && (
                                                        <span className="text-xs text-red-600 mt-1 block">Sudah dipesan</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Selected Summary */}
                            {selectedSlots.length > 0 && (
                                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-900">Ringkasan</h3>
                                    <div className="mt-2 space-y-1 text-sm text-gray-700">
                                        {selectedSlots.map((slot, idx) => (
                                            <div key={idx} className="flex justify-between">
                                                <span>{slot.start_time} - {slot.end_time}</span>
                                                <span>Rp {slot.price.toLocaleString('id-ID')}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-blue-200 mt-2 pt-2 font-bold flex justify-between text-gray-900">
                                        <span>Total:</span>
                                        <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <button
                                onClick={handleBooking}
                                disabled={!selectedDate || selectedSlots.length === 0}
                                className={`w-full py-3 rounded-lg font-semibold transition ${
                                    selectedDate && selectedSlots.length > 0
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                }`}
                            >
                                Lanjut ke Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
