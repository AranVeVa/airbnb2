'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { showAlert } from '@/lib/alerts';
import styles from '../auth.module.css';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password }),
            });
            showAlert('¡Cuenta creada!', 'Ya puedes iniciar sesión', 'success');
            router.push('/login');
        } catch (error: any) {
            showAlert('Error', error.message || 'No se pudo crear la cuenta', 'error');
        }
    };

    return (
        <div className={styles.authContainer}>
            <h1 className={styles.title}>Crear Cuenta</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Nombre completo</label>
                    <input
                        type="text"
                        required
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Correo Electrónico</label>
                    <input
                        type="email"
                        required
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Contraseña</label>
                    <input
                        type="password"
                        required
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className={styles.submitBtn}>Registrarse</button>
            </form>
            <p className={styles.footerText}>
                ¿Ya tienes cuenta? <Link href="/login" className={styles.link}>Inicia Sesión</Link>
            </p>
        </div>
    );
}