'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { showAlert } from '@/lib/alerts';
import styles from './mine.module.css';

interface Property {
    id: string | number;
    title: string;
    pricePerNight: number;
    images: string[];
    hostId: string | number;
}

export default function MyPropertiesPage() {
    const { token } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | number | null>(null);

    // Obtener el ID del usuario actual a través de /auth/me
    useEffect(() => {
        if (!token) return;
        apiFetch<{ id: string | number }>('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(data => setUserId(data.id))
            .catch(err => console.error('Error al obtener usuario:', err));
    }, [token]);

    // Obtener las propiedades y filtrar por hostId
    useEffect(() => {
        if (!token || !userId) return;
        apiFetch<Property[]>('/properties', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(data => {
                const myProps = data.filter(p => p.hostId === userId);
                setProperties(myProps);
            })
            .catch(err => console.error('Error al obtener propiedades:', err))
            .finally(() => setLoading(false));
    }, [token, userId]);

    const handleDelete = async (id: string | number) => {
        if (!confirm('¿Estás seguro de eliminar esta propiedad?')) return;
        try {
            await apiFetch(`/properties/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            showAlert('Eliminada', 'Propiedad eliminada correctamente', 'success');
            setProperties(prev => prev.filter(p => p.id !== id));
        } catch (error: any) {
            showAlert('Error', error.message || 'No se pudo eliminar', 'error');
        }
    };

    if (!token) return <div className={styles.container}><p className={styles.message}>Debes iniciar sesión para ver tus propiedades.</p></div>;
    if (loading) return <div className={styles.container}><p className={styles.message}>Cargando...</p></div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mis Propiedades</h1>
            {properties.length === 0 ? (
                <div className={styles.empty}>
                    <p>No tienes propiedades publicadas aún.</p>
                    <Link href="/properties/new" className={styles.btnPrimary}>Publicar Propiedad</Link>
                </div>
            ) : (
                <ul className={styles.list}>
                    {properties.map(prop => (
                        <li key={prop.id} className={styles.item}>
                            <img
                                src={prop.images?.[0] || 'https://via.placeholder.com/300x200'}
                                alt={prop.title}
                                className={styles.image}
                            />
                            <div className={styles.info}>
                                <h2 className={styles.itemTitle}>{prop.title}</h2>
                                <p className={styles.price}>${prop.pricePerNight} / noche</p>
                                <div className={styles.actions}>
                                    <Link href={`/properties/edit?id=${prop.id}`} className={styles.editBtn}>
                                        Editar
                                    </Link>
                                    <button onClick={() => handleDelete(prop.id)} className={styles.deleteBtn}>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}