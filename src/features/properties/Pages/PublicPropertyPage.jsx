import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../utils/api';
import { buildOutputs } from '../../utils/messageFormatter';
import { Gallery } from '../../components/ui/Gallery';
import { MapPin, Globe, Phone, Copy, ArrowLeft, Maximize, Bed, Bath } from 'lucide-react';

export function PublicPropertyPage({ id }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) setProperty(data);
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!property) return <NotFound />;

  const out = buildOutputs(property);
  const mainImage = property.fotos_urls?.[0];
  const pageUrl = window.location.href;
  const highlightText = out.caracteristicasCompletas
    .split('\n')
    .filter(line => line.startsWith('•'))
    .join(' · ');

  return (
    <>
      <Helmet>
        <title>{`${property.nombre} - ${property.distrito}`}</title>
        <meta name="description" content={`${property.tipo} en ${property.distrito}. ${highlightText}`} />
        <meta property="og:title" content={`${property.nombre} en ${property.distrito}`} />
        <meta property="og:description" content={highlightText} />
        <meta property="og:image" content={mainImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="public-landing">
        <header className="landing-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
          </Link>
          <span className="logo">ROCA</span>
          <div style={{ width: 40 }} />
        </header>

        {mainImage && (
          <div className="hero" onClick={() => setShowGallery(true)}>
            <img src={mainImage} alt={property.nombre} />
            {property.fotos_urls?.length > 1 && (
              <span className="photo-count">+{property.fotos_urls.length - 1}</span>
            )}
          </div>
        )}

        <div className="content">
          <h1>{property.nombre}</h1>
          <p className="subtitle">{property.tipo} · {property.distrito}</p>
          <div className="price">
            {property.moneda === 'USD' ? 'US$ ' : 'S/ '}
            {Number(property.precio).toLocaleString()}
            {property.mantenimiento && (
              <span className="maintenance">
                + {property.moneda === 'USD' ? 'US$ ' : 'S/ '}
                {Number(property.mantenimiento).toLocaleString()} mant.
              </span>
            )}
          </div>

          <div className="highlight-box">
            <span>✨</span>
            <p>{highlightText}</p>
          </div>

          <div className="features-grid">
            {property.dormitorios && <div><Bed size={18} /> {property.dormitorios} dorm.</div>}
            {property.banos && <div><Bath size={18} /> {property.banos} baños</div>}
            {property.area_m2 && <div><Maximize size={18} /> {property.area_m2} m²</div>}
            {property.piso && <div>🏢 Piso {property.piso}</div>}
          </div>

          <div className="actions">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(out.mensajeLargo)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              <Phone size={18} /> WhatsApp
            </a>
            <button
              onClick={() => { navigator.clipboard.writeText(pageUrl); alert('Enlace copiado'); }}
              className="copy-btn"
            >
              <Copy size={18} />
            </button>
          </div>

          <div className="links">
            {property.tour360_url && (
              <a href={property.tour360_url} target="_blank" rel="noopener noreferrer">
                <Globe size={18} /> Tour 360°
              </a>
            )}
            {out.mapsLink && (
              <a href={out.mapsLink} target="_blank" rel="noopener noreferrer">
                <MapPin size={18} /> Ver en Maps
              </a>
            )}
          </div>
        </div>

        {showGallery && (
          <Gallery fotos={property.fotos_urls} onClose={() => setShowGallery(false)} />
        )}
      </div>
    </>
  );
}

// Componentes auxiliares
function LoadingScreen() {
  return <div className="loading-screen">Cargando...</div>;
}

function NotFound() {
  return (
    <div className="not-found">
      <h2>Inmueble no encontrado</h2>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}