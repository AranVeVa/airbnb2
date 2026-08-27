'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { token, logout } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim() === '') return;
        router.push(`/?location=${encodeURIComponent(searchTerm.trim())}`);
    };

    return (
        <nav className={styles.navbar}>
            <Link href="/" className={styles.logo}>airbnb2</Link>

            <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                    type="text"
                    placeholder="Buscar por destino..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchBtn}>Buscar</button>
            </form>

            <div className={styles.navLinks}>
                {token ? (
                    <>
                        <Link href="/reservations" className={styles.linkText}>Mis Reservas</Link>
                        <Link href="/properties/mine" className={styles.linkText}>Mis Propiedades</Link>
                        <Link href="/properties/new" className={styles.btnPrimary}>Publicar Propiedad</Link>
                        <button onClick={logout} className={styles.btnPrimary}>Cerrar Sesión</button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className={styles.linkText}>Iniciar Sesión</Link>
                        <Link href="/register" className={styles.btnPrimary}>Registrarse</Link>
                    </>
                )}
            </div>
        </nav>
    );
}