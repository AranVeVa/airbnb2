'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { showAlert } from '@/lib/alerts';
import styles from '../auth.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await apiFetch<{ token: string, user: { role: string } }>('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            login(res.token, res.user.role);
            showAlert('¡Bienvenido!', 'Sesión iniciada correctamente', 'success');
            router.push('/');
        } catch (error: any) {
            showAlert('Error', error.message || 'Usuario o contraseña incorrectos.', 'error');
        }
    };

    return (
        <div className={styles.authContainer}>
            <h1 className={styles.title}>Iniciar Sesión</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
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
                <button type="submit" className={styles.submitBtn}>Entrar</button>
            </form>
            <p className={styles.footerText}>
                ¿No tienes cuenta? <Link href="/register" className={styles.link}>Regístrate</Link>
            </p>
        </div>
    );
}