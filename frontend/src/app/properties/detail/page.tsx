'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { showAlert } from '@/lib/alerts';
import styles from './propertyDetail.module.css';

// 1. CORRECCIÓN DE LA INTERFAZ
interface Property {
    id: string | number;
    title: string;
    description: string;
    pricePerNight: number; // <--- Cambiado de 'price'
    images: string[];      // <--- Cambiado de 'imageUrl'
}

function DetailContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [property, setProperty] = useState<Property | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        apiFetch<Property>(`/properties/${id}`)
            .then(setProperty)
            .catch(() => showAlert('Error', 'No se pudo cargar la propiedad', 'error'));
    }, [id]);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return showAlert('Atención', 'Debes iniciar sesión para reservar', 'warning');
        if (!property) return;

        // 2. CALCULAR DÍAS Y PRECIO TOTAL (Obligatorio para el backend)
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 0) {
            return showAlert('Error', 'La fecha de salida debe ser posterior a la fecha de entrada', 'error');
        }
        
        const totalPrice = property.pricePerNight * diffDays;

        try {
            await apiFetch('/reservations', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                // 3. ENVIAMOS EL totalPrice EN EL BODY
                body: JSON.stringify({ 
                    propertyId: id, 
                    startDate, 
                    endDate, 
                    totalPrice 
                }),
            });
            showAlert('¡Éxito!', 'Reserva realizada correctamente', 'success');
            router.push('/reservations');
        } catch (error: any) {
            showAlert('Error', error.message || 'No se pudo hacer la reserva', 'error');
        }
    };

    if (!id) return <div className={styles.container}><p>ID de propiedad no especificado.</p></div>;
    if (!property) return <div className={styles.container}><p>Cargando detalles...</p></div>;

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div>
                    {/* 4. TOMAR LA PRIMERA IMAGEN DEL ARRAY */}
                    <img 
                        src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/600x350'} 
                        alt={property.title} 
                        className={styles.image} 
                    />
                    <h1 className={styles.title}>{property.title}</h1>
                    {/* 5. USAR pricePerNight */}
                    <p className={styles.price}>${property.pricePerNight} / noche</p>
                    <p className={styles.description}>{property.description}</p>
                </div>
                <div className={styles.bookingCard}>
                    <h2 className={styles.cardTitle}>Reservar este alojamiento</h2>
                    <form onSubmit={handleBooking} className={styles.form}>
                        <div>
                            <label className={styles.label}>Fecha de Entrada</label>
                            <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className={styles.input} />
                        </div>
                        <div>
                            <label className={styles.label}>Fecha de Salida</label>
                            <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className={styles.input} />
                        </div>
                        <button type="submit" className={styles.submitBtn}>Confirmar Reserva</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function PropertyDetailPage() {
    return (
        <Suspense fallback={<div className={styles.container}><p>Cargando...</p></div>}>
            <DetailContent />
        </Suspense>
    );
}