'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { showAlert } from '@/lib/alerts';
import styles from './becomeHost.module.css';

export default function BecomeHostPage() {
    const { token, role, login } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Si ya es admin, muestra mensaje de que ya es propietario
    if (role === 'admin') {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Ya eres propietario</h1>
                <p className={styles.text}>Puedes publicar tus propiedades en cualquier momento.</p>
                <button onClick={() => router.push('/properties/new')} className={styles.btn}>
                    Publicar Propiedad
                </button>
            </div>
        );
    }

    const handleBecomeHost = async () => {
        if (!token) return;
        setLoading(true);
        try {
            // cambiar a admin
            const res = await apiFetch<{ role: string }>('/auth/become-host', {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });


            login(token, res.role);

            showAlert('¡Bienvenido!', 'Ahora eres propietario', 'success');
            router.push('/properties/new');
        } catch (error: any) {
            showAlert('Error', error.message || 'No se pudo activar', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Únete como Propietario</h1>
            <p className={styles.text}>
                Si quieres publicar tus propiedades en nuestra plataforma, activa tu cuenta como propietario.
            </p>
            <button onClick={handleBecomeHost} disabled={loading} className={styles.btn}>
                {loading ? 'Procesando...' : 'Activar Propietario'}
            </button>
            <p className={styles.note}>* Esta acción no se puede deshacer fácilmente.</p>
        </div>
    );
}