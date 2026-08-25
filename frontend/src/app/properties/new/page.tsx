'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { showAlert } from '@/lib/alerts';
import styles from './propertyForm.module.css';

export default function NewPropertyPage() {
    const { token } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Cabañas');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [pricePerNight, setPricePerNight] = useState('');
    const [maxGuests, setMaxGuests] = useState('');
    const [images, setImages] = useState<string[]>(['']);

    const addImageInput = () => {
        setImages([...images, '']);
    };
    const removeImageInput = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            showAlert('Atención', 'Debes iniciar sesión para publicar', 'warning');
            return;
        }

        const imagesArray = images.map(img => img.trim()).filter(img => img !== '');

        try {
            await apiFetch('/properties', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    title,
                    category,
                    location,
                    description,
                    pricePerNight: parseFloat(pricePerNight),
                    maxGuests: parseInt(maxGuests),
                    images: imagesArray,
                }),
            });

            showAlert('¡Éxito!', 'Propiedad publicada correctamente', 'success');
            router.push('/');
        } catch (error: any) {
            showAlert('Error', error.message || 'No se pudo publicar la propiedad', 'error');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Publicar Nueva Propiedad</h1>
            <form onSubmit={handleSubmit} className={styles.form}>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Título de la propiedad</label>
                    <input
                        type="text" required
                        className={styles.input}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ej: Cabaña con vista al lago"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Categoría</label>
                    <select className={styles.input} value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Cabañas">Cabañas</option>
                        <option value="Casas">Casas</option>
                        <option value="Departamentos">Departamentos</option>
                        <option value="Lofts">Lofts</option>
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Ubicación</label>
                    <input
                        type="text" required
                        className={styles.input}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ej: Valle de Bravo, México"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Descripción</label>
                    <textarea
                        required
                        className={styles.textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe las comodidades, qué incluye, etc."
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Precio por noche (MXN)</label>
                        <input
                            type="number" required min="1" step="0.01"
                            className={styles.input}
                            value={pricePerNight}
                            onChange={(e) => setPricePerNight(e.target.value)}
                            placeholder="1500.00"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Máximo de huéspedes</label>
                        <input
                            type="number" required min="1"
                            className={styles.input}
                            value={maxGuests}
                            onChange={(e) => setMaxGuests(e.target.value)}
                            placeholder="4"
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>URLs de imágenes (agrega varias)</label>
                    {images.map((img, index) => (
                        <div key={index} className={styles.imageRow}>
                            <input
                                type="text"
                                className={styles.input}
                                value={img}
                                onChange={(e) => handleImageChange(index, e.target.value)}
                                placeholder={`URL de imagen ${index + 1}`}
                            />
                            <button
                                type="button"
                                onClick={() => removeImageInput(index)}
                                className={styles.removeBtn}
                                disabled={images.length === 1}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addImageInput} className={styles.addBtn}>
                        + Agregar otra imagen
                    </button>
                </div>

                <button type="submit" className={styles.submitBtn}>Publicar Propiedad</button>
            </form>
        </div>
    );
}