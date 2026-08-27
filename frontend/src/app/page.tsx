'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import styles from './page.module.css';

interface Property {
  id: string | number;
  title: string;
  pricePerNight: number;
  images: string[];
  rating: number;
  location: string;
  category: string;
  maxGuests: number;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const location = searchParams.get('location') || '';

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para filtros
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxGuests, setMaxGuests] = useState('');

  // Construir URL con filtros
  const buildQuery = () => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (maxGuests) params.append('guests', maxGuests);
    return params.toString();
  };

  useEffect(() => {
    const query = buildQuery();
    apiFetch<Property[]>(`/properties${query ? `?${query}` : ''}`)
      .then(setProperties)
      .catch(err => console.error("Error al obtener datos:", err))
      .finally(() => setLoading(false));
  }, [location, category, minPrice, maxPrice, maxGuests]);

  if (loading) return <div className={styles.container}><p>Cargando alojamientos...</p></div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {location ? `Resultados para "${location}"` : 'Alojamientos disponibles'}
      </h1>

      {/* PANEL DE FILTROS */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Categoría</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todas</option>
            <option value="Cabañas">Cabañas</option>
            <option value="Casas">Casas</option>
            <option value="Departamentos">Departamentos</option>
            <option value="Lofts">Lofts</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Precio mín.</label>
          <input 
            type="number" 
            placeholder="0" 
            value={minPrice} 
            onChange={(e) => setMinPrice(e.target.value)}
            className={styles.filterInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Precio máx.</label>
          <input 
            type="number" 
            placeholder="5000" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)}
            className={styles.filterInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Huéspedes</label>
          <input 
            type="number" 
            placeholder="2" 
            value={maxGuests} 
            onChange={(e) => setMaxGuests(e.target.value)}
            className={styles.filterInput}
          />
        </div>

        <button 
          className={styles.clearBtn} 
          onClick={() => {
            setCategory('');
            setMinPrice('');
            setMaxPrice('');
            setMaxGuests('');
          }}
        >
          Limpiar
        </button>
      </div>

      <div className={styles.grid}>
        {properties.length === 0 ? (
          <p className={styles.noResults}>No se encontraron propiedades con estos filtros.</p>
        ) : (
          properties.map((item) => (
            <Link href={`/properties/detail?id=${item.id}`} key={item.id} className={styles.card}>
              <img
                src={getImageUrl(item.images?.[0])}
                alt={item.title}
                className={styles.cardImage}
              />
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <p className={styles.cardLocation}>📍 {item.location}</p>
                <p className={styles.cardRating}>⭐ {item.rating} / 5</p>
                <p className={styles.cardPrice}>${item.pricePerNight} / noche</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className={styles.container}><p>Cargando...</p></div>}>
      <HomeContent />
    </Suspense>
  );
}