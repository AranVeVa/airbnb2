'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import styles from './page.module.css';

interface Property {
  id: string | number;
  title: string;
  pricePerNight: number;
  images: string[];
}

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Property[]>('/properties')
      .then((data) => setProperties(data))
      .catch((err) => console.error("Error al obtener datos:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.container}><p>Cargando alojamientos...</p></div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Alojamientos disponibles</h1>
      <div className={styles.grid}>
        {properties.map((item) => (
          <Link href={`/properties/detail?id=${item.id}`} key={item.id} className={styles.card}>
            <img
              src={getImageUrl(item.images?.[0])}
              alt={item.title}
              className={styles.cardImage}
            />
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{item.title}</h2>
              <p className={styles.cardPrice}>${item.pricePerNight} / noche</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}