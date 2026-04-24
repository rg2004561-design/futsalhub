import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Upload, X } from 'lucide-react';
import AdminLayout from '@/components/admin-layout';

interface Photo {
    id: number;
    path: string;
}

interface Court {
    id: number;
    name: string;
    slug: string;
    description: string;
    price_per_hour: number | string;
    facilities: string[];
    open_time: string;
    close_time: string;
    is_active: boolean;
    photos: Photo[];
}

interface EditCourtProps {
    court: Court;
}

export default function CourtEdit({ court }: EditCourtProps) {
    const { data, setData, post, errors, processing } = useForm({
        name: court.name,
        slug: court.slug,
        description: court.description,
        price_per_hour: court.price_per_hour ? Number(court.price_per_hour) : 0,
        facilities: court.facilities,
        open_time: court.open_time?.slice(0, 5),
        close_time: court.close_time?.slice(0, 5),
        is_active: court.is_active,
        _method: 'put',
        new_photos: [] as File[],
    });

    const [facilityInput, setFacilityInput] = useState('');
    const [photoPreview, setPhotoPreview] = useState<string[]>([]);
    const [removedPhotos, setRemovedPhotos] = useState<number[]>([]);

    const handleAddFacility = () => {
        if (facilityInput.trim()) {
            setData('facilities', [...data.facilities, facilityInput]);
            setFacilityInput('');
        }
    };

    const handleRemoveFacility = (index: number) => {
        setData('facilities', data.facilities.filter((_, i) => i !== index));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setData('new_photos', [...data.new_photos, ...files]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveNewPhoto = (index: number) => {
        setData('new_photos', data.new_photos.filter((_, i) => i !== index));
        setPhotoPreview(photoPreview.filter((_, i) => i !== index));
    };

    const handleRemoveExistingPhoto = (photoId: number) => {
        setRemovedPhotos([...removedPhotos, photoId]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PUT');
        
        // Add all form fields
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price_per_hour', data.price_per_hour.toString());
        formData.append('open_time', data.open_time);
        formData.append('close_time', data.close_time);
        formData.append('is_active', data.is_active ? '1' : '0');
        
        // Add facilities
        data.facilities.forEach((facility, index) => {
            formData.append(`facilities[${index}]`, facility);
        });
        
        // Add removed photos
        removedPhotos.forEach(photoId => {
            formData.append('removed_photos[]', photoId.toString());
        });
        
        // Add new photos
        data.new_photos.forEach((photo: File) => {
            formData.append('new_photos[]', photo);
        });
        
        router.post(route('admin.courts.update', court.id), formData, {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Lapangan</h1>
                    <p className="text-gray-600 mt-1">{court.name}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-lg shadow p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Informasi Dasar</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lapangan</label>
                            <input
                                name="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                            <textarea
                                name="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Harga per Jam (Rp)</label>
                            <input
                                name="price_per_hour"
                                type="number"
                                value={data.price_per_hour}
                                onChange={(e) => setData('price_per_hour', e.target.value ? Number(e.target.value) : 0)}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${
                                    errors.price_per_hour ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.price_per_hour && <p className="text-red-600 text-sm mt-1">{errors.price_per_hour}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jam Buka</label>
                                <input
                                    name="open_time"
                                    type="time"
                                    value={data.open_time}
                                    onChange={(e) => setData('open_time', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jam Tutup</label>
                                <input
                                    name="close_time"
                                    type="time"
                                    value={data.close_time}
                                    onChange={(e) => setData('close_time', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                name="is_active"
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="w-4 h-4"
                                id="is_active"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                Lapangan Aktif
                            </label>
                        </div>
                    </div>

                    {/* Facilities */}
                    <div className="bg-white rounded-lg shadow p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Fasilitas</h2>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={facilityInput}
                                onChange={(e) => setFacilityInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddFacility()}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                placeholder="Contoh: AC, Parkir, Kantin"
                            />
                            <button
                                type="button"
                                onClick={handleAddFacility}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                            >
                                Tambah
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {data.facilities.map((facility, i) => (
                                <div key={i} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                    <span>{facility}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFacility(i)}
                                        className="hover:text-blue-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Existing Photos */}
                    {court.photos.length > 0 && (
                        <div className="bg-white rounded-lg shadow p-6 space-y-4">
                            <h2 className="text-xl font-bold text-gray-900">Foto Saat Ini</h2>

                            <div className="grid grid-cols-4 gap-4">
                                {court.photos.filter(photo => !removedPhotos.includes(photo.id)).map((photo) => (
                                    <div key={photo.id} className="relative">
                                        <img src={`/storage/${photo.path}`} alt="Court" className="w-full h-24 object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExistingPhoto(photo.id)}
                                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Photos */}
                    <div className="bg-white rounded-lg shadow p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Tambah Foto Baru</h2>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                                id="photo-input"
                            />
                            <label htmlFor="photo-input" className="cursor-pointer">
                                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                                <p className="text-gray-600">Klik atau drag foto di sini</p>
                            </label>
                        </div>

                        {photoPreview.length > 0 && (
                            <div className="grid grid-cols-3 gap-4">
                                {photoPreview.map((preview, i) => (
                                    <div key={i} className="relative">
                                        <img src={preview} alt={`Preview ${i}`} className="w-full h-32 object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveNewPhoto(i)}
                                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                        <a
                            href={route('admin.courts.index')}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition text-center"
                        >
                            Batal
                        </a>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
