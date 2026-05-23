"use client";

import { useState, useMemo } from "react";
import type { Property, PropertyFilters as PropertyFiltersType } from "@/core/entities/property";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import { useTheme } from "@/hooks/useTheme";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyFilters } from "@/components/PropertyFilters";
import { PropertyForm } from "@/components/PropertyForm";
import { PropertyDetail } from "@/components/PropertyDetail";
import { getAppStyles, getProfileMenuStyles } from "@/styles/componentStyles";
import { buildOutputs } from "@/lib/messageFormatter";
import {
  getProperty,
  duplicateProperty,
  filterAndSortProperties,
} from "@/core/actions/properties";
import { Sun, Moon, LogOut, MessageCircle } from "lucide-react";
import { ChatPanel } from "@/features/chat/components/ChatPanel";

export function PropertiesView() {
  const { user, logout } = useAuth();
  const { properties, loading, saveProperty, removeProperty, changeStatus, loadProperties } =
    useProperties(user?.id);
  const { t: theme, mode, toggle: cycleTheme } = useTheme();

  const [selected, setSelected] = useState<Property | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEdit] = useState<Partial<Property> | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [filters, setFilters] = useState<PropertyFiltersType>({
    q: "",
    operacion: "",
    tipo: "",
    estado: "",
  });

  const S = getAppStyles(theme, mode);

  const handleDuplicate = async (original: Property) => {
    const result = await duplicateProperty(original.id);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    await loadProperties();
  };

  const handleRefreshProperty = async () => {
    if (!selected?.id) return;
    const result = await getProperty(selected.id);
    if (result.ok) setSelected(result.data);
  };

  const filtered = useMemo(
    () => filterAndSortProperties(properties, filters),
    [properties, filters]
  );

  if (selected) {
    const current = properties.find((p) => p.id === selected.id) || selected;
    return (
      <>
        <div style={{ ...S.app, paddingBottom: 16 }}>
          <PropertyDetail
            p={current}
            onBack={() => setSelected(null)}
            onEdit={() => {
              setEdit(current);
              setShowForm(true);
            }}
            onEstado={changeStatus}
            onDelete={(id: string) => {
              removeProperty(id);
              setSelected(null);
            }}
            onRefresh={handleRefreshProperty}
          />
        </div>
        {showForm && (
          <PropertyForm
            initial={editTarget}
            onSave={saveProperty}
            onClose={() => {
              setShowForm(false);
              setEdit(null);
            }}
          />
        )}

        {chatOpen && (
          <ChatPanel
            properties={properties}
            onSelectProperty={(p: Property) => { setSelected(p); setChatOpen(false); }}
            onRefresh={loadProperties}
            onClose={() => setChatOpen(false)}
          />
        )}

        <button
          onClick={() => setChatOpen((v) => !v)}
          style={{
            position: "fixed", bottom: 88, right: 20,
            zIndex: 140,
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg, #d4af37, #b8962e)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(212,175,55,0.4)",
          }}
        >
          <MessageCircle size={22} color="#0a0a0a" strokeWidth={1.5} />
        </button>
      </>
    );
  }

  return (
    <div
      style={{ ...S.app, paddingBottom: 16 } as React.CSSProperties}
      onClick={(e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
          setOpenMenu(null);
          setProfileMenuOpen(false);
        }
      }}
    >
      {profileMenuOpen && (
        <>
          <div
            style={getProfileMenuStyles(theme).overlay as React.CSSProperties}
            onClick={() => setProfileMenuOpen(false)}
          />
          <div style={getProfileMenuStyles(theme).drawer as React.CSSProperties}>
            <div style={getProfileMenuStyles(theme).header}>
              <div style={getProfileMenuStyles(theme).userInfo}>
                {user?.email?.split("@")[0]}
              </div>
              <div style={getProfileMenuStyles(theme).userEmail}>{user?.email}</div>
            </div>
            <button
              style={getProfileMenuStyles(theme).item as React.CSSProperties}
              onClick={cycleTheme}
            >
              {mode === "light" ? (
                <>
                  <Sun size={16} /> Claro
                </>
              ) : (
                <>
                  <Moon size={16} /> Oscuro
                </>
              )}
            </button>
            <div style={getProfileMenuStyles(theme).divider as React.CSSProperties} />
            <button
              style={getProfileMenuStyles(theme).item as React.CSSProperties}
              onClick={logout}
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>
        </>
      )}

      <div style={S.topBar}>
        <button
          onClick={() => setProfileMenuOpen(true)}
          style={{ ...S.logo, background: "none", border: "none", cursor: "pointer" }}
        >
          ROCA
        </button>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={S.userTag}>{user?.email?.split("@")[0]}</span>
          <button
            onClick={() => {
              setEdit(null);
              setShowForm(true);
            }}
            style={S.newBtn}
          >
            + Nuevo
          </button>
        </div>
      </div>

      <PropertyFilters
        filters={filters}
        setFilters={setFilters}
        loading={loading}
        filteredCount={filtered.length}
      />

      <div style={S.list as React.CSSProperties}>
        {!loading && filtered.length === 0 && (
          <div style={S.empty}>Sin resultados. Toca + Nuevo para agregar.</div>
        )}
        {filtered.map((p) => {
          const out = buildOutputs(p);
          return (
            <PropertyCard
              key={p.id}
              property={p}
              out={out}
              onClick={() => setSelected(p)}
              onEdit={() => {
                setEdit(p);
                setShowForm(true);
              }}
              onDelete={() => removeProperty(p.id)}
              onDuplicate={() => handleDuplicate(p)}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
            />
          );
        })}
      </div>

      {showForm && (
        <PropertyForm
          initial={editTarget}
          onSave={saveProperty}
          onClose={() => {
            setShowForm(false);
            setEdit(null);
          }}
        />
      )}

      {chatOpen && (
        <ChatPanel
          properties={properties}
          onSelectProperty={(p: Property) => { setSelected(p); setChatOpen(false); }}
          onRefresh={loadProperties}
          onClose={() => setChatOpen(false)}
        />
      )}

      <button
        onClick={() => setChatOpen((v) => !v)}
        style={{
          position: "fixed", bottom: 88, right: 20,
          zIndex: 140,
          width: 52, height: 52, borderRadius: "50%",
          background: "linear-gradient(135deg, #d4af37, #b8962e)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(212,175,55,0.4)",
        }}
      >
        <MessageCircle size={22} color="#0a0a0a" strokeWidth={1.5} />
      </button>
    </div>
  );
}
