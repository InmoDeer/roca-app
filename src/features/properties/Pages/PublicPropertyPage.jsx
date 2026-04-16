import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../../config/supabase';
import { buildOutputs } from '../../../utils/messageFormatter';
import { Gallery } from '../../../components/ui/Gallery';
import { BUSINESS_NAME } from '../../../config/environment';
import { 
  MapPin, Globe, Phone, Share2, Check, 
  Bed, Bath, Maximize, Building, Grid3x3 
} from 'lucide-react';

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${property.nombre} - ${property.distrito}`,
          text: `Mira este inmueble: ${property.nombre} en ${property.distrito}`,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

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
  const highlightText = out.caracteristicasCompletas
    .split('\n')
    .filter(line => line.startsWith('•'))
    .map(line => line.replace('• ', ''))
    .slice(0, 3)
    .join(' · ');

  return (
    <>
      <Helmet>
        <title>{`${property.nombre} - ${property.distrito} | ${BUSINESS_NAME}`}</title>
        <meta name="description" content={`${property.tipo} en ${property.distrito}. ${out.specsLine}`} />
        <meta property="og:title" content={`${property.nombre} en ${property.distrito}`} />
        <meta property="og:description" content={out.specsLine} />
        <meta property="og:image" content={mainImage} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <span style={styles.logo}>{BUSINESS_NAME}</span>
          <button onClick={handleShare} style={styles.iconBtn} title="Compartir">
            {copied ? <Check size={20} /> : <Share2 size={20} />}
          </button>
        </header>

        {/* Collage de fotos sin recortes */}
        {fotos.length > 0 && (
          <PhotoCollage fotos={fotos} onPhotoClick={openGallery} />
        )}

        <div style={styles.content}>
          <h1 style={styles.title}>{property.nombre}</h1>
          <p style={styles.subtitle}>{property.tipo} · {property.distrito}</p>
          
          <div style={styles.price}>
            {property.moneda === 'USD' ? 'US$ ' : 'S/ '}
            {Number(property.precio).toLocaleString()}
            {property.mantenimiento && (
              <span style={styles.maintenance}>
                + {property.moneda === 'USD' ? 'US$ ' : 'S/ '}
                {Number(property.mantenimiento).toLocaleString()} mant.
              </span>
            )}
          </div>

          {highlightText && (
            <div style={styles.highlightBox}>
              <span style={styles.highlightIcon}>✨</span>
              <p style={styles.highlightText}>{highlightText}</p>
            </div>
          )}

          <div style={styles.featuresGrid}>
            {property.dormitorios && <div style={styles.featureItem}><Bed size={18} /> {property.dormitorios} dorm.</div>}
            {property.banos && <div style={styles.featureItem}><Bath size={18} /> {property.banos} baños</div>}
            {property.area_m2 && <div style={styles.featureItem}><Maximize size={18} /> {property.area_m2} m²</div>}
            {property.piso && <div style={styles.featureItem}><Building size={18} /> Piso {property.piso}</div>}
          </div>

          <div style={styles.actions}>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(out.mensajeLargo)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.whatsappBtn}
            >
              <Phone size={20} /> Contactar por WhatsApp
            </a>
          </div>

          <div style={styles.links}>
            {property.tour360_url && (
              <a href={property.tour360_url} target="_blank" rel="noopener noreferrer" style={styles.linkItem}>
                <Globe size={18} /> Tour 360°
              </a>
            )}
            
            {/* Mapa: vista previa + enlace */}
            {out.mapsLink && (
              <div style={{ marginTop: 12 }}>
                <MapPreview 
                  address={property.direccion} 
                  district={property.distrito}
                  mapsLink={out.mapsLink}
                />
                <a href={out.mapsLink} target="_blank" rel="noopener noreferrer" style={{ ...styles.linkItem, marginTop: 8 }}>
                  <MapPin size={18} /> Ver ubicación en Maps
                </a>
              </div>
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

/**
 * Collage de fotos que respeta orientación (sin recortes)
 * Usa CSS Grid con altura fija y object-fit: contain sobre fondo negro.
 */
function PhotoCollage({ fotos, onPhotoClick }) {
  const count = fotos.length;
  if (count === 0) return null;

  const handleClick = (index) => (e) => {
    e.stopPropagation();
    onPhotoClick(index);
  };

  // Renderizado según cantidad
  if (count === 1) {
    return (
      <div style={collageStyles.single} onClick={handleClick(0)}>
        <img src={fotos[0]} alt="" style={{ ...collageStyles.img, objectFit: 'contain', background: '#000' }} />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div style={collageStyles.grid2}>
        <div style={collageStyles.cell} onClick={handleClick(0)}>
          <img src={fotos[0]} alt="" style={{ ...collageStyles.img, objectFit: 'contain', background: '#000' }} />
        </div>
        <div style={collageStyles.cell} onClick={handleClick(1)}>
          <img src={fotos[1]} alt="" style={{ ...collageStyles.img, objectFit: 'contain', background: '#000' }} />
        </div>
      </div>
    );
  }

  if (count === 3) {
    return (
      <div style={collageStyles.grid3}>
        <div style={{ ...collageStyles.cell, gridColumn: '1 / 2', gridRow: '1 / 3' }} onClick={handleClick(0)}>
          <img src={fotos[0]} alt="" style={{ ...collageStyles.img, objectFit: 'contain', background: '#000' }} />
        </div>
        <div style={collageStyles.cell} onClick={handleClick(1)}>
          <img src={fotos[1]} alt="" style={{ ...collageStyles.img, objectFit: 'contain', background: '#000' }} />
        </div>
        <div style={collageStyles.cell} onClick={handleClick(2)}>
          <img src={fotos[2]} alt="" style={{ ...collageStyles.img, objectFit: 'contain', background: '#000' }} />
        </div>
      </div>
    );
  }

  // 4+ fotos
  return (
    <div style={collageStyles.grid4}>
      <div style={{ ...collageStyles.cell, gridColumn: '1 / 2', gridRow: '1 / 3' }} onClick={handleClick(0)}>
        <img src={fotos[0]} alt="" style={{ ...collageStyles.img, objectFit: 'contain', background: '#000' }} />
      </div>
      <div style={collageStyles.cell} onClick={handleClick(1)}>
        <img src={fotos[1]} alt="" style={{ ...collageStyles.img, objectFit: 'contain', background: '#000' }} />
      </div>
      <div style={collageStyles.cell} onClick={handleClick(2)}>
        <img src={fotos[2]} alt="" style={{ ...collageStyles.img, objectFit: 'contain', background: '#000' }} />
      </div>
      <div 
        style={{ ...collageStyles.cell, position: 'relative' }} 
        onClick={handleClick(3)}
      >
        <img src={fotos[3]} alt="" style={{ ...collageStyles.img, objectFit: 'contain', background: '#000' }} />
        {count > 4 && (
          <div style={collageStyles.moreBadge}>
            <Grid3x3 size={18} /> +{count - 4}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Vista previa del mapa estático usando OpenStreetMap (gratis)
 */
function MapPreview({ address, district, mapsLink }) {
  // Construir consulta para OpenStreetMap static image
  const query = encodeURIComponent(`${address || ''} ${district || ''} Lima Peru`);
  const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${query}&zoom=15&size=400x200&maptype=mapnik&markers=${query},red-pushpin`;

  return (
    <div style={mapStyles.container}>
      <img 
        src={staticMapUrl} 
        alt="Vista previa del mapa" 
        style={mapStyles.image}
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      <div style={mapStyles.overlay} />
    </div>
  );
}

// Estilos
const collageStyles = {
  single: {
    width: '100%',
    height: 280,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 4,
    height: 280,
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gap: 4,
    height: 280,
  },
  grid4: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gap: 4,
    height: 280,
  },
  cell: {
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#111',
    cursor: 'pointer',
  },
  img: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
  moreBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
    color: '#fff',
    padding: '6px 10px',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    border: '1px solid rgba(255,255,255,0.2)',
  },
};

const mapStyles = {
  container: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    border: '1px solid rgba(255,255,255,0.1)',
  },
  image: {
    width: '100%',
    height: 160,
    objectFit: 'cover',
    display: 'block',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'transparent',
    pointerEvents: 'none',
  },
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#ffffff',
    fontFamily: "'Outfit', sans-serif",
    paddingBottom: 40,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    background: 'rgba(10,10,10,0.9)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  logo: {
    fontWeight: 800,
    fontSize: 20,
    color: '#d4af37',
    letterSpacing: '1px',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: '20px 20px 0',
    maxWidth: 480,
    margin: '0 auto',
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: 800,
    color: '#d4af37',
    marginBottom: 16,
  },
  maintenance: {
    fontSize: 14,
    fontWeight: 400,
    color: '#888',
    marginLeft: 8,
  },
  highlightBox: {
    background: 'rgba(212,175,55,0.08)',
    borderLeft: '4px solid #d4af37',
    borderRadius: '0 12px 12px 0',
    padding: '12px 16px',
    marginBottom: 24,
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
  highlightIcon: { fontSize: 20 },
  highlightText: { margin: 0, fontSize: 15, color: '#e0e0e0', lineHeight: 1.5, flex: 1 },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
    marginBottom: 24,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#ccc',
    fontSize: 15,
    background: 'rgba(255,255,255,0.03)',
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.05)',
  },
  actions: { marginBottom: 20 },
  whatsappBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    background: '#25D366',
    color: '#000',
    padding: '16px 0',
    borderRadius: 16,
    fontWeight: 700,
    fontSize: 16,
    textDecoration: 'none',
    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 8,
  },
  linkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: '14px 16px',
    color: '#fff',
    textDecoration: 'none',
    fontSize: 15,
    fontWeight: 500,
  },
};

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff' }}>
      Cargando...
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff' }}>
      <h2>Inmueble no encontrado</h2>
    </div>
  );
}