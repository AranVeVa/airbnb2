# Práctica de Laboratorio: Implementación de Analítica Web con Google Analytics 4 (GA4)
**Proyecto:** StayFinder (airbnb2)  
**Materia:** Ambientes Web  
**Rama de Git:** `feature/google-analytics`  
**Pull Request:** [Crear/Ver Pull Request en GitHub](https://github.com/AranVeVa/airbnb2/pull/new/feature/google-analytics)

---

## 1. Resumen de la Implementación Técnica

Se completó satisfactoriamente la integración de **Google Analytics 4 (GA4)** utilizando el paquete oficial `@next/third-parties/google` en Next.js (App Router).

### A. Dependencias Instaladas
- `@next/third-parties`: Permite la carga optimizada del script de GA4 mediante `<GoogleAnalytics gaId={...} />` y la emisión de eventos con `sendGAEvent`.

### B. Inyección en el Layout Raíz (`frontend/src/app/layout.tsx`)
Se integró el componente de Google Analytics condicionado a la existencia de la variable de entorno:
```tsx
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <FilterProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
          </FilterProvider>
        </AuthProvider>
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
```

### C. Configuración de Variables de Entorno
- **Local (`frontend/.env.local`)**:
  ```env
  NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
  ```
- **Plantilla para el repositorio (`frontend/.env.example`)**: Creado para documentar las variables sin comprometer secretos.
- **Vercel**: Debe agregarse en **Project Settings > Environment Variables** como `NEXT_PUBLIC_GA_ID` con el ID de medición correspondiente.

---

## 2. Eventos de Analítica Implementados

| Evento GA4 | Ubicación en el Código | Disparador (Trigger) | Parámetros Enviados |
| :--- | :--- | :--- | :--- |
| **`search`** *(Obligatorio)* | `frontend/src/components/Navbar.tsx` | Al ingresar un destino y presionar Enter / buscar. | `search_term` |
| **`select_item`** *(Obligatorio)* | `frontend/src/app/page.tsx` | Al hacer clic en la tarjeta de un alojamiento del listado. | `item_list_name`, `items: [{ item_id, item_name, item_category, price, quantity }]` |
| **`view_item`** *(Obligatorio)* | `frontend/src/app/properties/detail/page.tsx` | Al cargar la página de detalle del alojamiento seleccionado. | `currency: 'MXN'`, `items: [{ item_id, item_name, item_category, price, quantity }]` |
| **`begin_checkout`** *(Obligatorio)* | `frontend/src/app/properties/detail/page.tsx` | Al enviar el formulario de reserva ("Confirmar Reserva") o hacer clic en Pagar con Stripe / Mercado Pago. | `currency: 'MXN'`, `value`, `items: [{ item_id, item_name, item_category, price, quantity }]` |
| **`login`** *(Opcional / Bonus)* | `frontend/src/app/login/page.tsx` | Tras autenticarse exitosamente en el sistema. | `method: 'credentials'` |
| **`sign_up`** *(Opcional / Bonus)* | `frontend/src/app/register/page.tsx` | Tras completar el registro de usuario en el sistema. | `method: 'credentials'` |

---

## 3. Guía para las Capturas de Pantalla Requeridas

Para cumplir con la lista de verificación y obtener la calificación máxima (100 pts), toma las siguientes capturas:

1. **Captura 1: Configuración de la Propiedad en Google Analytics**
   - **Dónde:** En [Google Analytics](https://analytics.google.com/) > *Administración (engrane)* > *Flujos de datos* > Clic en tu flujo web `StayFinder Web`.
   - **Qué debe verse:** El **ID de medición** (`G-XXXXXXXXXX`) y la URL de tu sitio.

2. **Captura 2: Variable de Entorno en Vercel**
   - **Dónde:** En tu dashboard de Vercel > Proyecto > *Settings* > *Environment Variables*.
   - **Qué debe verse:** La variable `NEXT_PUBLIC_GA_ID` configurada para los entornos de Production y Preview.

3. **Captura 3: Comprobación en DevTools (Pestaña Network / Red)**
   - **Dónde:** Abre tu sitio en Vercel (o local) > Presiona `F12` > Pestaña *Network (Red)* > Escribe `collect` en el filtro.
   - **Qué debe verse:** Peticiones HTTP con código `204` enviadas a Google Analytics conteniendo los parámetros `en=search`, `en=select_item`, `en=view_item` o `en=begin_checkout`.

4. **Captura 4: Informe en Tiempo Real en Google Analytics**
   - **Dónde:** En Google Analytics > Menú lateral izquierdo > *Informes* > *Tiempo real*.
   - **Qué debe verse:** El mapa con usuarios activos y la tarjeta **Event count by Event name** mostrando los eventos (`page_view`, `search`, `select_item`, `view_item`, `begin_checkout`).

5. **Captura 5: DebugView (Línea de tiempo de eventos)**
   - **Dónde:** En Google Analytics > *Administración* > *DebugView* (o con la extensión Google Analytics Debugger activa).
   - **Qué debe verse:** La secuencia cronológica de eventos conforme navegas en el sitio.

6. **Captura 6: Pull Request en GitHub**
   - **Dónde:** En GitHub > Repositorio `airbnb2` > Pestaña *Pull Requests*.
   - **Qué debe verse:** El Pull Request abierto desde la rama `feature/google-analytics` hacia `main`.

---

## 4. Respuestas del Análisis de Resultados (Punto 7 de la Práctica)

> *Nota: Completa los valores numéricos basándote en la información recopilada en tu panel de Google Analytics tras las pruebas y visitas.*

### 1. ¿Cuántas personas o usuarios activos aparecen en el informe de Tiempo real?
- **Respuesta:** Se registraron **[X] usuarios activos** simultáneos durante la sesión de pruebas (métrica: *Active Users* en los últimos 30 minutos).

### 2. ¿Cuál fue el alojamiento más consultado?
- **Respuesta:** El alojamiento más consultado fue **"[Nombre del alojamiento con más vistas]"**, de acuerdo con los parámetros `item_name` registrados en el evento `view_item`.

### 3. ¿Cuántas búsquedas se realizaron?
- **Respuesta:** Se realizaron **[X] eventos de búsqueda** (`search`). Los destinos consultados incluyeron términos como *[destinos buscados, ej. Morelia, Cancún, Cabaña]*.

### 4. ¿Cuántos usuarios seleccionaron un alojamiento?
- **Respuesta:** Un total de **[X] usuarios** ejecutaron el evento `select_item` al hacer clic en las tarjetas de propiedades desde la página principal.

### 5. ¿Cuántos usuarios comenzaron una reservación?
- **Respuesta:** Un total de **[X] usuarios** alcanzaron la etapa `begin_checkout` al interactuar con el formulario de reserva o los botones de pasarela de pago.

### 6. ¿En qué parte del recorrido parece perderse más actividad?
- **Respuesta:** Analizando el embudo de conversión (`page_view` → `search` → `select_item` → `view_item` → `begin_checkout`):
  - La mayor caída de usuarios ocurre entre la etapa de **consulta de detalles (`view_item`)** y el **inicio de reservación (`begin_checkout`)**. 
  - **Justificación:** Los usuarios exploran con frecuencia fotos, precios y descripciones de las propiedades, pero solo una fracción decide proceder a reservar y comprometer fechas/pagos.
