import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../../config/supabase';
import { buildOutputs } from '../../../utils/messageFormatter';
import { Gallery } from '../../../components/ui/Gallery';
import { BUSINESS_NAME } from '../../../config/environment';
import { MapPin, Globe, Phone, Copy, Check, Maximize, Bed, Bath, Building, Eye } from 'lucide-react';

export function PublicPropertyPage({ id }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) setProperty(data);
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const openGallery = (index = 0) => {
    setGalleryIndex(index);
    setShowGallery(true);
  };

  if (loading) return <LoadingScreen />;
  if (!property) return <NotFound />;

  const out = buildOutputs(property);
  const fotos = property.fotos_urls || [];
  const mainImage = fotos[0];
  const remainingImages = fotos.slice(1, 5);
  const highlightText = out.caracteristicasCompletas
    .split('\n')
    .filter(line => line.startsWith('•'))
    .map(line => line.replace('• ', ''));

  return (
    <>
      <Helmet>
        <title>{`${property.nombre} - ${property.distrito} | ${BUSINESS_NAME}`}</title>
        <meta name="description" content={`${property.tipo} en ${property.distrito}. ${out.specsLine}. ${highlightText.slice(0, 3).join('. ')}`} />
        <meta property="og:title" content={`${property.nombre} en ${property.distrito}`} />
        <meta property="og:description" content={out.specsLine} />
        <meta property="og:image" content={mainImage} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="public-landing">
        <header className="landing-header" style={{ justifyContent: 'space-between', padding: '12px 16px' }}>
          <button onClick={handleCopyLink} className="copy-link-btn" title="Compartir">
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
          <span className="logo">{BUSINESS_NAME}</span>
          <div style={{ width: 40 }} />
        </header>

        {/* Grid de fotos */}
        {fotos.length > 0 && (
          <div className="photo-grid">
            {fotos.length === 1 ? (
              <div className="hero" onClick={() => openGallery(0)}>
                <img src={mainImage} alt={property.nombre} />
              </div>
            ) : (
              <div className="photo-grid-container">
                <div className="photo-main" onClick={() => openGallery(0)}>
                  <img src={mainImage} alt={property.nombre} />
                  <div className="photo-overlay">
                    <Eye size={20} /> Ver fotos
                  </div>
                </div>
                <div className="photo-thumbs">
                  {remainingImages.map((url, i) => (
                    <div key={i} className="photo-thumb" onClick={() => openGallery(i + 1)}>
                      <img src={url} alt="" />
                      {i === remainingImages.length - 1 && fotos.length > 5 && (
                        <div className="photo-more">+{fotos.length - 5}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
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
            <p>{highlightText.slice(0, 5).join(' · ')}</p>
          </div>

          <div className="features-grid">
            {property.dormitorios && <div><Bed size={18} /> {property.dormitorios} dorm.</div>}
            {property.banos && <div><Bath size={18} /> {property.banos} baños</div>}
            {property.area_m2 && <div><Maximize size={18} /> {property.area_m2} m²</div>}
            {property.piso && <div><Building size={18} /> Piso {property.piso}</div>}
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
            <button onClick={() => openGallery(0)} className="gallery-btn">
              <Eye size={18} /> Ver todas las fotos
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
          <Gallery 
            fotos={fotos} 
            initialIndex={galleryIndex}
            onClose={() => setShowGallery(false)} 
          />
        )}
      </div>
    </>
  );
}

function LoadingScreen() {
  return <div className="loading-screen">Cargando...</div>;
}

function NotFound() {
  return (
    <div className="not-found">
      <h2>Inmueble no encontrado</h2>
    </div>
  );
}