'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { showAlert } from '@/lib/alerts';
import { getImageUrl } from '@/lib/image'; // <-- IMPORTAMOS EL HELPER
import styles from './propertyDetail.module.css';

interface Property {
    id: string | number;
    title: string;
    description: string;
    pricePerNight: number;
    images: string[];
    rating: number;        // <-- Agregamos rating
    maxGuests: number;     // <-- Agregamos maxGuests
    location: string;      // <-- Agregamos location
    category: string;      // <-- Agregamos category
}

function DetailContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [property, setProperty] = useState<Property | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activeImg, setActiveImg] = useState(0); // <-- Estado para la galería
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        apiFetch<Property>(`/properties/${id}`)
            .then(data => {
                setProperty(data);
                setActiveImg(0); // Reiniciar imagen al cargar
            })
            .catch(() => showAlert('Error', 'No se pudo cargar la propiedad', 'error'));
    }, [id]);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return showAlert('Atención', 'Debes iniciar sesión para reservar', 'warning');
        if (!property) return;

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

    async function pay() {
        try {
            const respuesta = await fetch("/api/checkout", {
                method: "POST",
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json().catch(() => ({}));
                throw new Error(errorData.error || `Error ${respuesta.status}`);
            }

            const { url } = await respuesta.json();
            // Verificar que url exista antes de redirigir
            if (!url) {
                throw new Error('No se pudo generar la sesión de pago');
            }

            window.location.href = url; // Redirige a Stripe Checkout

        } catch (error: any) {
            showAlert('Error de pago', error.message || 'No se pudo generar la sesión de pago', 'error');
        }

    }

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div>
                    {/* GALERÍA DE IMÁGENES */}
                    <div className={styles.gallery}>
                        <img
                            src={getImageUrl(property.images?.[activeImg])}
                            alt={property.title}
                            className={styles.mainImage}
                        />
                        {property.images && property.images.length > 1 && (
                            <div className={styles.thumbnails}>
                                {property.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={getImageUrl(img)}
                                        alt={`Imagen ${index + 1}`}
                                        className={`${styles.thumb} ${index === activeImg ? styles.activeThumb : ''}`}
                                        onClick={() => setActiveImg(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <h1 className={styles.title}>{property.title}</h1>

                    {/* INFORMACIÓN EXTRA (Rating, Ubicación, Huéspedes) */}
                    <div className={styles.metaInfo}>
                        <p className={styles.rating}>⭐ {property.rating} / 5</p>
                        <p className={styles.metaText}>{property.category} · {property.location} · Hasta {property.maxGuests} huéspedes</p>
                    </div>

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
                        <button type="button" onClick={pay} className={styles.submitBtn}>Pagar con Stripe</button>
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