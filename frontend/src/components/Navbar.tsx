'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFilters } from '@/context/FilterContext';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { token, role, logout } = useAuth();
    const { showFilters, setShowFilters } = useFilters();
    const router = useRouter();
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim() === '') return;
        router.push(`/?location=${encodeURIComponent(searchTerm.trim())}`);
    };

    const handleShowFilters = () => {
        setShowFilters(!showFilters);
        if (pathname !== '/') {
            router.push('/');
        }
    };

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        router.push('/login');
    };

    return (
        <nav className={styles.navbar}>
            <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>airbnb2</Link>

            <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                    type="text"
                    placeholder="Buscar por destino..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <button
                    type="button"
                    onClick={handleShowFilters}
                    className={styles.filterIconBtn}
                    aria-label="Filtrar búsqueda"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                    </svg>
                </button>
            </form>

            {/* Botón hamburguesa para móvil */}
            <button
                className={styles.hamburger}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menú"
            >
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
            </button>

            <div className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}>
                {token ? (
                    <>
                        <Link href="/reservations" className={styles.linkText} onClick={() => setMenuOpen(false)}>Mis Reservas</Link>

                        {role === 'admin' ? (
                            <>
                                <Link href="/properties/mine" className={styles.linkText} onClick={() => setMenuOpen(false)}>Mis Propiedades</Link>
                                <Link href="/properties/new" className={styles.btnPrimary} onClick={() => setMenuOpen(false)}>Publicar Propiedad</Link>
                            </>
                        ) : (
                            <Link href="/become-host" className={styles.linkText} onClick={() => setMenuOpen(false)}>Únete como Propietario</Link>
                        )}

                        <button onClick={handleLogout} className={styles.btnPrimary}>Cerrar Sesión</button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className={styles.linkText} onClick={() => setMenuOpen(false)}>Iniciar Sesión</Link>
                        <Link href="/register" className={styles.btnPrimary} onClick={() => setMenuOpen(false)}>Registrarse</Link>
                    </>
                )}
            </div>
        </nav>
    );
}