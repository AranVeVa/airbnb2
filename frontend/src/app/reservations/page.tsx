'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { showAlert } from '@/lib/alerts';
import styles from './reservations.module.css';

interface Reservation {
    id: string | number;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    property: {
        title: string;
    };
}

const statusLabels: Record<string, string> = {
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    pending: 'Pendiente',
};

export default function ReservationsPage() {
    const { token } = useAuth();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState<string | number | null>(null);
    const [editStart, setEditStart] = useState('');
    const [editEnd, setEditEnd] = useState('');

    useEffect(() => {
        if (!token) return;
        apiFetch<Reservation[]>('/reservations/my-reservations', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(data => setReservations(data))
            .catch(err => console.error('Error al obtener reservas:', err))
            .finally(() => setLoading(false));
    }, [token]);

    const handleCancel = async (id: string | number) => {
        try {
            await apiFetch(`/reservations/${id}/cancel`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            showAlert('Cancelada', 'Reserva cancelada correctamente', 'success');
            setReservations(prev => prev.map(r =>
                r.id === id ? { ...r, status: 'cancelled' } : r
            ));
        } catch (error: any) {
            showAlert('Error', error.message || 'No se pudo cancelar', 'error');
        }
    };

    const handleEdit = (res: Reservation) => {
        setEditingId(res.id);
        setEditStart(res.startDate);
        setEditEnd(res.endDate);
    };

    const handleUpdate = async (e: React.FormEvent, id: string | number) => {
        e.preventDefault();
        try {
            await apiFetch(`/reservations/${id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify({ startDate: editStart, endDate: editEnd })
            });
            showAlert('Actualizada', 'Fechas modificadas correctamente', 'success');
            setEditingId(null);
            const updated = await apiFetch<Reservation[]>('/reservations/my-reservations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReservations(updated);
        } catch (error: any) {
            showAlert('Error', error.message || 'No se pudo actualizar', 'error');
        }
    };

    if (!token) return <div className={styles.container}><p className={styles.empty}>Debes iniciar sesión para ver tus reservas.</p></div>;
    if (loading) return <div className={styles.container}><p className={styles.empty}>Cargando reservas...</p></div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mis Reservas</h1>
            {reservations.length === 0 ? (
                <div className={styles.empty}>
                    <p>No tienes reservas aún.</p>
                    <Link href="/" className={styles.backLink}>Explorar alojamientos</Link>
                </div>
            ) : (
                <ul className={styles.list}>
                    {reservations.map(res => (
                        <li key={res.id} className={styles.item}>
                            {editingId === res.id ? (
                                <form onSubmit={(e) => handleUpdate(e, res.id)} className={styles.editForm}>
                                    <h3 className={styles.editTitle}>Editar fechas</h3>
                                    <div className={styles.editRow}>
                                        <label>Nueva Entrada</label>
                                        <input type="date" value={editStart} onChange={(e) => setEditStart(e.target.value)} required />
                                        <label>Nueva Salida</label>
                                        <input type="date" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} required />
                                    </div>
                                    <div className={styles.editActions}>
                                        <button type="submit" className={styles.saveBtn}>Guardar</button>
                                        <button type="button" onClick={() => setEditingId(null)} className={styles.cancelEditBtn}>Cancelar</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className={styles.itemHeader}>
                                        <h2 className={styles.itemTitle}>{res.property?.title || 'Propiedad'}</h2>
                                        <p className={styles.itemPrice}>${res.totalPrice}</p>
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <p><strong>Entrada:</strong> {new Date(res.startDate).toLocaleDateString()}</p>
                                        <p><strong>Salida:</strong> {new Date(res.endDate).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`${styles.status} ${res.status === 'confirmed' ? styles.confirmed :
                                        res.status === 'cancelled' ? styles.cancelled :
                                            styles.pending
                                        }`}>
                                        {statusLabels[res.status] || res.status}
                                    </span>

                                    {res.status !== 'cancelled' && (
                                        <div className={styles.actions}>
                                            <button onClick={() => handleEdit(res)} className={styles.editBtn}>Editar Fechas</button>
                                            <button onClick={() => handleCancel(res.id)} className={styles.cancelBtn}>Cancelar Reserva</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            <div className={styles.footer}>
                <Link href="/" className={styles.backLink}>← Volver al inicio</Link>
            </div>
        </div>
    );
}