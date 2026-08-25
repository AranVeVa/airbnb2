'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { showAlert } from '@/lib/alerts';
import styles from '../new/propertyForm.module.css';

interface Property {
    id: string | number;
    title: string;
    category: string;
    location: string;
    description: string;
    pricePerNight: number;
    maxGuests: number;
    images: string[];
}

function EditPropertyContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const { token } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [pricePerNight, setPricePerNight] = useState('');
    const [maxGuests, setMaxGuests] = useState('');
    const [images, setImages] = useState<string[]>(['']);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || !token) return;
        apiFetch<Property>(`/properties/${id}`)
            .then(data => {
                setTitle(data.title);
                setCategory(data.category);
                setLocation(data.location);
                setDescription(data.description);
                setPricePerNight(String(data.pricePerNight));
                setMaxGuests(String(data.maxGuests));
                // Si no hay imágenes, ponemos un campo vacío, si hay, los ponemos
                setImages(data.images.length > 0 ? data.images : ['']);
                setLoading(false);
            })
            .catch(err => {
                showAlert('Error', 'No se pudo cargar la propiedad', 'error');
                setLoading(false);
            });
    }, [id, token]);

    const addImageInput = () => setImages([...images, '']);
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
        if (!token) return;
        const imagesArray = images.map(img => img.trim()).filter(img => img !== '');

        try {
            await apiFetch(`/properties/${id}`, {
                method: 'PUT',
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
            showAlert('¡Éxito!', 'Propiedad actualizada correctamente', 'success');
            router.push('/properties/mine');
        } catch (error: any) {
            showAlert('Error', error.message || 'No se pudo actualizar', 'error');
        }
    };

    if (loading) return <div className={styles.container}><p>Cargando...</p></div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Editar Propiedad</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Título</label>
                    <input type="text" required className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
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
                    <input type="text" required className={styles.input} value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Descripción</label>
                    <textarea required className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Precio por noche</label>
                        <input type="number" required min="1" step="0.01" className={styles.input} value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Máximo huéspedes</label>
                        <input type="number" required min="1" className={styles.input} value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Imágenes</label>
                    {images.map((img, index) => (
                        <div key={index} className={styles.imageRow}>
                            <input type="text" className={styles.input} value={img} onChange={(e) => handleImageChange(index, e.target.value)} placeholder={`URL ${index + 1}`} />
                            <button type="button" onClick={() => removeImageInput(index)} className={styles.removeBtn} disabled={images.length === 1}>✕</button>
                        </div>
                    ))}
                    <button type="button" onClick={addImageInput} className={styles.addBtn}>+ Agregar otra imagen</button>
                </div>

                <button type="submit" className={styles.submitBtn}>Guardar Cambios</button>
            </form>
        </div>
    );
}

export default function EditPropertyPage() {
    return (
        <Suspense fallback={<div className={styles.container}><p>Cargando...</p></div>}>
            <EditPropertyContent />
        </Suspense>
    );
}