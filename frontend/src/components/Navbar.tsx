'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { token, logout } = useAuth();

    return (
        <nav className={styles.navbar}>
            <Link href="/" className={styles.logo}>airbnb2</Link>

            <div className={styles.navLinks}>
                {token ? (
                    <>
                        <Link href="/reservations" className={styles.linkText}>
                            Mis Reservas
                        </Link>
                        <Link href="/properties/new" className={styles.btnPrimary}>
                            Publicar Propiedad
                        </Link>
                        <Link href="/properties/mine" className={styles.linkText}>
                            Mis Propiedades
                        </Link>
                        <button onClick={logout} className={styles.btnPrimary}>
                            Cerrar Sesión
                        </button>
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