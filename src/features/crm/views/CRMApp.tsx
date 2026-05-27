'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { STAGES_LEAD, STAGES_PROPIETARIO, STAGE_LABEL } from '@/core/crm/stages'
import { ACTIVITY_COLORS } from '@/core/crm/constants'
import { AuthGate } from '@/components/crm/AuthGate'
import { getFecha } from '@/core/crm/dates'
import { getMensaje, getTipoMensaje } from '@/core/crm/messages'
import { getScore, getCalor } from '@/core/crm/scoring'
import type { Opportunity } from '@/core/crm/types'
import { useOpportunities } from '@/hooks/useOpportunities'
import { useTimeline } from '@/hooks/useTimeline'
import { useTheme } from '@/hooks/useTheme'
import {
  getCrmInputStyles, getCrmSectionTitle, getCrmRowStyles,
  getCrmButtonStyles, getCrmCardStyles,
  getCrmHeaderStyles, getCrmTabsStyles, getCrmTabStyles,
  getCrmBadgeStyles, getCrmStatsCardStyles, getCrmContentStyles,
  getCrmEmptyStateStyles, getUrgencyColor,
  type CrmButtonVariant,
} from '@/styles/componentStyles'
import {
  Phone, MessageCircle, Home, Handshake, Mail, FileText,
  Check, X, Calendar, Lightbulb, CheckCircle, Clock, XCircle,
  PartyPopper, BarChart3, RotateCcw, RefreshCw, Flame, Users,
  Plus, User, AlertTriangle, ClipboardList, Skull, Inbox, Link,
  PauseCircle, Moon, Trash2,
} from 'lucide-react'
import type { ReactNode } from 'react'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type PipelineType = 'lead' | 'propietario'
type Vista = 'hoy' | 'leads' | 'propietarios'

// ─── UTILIDADES ───────────────────────────────────────────────────────────────

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function CRMHome() {
  return (
    <AuthGate>
      {(user) => <CRMApp userId={user.id} />}
    </AuthGate>
  )
}

function CRMApp({ userId }: { userId: string }) {
  const [vista, setVista] = useState<Vista>('hoy')
  const { t, mode } = useTheme()

  // Hooks
  const { 
    opps, properties, activities, pendingActivities, loading, 
    cargarOpps, cargarActivities, crearOpp, actualizarStage, completarCaptacion 
  } = useOpportunities(userId)

  const { 
    timeline, timelineOpen, selectedOpp, loading: timelineLoading,
    cargarTimeline, abrirTimeline, cerrarTimeline, registrarActividad 
  } = useTimeline(cargarActivities)

  // Form crear
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [propertyId, setPropertyId] = useState('')
  const [pipelineNuevo, setPipelineNuevo] = useState<PipelineType>('lead')
  const [stageInicial, setStageInicial] = useState('Contactado')
  const [mostrarForm, setMostrarForm] = useState(false)

  // Programador de acción
  const [programador, setProgramador] = useState<{
    open?: boolean; opp: any; evento?: string; suggestedType?: string; linkedOutcome?: string; fecha: string; nota: string; tipoActividad?: string
  } | null>(null)

  // Modal actividad manual
  const [modalActividad, setModalActividad] = useState<{
    opp: any; activityId?: string; tipo: string; resultado: string; nota: string; fecha: string
  } | null>(null)

  // Modal captación propietario
  const [mostrarModalCaptacion, setMostrarModalCaptacion] = useState(false)
  const [captacionOpp, setCaptacionOpp] = useState<any>(null)
  const [captarModo, setCaptarModo] = useState<'crear' | 'vincular'>('crear')
  const [propiedadNombre, setPropiedadNombre] = useState('')
  const [propiedadPrecio, setPropiedadPrecio] = useState('')
  const [propiedadDistrito, setPropiedadDistrito] = useState('')
  const [propiedadIdSeleccionada, setPropiedadIdSeleccionada] = useState('')

  // Reagendar
  const [loadingActivity, setLoadingActivity] = useState<string | null>(null)
  const [reagendarActId, setReagendarActId] = useState<string | null>(null)
  const [reagendarFecha, setReagendarFecha] = useState('')

  // Quick add
  const [quickAdd, setQuickAdd] = useState<{
    opp: any; tipo: string; nota: string; fecha: string
  } | null>(null)

  // ── Helpers ───────────────────────────────────────────────────────────────────

  const TIPOS_ACTIVIDAD = [
    { value: 'call', label: <><Phone size={14} /> Llamada</> },
    { value: 'whatsapp', label: <><MessageCircle size={14} /> WhatsApp</> },
    { value: 'visit', label: <><Home size={14} /> Visita</> },
    { value: 'meeting', label: <><Handshake size={14} /> Reunión</> },
    { value: 'email', label: <><Mail size={14} /> Email</> },
  ]

  const OUTCOMES_BY_ACTIVITY: Record<string, { value: string; label: string }[]> = {
    call: [
      { value: 'answered', label: 'Respondió' },
      { value: 'no_answer', label: 'No respondió' },
      { value: 'callback', label: 'Llamar luego' },
      { value: 'interested', label: 'Interesado' },
      { value: 'visit_scheduled', label: 'Agendar visita' },
      { value: 'wrong_number', label: 'Número inválido' },
    ],
    whatsapp: [
      { value: 'replied', label: 'Respondió' },
      { value: 'read_no_reply', label: 'Visto sin responder' },
      { value: 'requested_info', label: 'Pidió información' },
      { value: 'visit_scheduled', label: 'Agendar visita' },
      { value: 'not_interested', label: 'Sin interés' },
    ],
    visit: [
      { value: 'confirmed', label: 'Confirmó visita' },
      { value: 'completed', label: 'Visita realizada' },
      { value: 'no_show', label: 'No asistió' },
      { value: 'rescheduled', label: 'Reagendó' },
      { value: 'interested', label: 'Interesado' },
    ],
    meeting: [
      { value: 'completed', label: 'Reunión realizada' },
      { value: 'follow_up', label: 'Seguimiento' },
      { value: 'proposal_sent', label: 'Propuesta enviada' },
      { value: 'captured', label: 'Captado' },
    ],
    email: [
      { value: 'sent', label: 'Enviado' },
      { value: 'opened', label: 'Abierto' },
      { value: 'replied', label: 'Respondió' },
    ],
  }

  const getOutcomesForActivity = (type: string) => {
    return OUTCOMES_BY_ACTIVITY[type] || []
  }

  const getOutcomeLabel = (value: string) => {
    for (const outcomes of Object.values(OUTCOMES_BY_ACTIVITY)) {
      const found = outcomes.find(o => o.value === value)
      if (found) return found.label
    }
    return value
  }

  const OUTCOMES_REQUIRING_NEXT_ACTION = [
    'answered',
    'interested',
    'completed',
    'proposal_sent',
    'confirmed',
  ]

  const OUTCOME_EFFECTS: Record<string, { stage?: string; nextAction?: string; delayHours?: number; lifecycle?: 'lost' | 'won' }> = {
    interested: { stage: 'Interesado', nextAction: 'visit' },
    visit_scheduled: { stage: 'Visita', nextAction: 'visit' },
    no_answer: { nextAction: 'call', delayHours: 2 },
    completed: { stage: 'Seguimiento', nextAction: 'call' },
    not_interested: { lifecycle: 'lost' },
    wrong_number: { lifecycle: 'lost' },
    captured: { stage: 'Captado' },
    follow_up: { stage: 'Seguimiento', nextAction: 'whatsapp' },
    proposal_sent: { stage: 'Tasación', nextAction: 'call' }
  }

  const NEXT_ACTION_SUGGESTIONS: Record<string, { type: string; hours: number }> = {
    no_answer: { type: 'call', hours: 2 },
    interested: { type: 'visit', hours: 24 },
    completed: { type: 'call', hours: 24 },
    answered: { type: 'whatsapp', hours: 24 },
    proposal_sent: { type: 'call', hours: 48 },
    confirmed: { type: 'visit', hours: 2 },
  }

  const deriveSuggestedNextAction = (outcome: string) => {
    return NEXT_ACTION_SUGGESTIONS[outcome] || { type: 'call', hours: 24 }
  }

  const getFechaLocalOffset = (horas: number) => {
    const d = new Date()
    d.setHours(d.getHours() + horas)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 16)
  }

  // ── Activity map visual ────────────────────────────────────────────────────

  const ACTIVITY_LABELS: Record<string, ReactNode> = {
    call: <><Phone size={14} />Llamada</>,
    whatsapp: <><MessageCircle size={14} />WhatsApp</>,
    visit: <><Home size={14} />Visita</>,
    meeting: <><Handshake size={14} />Reunión</>,
    email: <><Mail size={14} />Email</>,
  }

  const formatFecha = (f: string) => {
    const d = new Date(f)
    const diff = Date.now() - d.getTime()
    const mins = Math.floor(diff / 60000)
    const hrs = Math.floor(diff / 3600000)
    const dias = Math.floor(diff / 86400000)

    const precisa = d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' }) +
      ' · ' + d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })

    if (mins < 1) return `${precisa} (ahora)`
    if (hrs < 1) return `${precisa} (hace ${mins}m)`
    if (hrs < 24) return `${precisa} (hace ${hrs}h)`
    if (dias === 1) return `${precisa} (ayer)`
    if (dias < 30) return `${precisa} (hace ${dias}d)`
    return precisa
  }

  const getTiempoRelativo = (fecha: string) => {
    if (!fecha) return ''
    const ahora = new Date()
    const actFecha = new Date(fecha)
    const diffMs = ahora.getTime() - actFecha.getTime()
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDias = Math.floor(diffHrs / 24)
    if (diffHrs < 1) return 'ahora'
    if (diffHrs < 24) return `${diffHrs}h`
    if (diffDias === 1) return 'ayer'
    if (diffDias < 7) return `${diffDias}d`
    return actFecha.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
  }

  // ── Carga de datos - ya manejada por hooks ─────────────────────────────────

  useEffect(() => {
    setStageInicial('Contactado')
  }, [pipelineNuevo])

  // ── Crear oportunidad ───────────────────────────────────────────────────────

  const handleCrearOpp = async () => {
    await crearOpp({
      nombre,
      telefono,
      pipeline: pipelineNuevo,
      propertyId,
      stageInicial,
    })

    setNombre('')
    setTelefono('')
    setPropertyId('')
    setMostrarForm(false)
  }

  // ── Captación de propietario (UI handlers) ─────────────────────────────────

  const handleIniciarCaptacion = (opp: Opportunity) => {
    if (opp.property_id) {
      completarCaptacion({ opp, propiedadId: opp.property_id, propiedadIdSeleccionada: '', captarModo: 'crear' })
    } else {
      setCaptacionOpp(opp)
      setCaptarModo('crear')
      setPropiedadNombre('')
      setPropiedadPrecio('')
      setPropiedadDistrito('')
      setPropiedadIdSeleccionada('')
      setMostrarModalCaptacion(true)
    }
  }

  const handleCompletarCaptacion = async (nuevaPropiedadId: string | null) => {
    if (!captacionOpp) return
    
    await completarCaptacion({ 
      opp: captacionOpp, 
      propiedadId: nuevaPropiedadId, 
      propiedadIdSeleccionada: propiedadIdSeleccionada,
      captarModo 
    })
    
    setMostrarModalCaptacion(false)
    setCaptacionOpp(null)
  }

  // ── Actualizar stage (UI handler) ───────────────────────────────────────────

  const guardarAccion = async () => {
    if (!programador) return
    await registrarActividad({
      opp: programador.opp,
      tipo: programador.tipoActividad || 'call',
      resultado: '',
      nota: programador.nota,
      fecha: programador.fecha,
    })
    setProgramador(null)
  }

  const handleRegistrarActividad = async () => {
    if (!modalActividad) return
    
    const outcome = modalActividad.resultado

    if (modalActividad.activityId) {
      await supabase
        .from('activities')
        .update({
          status: 'completed',
          result: outcome,
          note: modalActividad.nota,
          completed_at: new Date().toISOString(),
        })
        .eq('id', modalActividad.activityId)
    } else {
      await registrarActividad({
        opp: modalActividad.opp,
        tipo: modalActividad.tipo,
        resultado: outcome,
        nota: modalActividad.nota,
        fecha: modalActividad.fecha,
      })
    }

    const effect = OUTCOME_EFFECTS[outcome]

    if (effect?.lifecycle) {
      await actualizarStage({
        opp: modalActividad.opp,
        nuevoStage: effect.lifecycle === 'lost' ? 'Perdido' : 'Cerrado',
      })
    } else if (effect?.stage && effect.stage !== modalActividad.opp.stage) {
      await actualizarStage({
        opp: modalActividad.opp,
        nuevoStage: effect.stage,
      })
    }
    
    await cargarActivities()
    if (selectedOpp?.id === modalActividad.opp.id) cargarTimeline(modalActividad.opp.id)

    setModalActividad(null)

    if (OUTCOMES_REQUIRING_NEXT_ACTION.includes(outcome)) {
      const suggested = deriveSuggestedNextAction(outcome)
      setProgramador({
        open: true,
        opp: modalActividad.opp,
        evento: effect?.stage || modalActividad.opp.stage,
        suggestedType: suggested.type,
        tipoActividad: suggested.type,
        linkedOutcome: outcome,
        fecha: getFechaLocalOffset(suggested.hours),
        nota: ''
      })
    }
  }

  // ── Filtros ─────────────────────────────────────────────────────────────────

  const leads = opps.filter(o => (o.pipeline_type || 'lead') === 'lead')
  const propietarios = opps.filter(o => o.pipeline_type === 'propietario')

  // ── Fuente operacional única (activities) ──────────────────────────────────

  const oppMap = useMemo(() => Object.fromEntries(opps.map(o => [o.id, o])), [opps])

  const ahora = new Date()
  const inicioHoy = new Date(ahora); inicioHoy.setHours(0,0,0,0)
  const finHoy = new Date(ahora); finHoy.setHours(23,59,59,999)
  const hace7d = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000)

  const pendingOnly = activities.filter(a => a.status === 'pending')
  const pendingScheduled = pendingOnly
    .filter(a => a.scheduled_at)
    .sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime())

  const vencidasRecientes = pendingScheduled.filter(a =>
    new Date(a.scheduled_at!) < inicioHoy &&
    new Date(a.scheduled_at!) >= hace7d
  )
  const abandonadas = pendingScheduled.filter(a =>
    new Date(a.scheduled_at!) < hace7d
  )
  const hoyAct = pendingScheduled.filter(a =>
    new Date(a.scheduled_at!) >= inicioHoy &&
    new Date(a.scheduled_at!) <= finHoy
  )
  const proximas = pendingScheduled.filter(a =>
    new Date(a.scheduled_at!) > finHoy
  ).slice(0, 5)

  const sinProgramar = pendingOnly.filter(a => !a.scheduled_at)

  const oppsSinActividad = opps.filter(o =>
    (o.status || 'active') === 'active' &&
    !pendingOnly.some(a =>
      a.opportunity_id === o.id
    )
  )

  console.log('[CRM ops]', {
    totalActivities: activities.length,
    pendingOnly: pendingOnly.length,
    vencidasRecientes: vencidasRecientes.length,
    abandonadas: abandonadas.length,
    hoyAct: hoyAct.length,
    proximas: proximas.length,
    sinProgramar: sinProgramar.length,
    oppsSinActividad: oppsSinActividad.length,
  })

  // ── Helper para activity → opp (con guardia contra huérfanas) ─────────────

  const getOppForActivity = (a: any) => oppMap[a.opportunity_id] ?? null

  const ordenar = (arr: any[], activitiesData: any[]) => [...arr].sort((a, b) => getScore(b, activitiesData) - getScore(a, activitiesData))

  const deriveNextActionDate = (oppId: string, activitiesData: any[]): string | null => {
    const next = activitiesData
      .filter((a: any) => a.opportunity_id === oppId && a.status === 'pending' && a.scheduled_at)
      .sort((a: any, b: any) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0]
    return next?.scheduled_at || null
  }

  // ── Completar + Reagendar ─────────────────────────────────────────────────

  const handleCompletarActividad = async (opp: Opportunity, activityId: string) => {
    setLoadingActivity(activityId)
    try {
      const { error } = await supabase
        .from('activities')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', activityId)
      if (error) { alert(`Error al completar: ${error.message}`); return }

      await cargarActivities()
      if (selectedOpp?.id === opp.id) cargarTimeline(opp.id)

      const eventoDefault = opp.pipeline_type === 'propietario' ? 'Contactado'
        : opp.stage === 'Contactado' ? 'Interesado'
        : opp.stage === 'Interesado' ? 'Visita'
        : opp.stage === 'Visita' ? 'Seguimiento'
        : 'Seguimiento'
      abrirProgramador(opp, eventoDefault)
    } finally {
      setLoadingActivity(null)
    }
  }

  const reagendarActividad = async (activityId: string, nuevaFecha: string) => {
    setLoadingActivity(activityId)
    try {
      const { error } = await supabase
        .from('activities')
        .update({
          scheduled_at: new Date(nuevaFecha).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', activityId)
      if (error) { alert(`Error al reagendar: ${error.message}`); return }

      await cargarActivities()
      setReagendarActId(null)
    } finally {
      setLoadingActivity(null)
    }
  }

  const abrirReagendar = (activityId: string) => {
    setReagendarActId(activityId)
    setReagendarFecha(getFecha(1))
  }

  const handleQuickAdd = async () => {
    if (!quickAdd) return
    setLoadingActivity('quickAdd')
    try {
      await registrarActividad({
        opp: quickAdd.opp,
        tipo: quickAdd.tipo,
        resultado: '',
        nota: quickAdd.nota,
        fecha: quickAdd.fecha,
      })
      setQuickAdd(null)
    } finally {
      setLoadingActivity(null)
    }
  }

  // ── Acciones por stage ──────────────────────────────────────────────────────

  const AccionesLead = ({ opp }: { opp: Opportunity }) => {
    const tel = opp.contacts?.telefono
    const urlWA = `https://wa.me/51${tel}?text=${encodeURIComponent(getMensaje(opp, getTipoMensaje(opp)))}`

    const BtnWA = () => (
      <a href={urlWA} target="_blank">
        <button style={{ ...getCrmButtonStyles(t, mode, 'green'), display: 'inline-flex', alignItems: 'center', gap: 4 }}><MessageCircle size={14} /> WA</button>
      </a>
    )
    const BtnCall = () => (
      <a href={`tel:+51${tel}`}>
        <button style={{ ...getCrmButtonStyles(t, mode, 'blue'), display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={14} /></button>
      </a>
    )

    switch (opp.stage) {
      case 'Contactado':
        return (
          <div style={getCrmRowStyles()}>
            <BtnWA /><BtnCall />
            <button style={{ ...getCrmButtonStyles(t, mode, 'red'), display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => actualizarStage({ opp, nuevoStage: 'Perdido' })}><X size={14} /></button>
          </div>
        )
      case 'Interesado':
        return (
          <div style={getCrmRowStyles()}>
            <BtnWA /><BtnCall />
            <button style={{ ...getCrmButtonStyles(t, mode, 'red'), display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => actualizarStage({ opp, nuevoStage: 'Perdido' })}><X size={14} /></button>
          </div>
        )
      case 'Visita':
        return (
          <div style={getCrmRowStyles()}>
            {opp.visit_date && (
              <span style={{ fontSize: 11, color: t.colors.textSecondary, marginRight: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={12} /> {new Date(opp.visit_date).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            )}
            <BtnWA /><BtnCall />
          </div>
        )
      case 'Seguimiento':
        return (
          <div style={getCrmRowStyles()}>
            <BtnWA /><BtnCall />
            <button style={{ ...getCrmButtonStyles(t, mode, 'green'), display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => actualizarStage({ opp, nuevoStage: 'Cerrado' })}><PartyPopper size={14} /> Cerrar</button>
            <button style={{ ...getCrmButtonStyles(t, mode, 'red'), display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => actualizarStage({ opp, nuevoStage: 'Perdido' })}><X size={14} /></button>
          </div>
        )
      default:
        return null
    }
  }

  const AccionesPropietario = ({ opp }: { opp: Opportunity }) => {
    const tel = opp.contacts?.telefono
    const urlWA = `https://wa.me/51${tel}?text=${encodeURIComponent(getMensaje(opp, getTipoMensaje(opp)))}`

    const BtnWA = () => (
      <a href={urlWA} target="_blank">
        <button style={{ ...getCrmButtonStyles(t, mode, 'green'), display: 'inline-flex', alignItems: 'center', gap: 4 }}><MessageCircle size={14} /> WA</button>
      </a>
    )
    const BtnCall = () => (
      <a href={`tel:+51${tel}`}>
        <button style={{ ...getCrmButtonStyles(t, mode, 'blue'), display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={14} /></button>
      </a>
    )

    switch (opp.stage) {
      case 'Contactado':
        return (
          <div style={getCrmRowStyles()}>
            <BtnWA /><BtnCall />
            <button style={{ ...getCrmButtonStyles(t, mode, 'red'), display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => actualizarStage({ opp, nuevoStage: 'No captado' })}><X size={14} /></button>
          </div>
        )
      case 'Tasación':
        return (
          <div style={getCrmRowStyles()}>
            <BtnWA /><BtnCall />
            <button style={{ ...getCrmButtonStyles(t, mode, 'green'), display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => handleIniciarCaptacion(opp)}><PartyPopper size={14} /> Captado</button>
            <button style={{ ...getCrmButtonStyles(t, mode, 'red'), display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => actualizarStage({ opp, nuevoStage: 'No captado' })}><X size={14} /></button>
          </div>
        )
      case 'Seguimiento':
        return (
          <div style={getCrmRowStyles()}>
            <BtnWA /><BtnCall />
            <button style={{ ...getCrmButtonStyles(t, mode, 'green'), display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => handleIniciarCaptacion(opp)}><PartyPopper size={14} /> Captado</button>
            <button style={{ ...getCrmButtonStyles(t, mode, 'red'), display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => actualizarStage({ opp, nuevoStage: 'No captado' })}><X size={14} /></button>
          </div>
        )
      default:
        return null
    }
  }

  // ── Card de oportunidad ─────────────────────────────────────────────────────

  const OppCard = ({ opp, activities: acts }: { opp: any, activities: any[] }) => {
    const score = getScore(opp, acts)
    const esProp = opp.pipeline_type === 'propietario'

    const ahora = new Date()
    const pendingOppActivities = acts.filter(a => a.opportunity_id === opp.id && a.status === 'pending')
    const hasOverdue = pendingOppActivities.some(a => a.scheduled_at && new Date(a.scheduled_at) < ahora)
    const nextActivity = pendingOppActivities
      .filter(a => a.scheduled_at)
      .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0]

    return (
      <div style={getCrmCardStyles(t, mode, hasOverdue)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <strong style={{ fontSize: 14, color: t.colors.text }}>{opp.contacts?.nombre}</strong>
            {opp.status && opp.status !== 'active' && (
              <span style={{ fontSize: 10, marginLeft: 6, color: opp.status === 'paused' ? t.colors.warning : t.colors.textMuted, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                {opp.status === 'paused' ? <PauseCircle size={12} /> : opp.status === 'won' ? <CheckCircle size={12} /> : opp.status === 'lost' ? <XCircle size={12} /> : opp.status}
              </span>
            )}
            {!esProp && opp.properties && (
              <span style={{ fontSize: 12, color: t.colors.textSecondary, marginLeft: 8 }}>
                {opp.properties?.nombre} · {opp.properties?.precio}
              </span>
            )}
            <div style={{ fontSize: 11, color: t.colors.textMuted, marginTop: 2 }}>
              {STAGE_LABEL[opp.stage] || opp.stage}
              {nextActivity && (
                <span style={{ marginLeft: 8, color: hasOverdue ? t.colors.danger : t.colors.textSecondary, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  {hasOverdue ? <AlertTriangle size={12} /> : <Clock size={12} />}
                  {new Date(nextActivity.scheduled_at).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              )}
            </div>
          </div>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: getUrgencyColor(score, t), flexShrink: 0, marginTop: 4
          }} />
        </div>
        <div style={{ marginTop: 8 }}>
          {esProp
            ? <AccionesPropietario opp={opp} />
            : <AccionesLead opp={opp} />
          }
        </div>
        <div style={{ marginTop: 6, borderTop: `1px solid ${t.colors.border}`, paddingTop: 6 }}>
          <button 
            onClick={() => {
              setModalActividad({
                opp,
                tipo: 'call',
                resultado: '',
                nota: '',
                fecha: '',
              })
            }}
            style={{ background: 'none', border: 'none', color: t.crm.blue, fontSize: 12, cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <Plus size={14} /> Registrar actividad
          </button>
        </div>
      </div>
    )
  }

  // ── Activity Card (inline, solo para VistaHoy) ─────────────────────────────

  const ActivityCard = ({ activity }: { activity: any }) => {
    const opp = getOppForActivity(activity)
    if (!opp) return null

    const contact = opp.contacts
    const property = opp.properties
    const color = ACTIVITY_COLORS[activity.type] || t.colors.textMuted

    return (
      <div style={{
        borderLeft: `3px solid ${color}`,
        background: t.colors.bgCard,
        border: `1px solid ${t.colors.border}`,
        borderRadius: 8,
        padding: '10px 12px',
        marginBottom: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            {ACTIVITY_LABELS[activity.type] || activity.type}
            {activity.result && <span style={{ fontWeight: 400, color: t.colors.textMuted }}> · {getOutcomeLabel(activity.result)}</span>}
            {activity.result === 'confirmed' && (
              <span style={{ fontSize: 11, marginLeft: 4 }}>✅ Visita confirmada</span>
            )}
          </div>
          {contact?.telefono && (
            <div style={{ display: 'flex', gap: 2 }}>
              <a href={`https://wa.me/51${contact.telefono}?text=${encodeURIComponent(getMensaje(opp, getTipoMensaje(opp)))}`} target="_blank">
                <button style={{ ...getCrmButtonStyles(t, mode, 'green'), padding: '3px 6px', fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><MessageCircle size={12} /></button>
              </a>
              <a href={`tel:+51${contact.telefono}`}>
                <button style={{ ...getCrmButtonStyles(t, mode, 'blue'), padding: '3px 6px', fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={12} /></button>
              </a>
            </div>
          )}
        </div>
        <div style={{ fontSize: 12, color: t.colors.text, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
          <User size={12} /> {contact?.nombre || 'Sin nombre'}
          {property?.nombre && <span style={{ color: t.colors.textMuted, fontWeight: 400 }}> · {property.nombre}</span>}
        </div>
        <button
          onClick={() => abrirTimeline(opp)}
          style={{ fontSize: 11, color: t.colors.textMuted, marginTop: 2, background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 3 }}
        >
          <ClipboardList size={11} />
          {activity.scheduled_at ? formatFecha(activity.scheduled_at) : 'Ver historial'}
        </button>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          <button
            onClick={() => {
              setModalActividad({
                opp,
                activityId: activity.id,
                tipo: activity.type,
                resultado: '',
                nota: '',
                fecha: '',
              })
            }}
            disabled={loadingActivity === activity.id}
            style={{ ...getCrmButtonStyles(t, mode, 'green'), display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '3px 8px', opacity: loadingActivity === activity.id ? 0.5 : 1 }}
          ><CheckCircle size={12} /> {loadingActivity === activity.id ? '...' : 'Registrar resultado'}</button>
          {activity.scheduled_at && (
            <button
              onClick={() => abrirReagendar(activity.id)}
              disabled={loadingActivity === activity.id}
              style={{ ...getCrmButtonStyles(t, mode, 'gray'), display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '3px 8px', opacity: loadingActivity === activity.id ? 0.5 : 1 }}
            ><Calendar size={12} /> Reagendar</button>
          )}
          <button
            onClick={() => actualizarStage({ opp, nuevoStage: opp.pipeline_type === 'propietario' ? 'No captado' : 'Perdido' })}
            disabled={loadingActivity === activity.id}
            style={{ ...getCrmButtonStyles(t, mode, 'red'), display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '3px 8px', opacity: loadingActivity === activity.id ? 0.5 : 1 }}
          ><X size={12} /> Descartar</button>
        </div>
      </div>
    )
  }

  // ── Sección colapsable ──────────────────────────────────────────────────────

  const Seccion = ({ icon, label, count, children, color }: {
    icon: ReactNode; label: string; count: number; children: React.ReactNode; color?: string
  }) => {
    if (count === 0) return null
    return (
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ ...getCrmSectionTitle(t), color: color || t.colors.textSecondary, marginBottom: 8 }}>
          {icon} {label} ({count})
        </h3>
        {children}
      </div>
    )
  }

  // ── Timeline Item (inline, para modal) ─────────────────────────────────────

  const TimelineItem = ({ activity }: { activity: any }) => {
    const color = ACTIVITY_COLORS[activity.type] || t.colors.textMuted
    const label = ACTIVITY_LABELS[activity.type] || activity.type
    return (
      <div style={{
        borderLeft: `3px solid ${color}`,
        background: activity.status === 'completed' ? t.colors.bgSecondary : t.colors.bgCard,
        border: `1px solid ${t.colors.border}`,
        borderRadius: 6,
        padding: '8px 10px',
        marginBottom: 6,
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
          {label}
          {activity.result && <span style={{ fontWeight: 400, color: t.colors.textMuted }}> · {getOutcomeLabel(activity.result)}</span>}
          {activity.result === 'confirmed' && (
            <span style={{ fontSize: 11, marginLeft: 4 }}>✅ Visita confirmada</span>
          )}
        </div>
        {activity.note && (
          <div style={{ fontSize: 11, color: t.colors.textMuted, marginTop: 1, fontStyle: 'italic' }}>
            "{activity.note}"
          </div>
        )}
        <div style={{ fontSize: 10, color: t.colors.textMuted, marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
          <span>{activity.scheduled_at ? formatFecha(activity.scheduled_at) : '—'}</span>
          <span style={{
            color: activity.status === 'completed' ? t.colors.success : t.crm.orange,
            fontWeight: 600,
          }}>
            {activity.status === 'completed' ? 'Completada' : 'Pendiente'}
          </span>
        </div>
      </div>
    )
  }

  // ── Vista HOY ───────────────────────────────────────────────────────────────

  const VistaHoy = () => {
    const totalPendientes = pendingOnly.length
    const totalVencidas = vencidasRecientes.length + abandonadas.length

    return (
      <div>
        {/* Resumen numérico */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8, marginBottom: 16
        }}>
          {[
            { label: 'Pendientes', val: totalPendientes, color: totalPendientes > 0 ? t.colors.danger : t.colors.success, icon: <Flame size={16} /> },
            { label: 'Vencidas', val: totalVencidas, color: totalVencidas > 0 ? t.crm.orange : t.colors.textMuted, icon: <AlertTriangle size={16} /> },
            { label: 'Propietarios', val: propietarios.length, color: t.crm.purple, icon: <Home size={16} /> },
            { label: 'Compradores', val: leads.length, color: t.crm.blue, icon: <Users size={16} /> },
          ].map(s => (
            <div key={s.label} style={getCrmStatsCardStyles(t)}>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>{s.icon} {s.val}</div>
              <div style={{ fontSize: 10, color: t.colors.textMuted, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <Seccion icon={<AlertTriangle size={14} />} label="Vencidas recientes" count={vencidasRecientes.length} color="#ef4444">
          {vencidasRecientes.map(a => <ActivityCard key={a.id} activity={a} />)}
        </Seccion>

        <Seccion icon={<Trash2 size={14} />} label="Abandonadas" count={abandonadas.length} color="#94a3b8">
          {abandonadas.map(a => <ActivityCard key={a.id} activity={a} />)}
        </Seccion>

        <Seccion icon={<Flame size={14} />} label="Hoy" count={hoyAct.length} color="#f97316">
          {hoyAct.map(a => <ActivityCard key={a.id} activity={a} />)}
        </Seccion>

        <Seccion icon={<Clock size={14} />} label="Próximas" count={proximas.length} color="#3b82f6">
          {proximas.map(a => <ActivityCard key={a.id} activity={a} />)}
        </Seccion>

        <Seccion icon={<Moon size={14} />} label="Sin próxima acción" count={oppsSinActividad.length} color="#64748b">
          {oppsSinActividad.map(opp => (
            <div key={opp.id} style={{
              background: t.colors.bgCard, border: `1px solid ${t.colors.border}`,
              borderRadius: 8, padding: '10px 12px', marginBottom: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {opp.contacts?.nombre || 'Sin nombre'}
                    {opp.properties?.nombre && <span style={{ fontWeight: 400, color: t.colors.textSecondary }}> · {opp.properties.nombre}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: t.colors.textSecondary, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {STAGE_LABEL[opp.stage] || opp.stage}
                    {opp.pipeline_type === 'propietario' && <Home size={12} />}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {opp.contacts?.telefono && (
                    <>
                      <a href={`https://wa.me/51${opp.contacts.telefono}?text=${encodeURIComponent(getMensaje(opp, getTipoMensaje(opp)))}`} target="_blank">
                        <button style={{ ...getCrmButtonStyles(t, mode, 'green'), padding: '3px 6px', fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><MessageCircle size={12} /></button>
                      </a>
                      <a href={`tel:+51${opp.contacts.telefono}`}>
                        <button style={{ ...getCrmButtonStyles(t, mode, 'blue'), padding: '3px 6px', fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={12} /></button>
                      </a>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setQuickAdd({
                        opp,
                        tipo: 'call',
                        nota: '',
                        fecha: '',
                      })
                    }}
                    style={{ ...getCrmButtonStyles(t, mode, 'purple'), padding: '3px 6px', fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  ><Plus size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </Seccion>

        {totalPendientes === 0 && oppsSinActividad.length === 0 && (
          <div style={getCrmEmptyStateStyles(t)}>
            <div style={{ fontSize: 32 }}><CheckCircle size={32} /></div>
            <p style={{ marginTop: 8 }}>Todo al día — sin trabajo pendiente</p>
          </div>
        )}
      </div>
    )
  }

  // ── Vista Leads ─────────────────────────────────────────────────────────────

  const VistaLeads = () => {
    const porStage = STAGES_LEAD.filter(s => s !== 'Cerrado' && s !== 'Perdido')
    return (
      <div>
        {porStage.map(stage => {
          const grupo = leads.filter(o => o.stage === stage)
          if (grupo.length === 0) return null
          return (
            <div key={stage} style={{ marginBottom: 16 }}>
              <h3 style={getCrmSectionTitle(t)}>{STAGE_LABEL[stage] || stage} ({grupo.length})</h3>
              {ordenar(grupo, activities).map(o => <OppCard key={o.id} opp={o} activities={activities} />)}
            </div>
          )
        })}
        {leads.length === 0 && (
          <div style={getCrmEmptyStateStyles(t)}>
            <div style={{ fontSize: 32 }}><Inbox size={32} /></div>
            <p>Sin compradores activos</p>
          </div>
        )}
      </div>
    )
  }

  // ── Vista Propietarios ──────────────────────────────────────────────────────

  const VistaPropietarios = () => {
    const porStage = STAGES_PROPIETARIO.filter(s => s !== 'Captado' && s !== 'No captado')
    return (
      <div>
        {porStage.map(stage => {
          const grupo = propietarios.filter(o => o.stage === stage)
          if (grupo.length === 0) return null
          return (
            <div key={stage} style={{ marginBottom: 16 }}>
              <h3 style={getCrmSectionTitle(t)}>{STAGE_LABEL[stage] || stage} ({grupo.length})</h3>
              {ordenar(grupo, activities).map(o => <OppCard key={o.id} opp={o} activities={activities} />)}
            </div>
          )
        })}
        {propietarios.length === 0 && (
          <div style={getCrmEmptyStateStyles(t)}>
            <div style={{ fontSize: 32 }}><Home size={32} /></div>
            <p>Sin propietarios en captación</p>
          </div>
        )}
      </div>
    )
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: t.colors.bg, minHeight: '100vh', color: t.colors.text, fontFamily: t.fonts.family }}>

      {/* Header */}
      <div style={getCrmHeaderStyles(t, mode)}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>CRM</span>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          style={{
            background: t.crm.blue, color: '#fff', border: 'none',
            borderRadius: 6, padding: '6px 14px', fontSize: 14, cursor: 'pointer'
          }}
        >
          + Nuevo
        </button>
      </div>

      {/* Form crear */}
      {mostrarForm && (
        <div style={{
          background: t.colors.bgCard, borderBottom: `1px solid ${t.colors.border}`,
          padding: '14px 16px'
        }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <button
              onClick={() => setPipelineNuevo('lead')}
              style={{
                ...getCrmButtonStyles(t, mode, pipelineNuevo === 'lead' ? 'blue' : 'ghost'),
                flex: 1, padding: '8px 0'
              }}
            >
              <Users size={14} /> Comprador
            </button>
            <button
              onClick={() => setPipelineNuevo('propietario')}
              style={{
                ...getCrmButtonStyles(t, mode, pipelineNuevo === 'propietario' ? 'purple' : 'ghost'),
                flex: 1, padding: '8px 0'
              }}
            >
              <Home size={14} /> Propietario
            </button>
          </div>
          <input
            placeholder="Nombre *"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            style={getCrmInputStyles(t)}
          />
          <input
            placeholder="Teléfono *"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            style={getCrmInputStyles(t)}
            type="tel"
          />
          {pipelineNuevo === 'lead' && (
            <select
              onChange={e => setPropertyId(e.target.value)}
              value={propertyId}
              style={getCrmInputStyles(t)}
            >
              <option value="">Propiedad (opcional)</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          )}
          <select
            onChange={e => setStageInicial(e.target.value)}
            value={stageInicial}
            style={getCrmInputStyles(t)}
          >
            {(pipelineNuevo === 'lead' ? STAGES_LEAD : STAGES_PROPIETARIO)
              .filter(s => s !== 'Cerrado' && s !== 'Perdido' && s !== 'Captado' && s !== 'No captado')
              .map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
          </select>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <button onClick={handleCrearOpp} style={{ ...getCrmButtonStyles(t, mode, 'blue'), flex: 1, padding: '10px 0' }}>
              Crear
            </button>
            <button onClick={() => setMostrarForm(false)} style={{ ...getCrmButtonStyles(t, mode, 'ghost'), padding: '10px 16px' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={getCrmTabsStyles(t)}>
        {([
          { key: 'hoy', label: <><Flame size={14} /> Hoy</>, badge: pendingOnly.length },
          { key: 'leads', label: <><Users size={14} /> Compradores</>, badge: leads.length },
          { key: 'propietarios', label: <><Home size={14} /> Propietarios</>, badge: propietarios.length },
        ] as { key: Vista; label: ReactNode; badge: number }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setVista(tab.key)}
            style={getCrmTabStyles(t, vista === tab.key)}
          >
            {tab.label}
            {tab.badge > 0 && (
              <span style={getCrmBadgeStyles(t, vista === tab.key)}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div style={getCrmContentStyles(t)}>
        {vista === 'hoy' && <VistaHoy />}
        {vista === 'leads' && <VistaLeads />}
        {vista === 'propietarios' && <VistaPropietarios />}
      </div>

      {/* Programador de acción (bottom sheet) */}
      {programador && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: t.colors.bgCard, borderTop: `2px solid ${t.crm.headerBg}`,
          padding: 16, zIndex: 200,
          boxShadow: mode === 'dark' ? '0 -4px 20px rgba(0,0,0,0.4)' : '0 -4px 20px rgba(0,0,0,0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <strong style={{ fontSize: 15 }}>
              {programador.evento ? `${programador.evento} — ` : 'Siguiente Acción — '}
              {programador.opp.contacts?.nombre}
            </strong>
            <button onClick={() => setProgramador(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}><X size={18} /></button>
          </div>
          
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {TIPOS_ACTIVIDAD.map(item => (
              <button
                key={item.value}
                onClick={() => setProgramador(p => p ? { ...p, tipoActividad: item.value } : null)}
                style={{
                  ...getCrmButtonStyles(t, mode, programador.tipoActividad === item.value ? 'blue' : 'ghost'),
                  padding: '6px 10px', fontSize: 12
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <input
            type="datetime-local"
            value={programador.fecha}
            onChange={e => setProgramador(p => p ? { ...p, fecha: e.target.value } : null)}
            step="300"
            style={{ ...getCrmInputStyles(t), marginBottom: 8 }}
          />
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {[1, 2, 7].map(d => (
              <button key={d} onClick={() => setProgramador(p => p ? { ...p, fecha: getFechaLocalOffset(d * 24) } : null)} style={getCrmButtonStyles(t, mode, 'ghost')}>
                +{d}d
              </button>
            ))}
          </div>
          <input
            placeholder="Nota (opcional)"
            value={programador.nota}
            onChange={e => setProgramador(p => p ? { ...p, nota: e.target.value } : null)}
            style={{ ...getCrmInputStyles(t), marginBottom: 8 }}
          />
          <button onClick={guardarAccion} style={{ ...getCrmButtonStyles(t, mode, 'blue'), width: '100%', padding: '12px 0', fontSize: 15 }}>
            Guardar
          </button>
        </div>
      )}

      {/* Modal Actividad Manual */}
      {modalActividad && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: t.colors.bgCard, borderTop: `2px solid ${t.crm.blue}`,
          padding: 16, zIndex: 200,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <strong style={{ fontSize: 15 }}>
              Nueva Actividad — {modalActividad.opp.contacts?.nombre}
            </strong>
            <button onClick={() => setModalActividad(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}><X size={18} /></button>
          </div>
          
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {TIPOS_ACTIVIDAD.map(item => (
              <button
                key={item.value}
                onClick={() => setModalActividad(m => m ? { ...m, tipo: item.value } : null)}
                style={{
                  ...getCrmButtonStyles(t, mode, modalActividad.tipo === item.value ? 'blue' : 'ghost'),
                  padding: '6px 10px', fontSize: 12
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          
          <select
            value={modalActividad.resultado}
            onChange={e => setModalActividad(m => m ? { ...m, resultado: e.target.value } : null)}
            style={{ ...getCrmInputStyles(t), marginBottom: 8 }}
          >
            <option value="">Seleccionar resultado...</option>
            {getOutcomesForActivity(modalActividad.tipo).map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          
          <input
            type="datetime-local"
            value={modalActividad.fecha}
            onChange={e => setModalActividad(m => m ? { ...m, fecha: e.target.value } : null)}
            step="300"
            style={{ ...getCrmInputStyles(t), marginBottom: 8 }}
            placeholder="Programar para más tarde (opcional)"
          />
          
          <input
            placeholder="Nota adicional (opcional)"
            value={modalActividad.nota}
            onChange={e => setModalActividad(m => m ? { ...m, nota: e.target.value } : null)}
            style={{ ...getCrmInputStyles(t), marginBottom: 8 }}
          />
          
          <button 
            onClick={handleRegistrarActividad}
            disabled={!modalActividad.tipo || !modalActividad.resultado}
            style={{ 
              ...getCrmButtonStyles(t, mode, 'blue'), 
              width: '100%', 
              padding: '12px 0', 
              fontSize: 15,
              opacity: (!modalActividad.tipo || !modalActividad.resultado) ? 0.5 : 1
            }}
          >
            Registrar
          </button>
        </div>
      )}

      {/* Reagendar bottom sheet */}
      {reagendarActId && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: t.colors.bgCard, borderTop: `2px solid ${t.crm.blue}`,
          padding: 16, zIndex: 200,
          boxShadow: mode === 'dark' ? '0 -4px 20px rgba(0,0,0,0.4)' : '0 -4px 20px rgba(0,0,0,0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <strong style={{ fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Calendar size={16} /> Reagendar actividad</strong>
            <button onClick={() => setReagendarActId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}><X size={18} /></button>
          </div>
          <input
            type="datetime-local"
            value={reagendarFecha}
            onChange={e => setReagendarFecha(e.target.value)}
            step="300"
            style={{ ...getCrmInputStyles(t), marginBottom: 8 }}
          />
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {[1, 2, 7].map(d => (
              <button key={d} onClick={() => setReagendarFecha(getFecha(d))} style={getCrmButtonStyles(t, mode, 'ghost')}>
                +{d}d
              </button>
            ))}
          </div>
          <button
            onClick={() => reagendarActividad(reagendarActId, reagendarFecha)}
            disabled={loadingActivity === reagendarActId}
            style={{ ...getCrmButtonStyles(t, mode, 'blue'), width: '100%', padding: '12px 0', fontSize: 15, opacity: loadingActivity === reagendarActId ? 0.5 : 1 }}
          >
            {loadingActivity === reagendarActId ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      )}

      {/* Timeline Modal */}
      {timelineOpen && selectedOpp && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: t.colors.bgCard, borderTop: `2px solid ${t.crm.headerBg}`,
          padding: 16, zIndex: 200,
          boxShadow: mode === 'dark' ? '0 -4px 20px rgba(0,0,0,0.4)' : '0 -4px 20px rgba(0,0,0,0.15)',
          maxHeight: '60vh', overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <strong style={{ fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 6 }}><ClipboardList size={16} /> Historial — {selectedOpp.contacts?.nombre || 'Sin nombre'}</strong>
            <button onClick={cerrarTimeline} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}><X size={18} /></button>
          </div>
          {timelineLoading ? (
            <div style={{ textAlign: 'center', padding: 20, color: '#94a3b8' }}>Cargando...</div>
          ) : timeline.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20, color: '#94a3b8' }}>Sin actividades registradas</div>
          ) : (
            <>
              {timeline.filter(a => a.status === 'pending').length > 0 && (
                <>
                  <div style={{ fontSize: 11, fontWeight: 600, color: t.crm.orange, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> Pendientes</div>
                  {timeline.filter(a => a.status === 'pending').map(a => <TimelineItem key={a.id} activity={a} />)}
                </>
              )}
              {timeline.filter(a => a.status === 'completed').length > 0 && (
                <>
                  <div style={{ fontSize: 11, fontWeight: 600, color: t.colors.success, marginTop: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: 4 }}><CheckCircle size={14} /> Completadas</div>
                  {timeline.filter(a => a.status === 'completed').map(a => <TimelineItem key={a.id} activity={a} />)}
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Quick Add bottom sheet */}
      {quickAdd && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: t.colors.bgCard, borderTop: `2px solid ${t.crm.purple}`,
          padding: 16, zIndex: 200,
          boxShadow: mode === 'dark' ? '0 -4px 20px rgba(0,0,0,0.4)' : '0 -4px 20px rgba(0,0,0,0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <strong style={{ fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Plus size={16} /> Agendar actividad — {quickAdd.opp.contacts?.nombre}</strong>
            <button onClick={() => setQuickAdd(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}><X size={18} /></button>
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {TIPOS_ACTIVIDAD.map(item => (
              <button
                key={item.value}
                onClick={() => setQuickAdd(q => q ? { ...q, tipo: item.value } : null)}
                style={{ ...getCrmButtonStyles(t, mode, quickAdd.tipo === item.value ? 'blue' : 'ghost'), padding: '6px 10px', fontSize: 12 }}
              >{item.label}</button>
            ))}
          </div>

          <input
            type="datetime-local"
            value={quickAdd.fecha}
            onChange={e => setQuickAdd(q => q ? { ...q, fecha: e.target.value } : null)}
            step="300"
            style={{ ...getCrmInputStyles(t), marginBottom: 8 }}
            placeholder="Programar (opcional)"
          />

          <input
            placeholder="Nota (opcional)"
            value={quickAdd.nota}
            onChange={e => setQuickAdd(q => q ? { ...q, nota: e.target.value } : null)}
            style={{ ...getCrmInputStyles(t), marginBottom: 8 }}
          />

          <button
            onClick={handleQuickAdd}
            disabled={loadingActivity === 'quickAdd'}
            style={{ ...getCrmButtonStyles(t, mode, 'purple'), width: '100%', padding: '12px 0', fontSize: 15, opacity: loadingActivity === 'quickAdd' ? 0.5 : 1 }}
          >
            {loadingActivity === 'quickAdd' ? 'Guardando...' : 'Agendar'}
          </button>
        </div>
      )}

      {/* Modal Captación Propietario */}
      {mostrarModalCaptacion && captacionOpp && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: t.colors.bgCard, borderTop: `2px solid ${t.crm.purple}`,
          padding: 16, zIndex: 200,
          boxShadow: mode === 'dark' ? '0 -4px 20px rgba(0,0,0,0.4)' : '0 -4px 20px rgba(0,0,0,0.15)',
          maxHeight: '80vh', overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <strong style={{ fontSize: 15 }}>
              Captar propietario — {captacionOpp.contacts?.nombre}
            </strong>
            <button onClick={() => setMostrarModalCaptacion(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}><X size={18} /></button>
          </div>
          
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            <button
              onClick={() => setCaptarModo('crear')}
              style={{ ...getCrmButtonStyles(t, mode, captarModo === 'crear' ? 'purple' : 'ghost'), flex: 1, display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <Plus size={14} /> Crear propiedad
            </button>
            <button
              onClick={() => setCaptarModo('vincular')}
              style={{ ...getCrmButtonStyles(t, mode, captarModo === 'vincular' ? 'purple' : 'ghost'), flex: 1, display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <Link size={14} /> Vincular existente
            </button>
          </div>
          
          {captarModo === 'crear' ? (
            <>
              <input
                placeholder="Nombre de la propiedad *"
                value={propiedadNombre}
                onChange={e => setPropiedadNombre(e.target.value)}
                style={{ ...getCrmInputStyles(t), marginBottom: 8 }}
              />
              <input
                placeholder="Precio (ej: 150000)"
                value={propiedadPrecio}
                onChange={e => setPropiedadPrecio(e.target.value)}
                style={{ ...getCrmInputStyles(t), marginBottom: 8 }}
                type="number"
              />
              <input
                placeholder="Distrito *"
                value={propiedadDistrito}
                onChange={e => setPropiedadDistrito(e.target.value)}
                style={{ ...getCrmInputStyles(t), marginBottom: 8 }}
              />
              <button 
                onClick={async () => {
                  if (!propiedadNombre || !propiedadDistrito) {
                    alert('Nombre y distrito son obligatorios')
                    return
                  }
                  const { data: nuevaProp } = await supabase.from('properties').insert([{
                    nombre: propiedadNombre,
                    precio: parseFloat(propiedadPrecio) || 0,
                    distrito: propiedadDistrito,
                    tipo: 'Departamento',
                    operacion: 'venta',
                    estado: 'disponible',
                    moneda: 'USD',
                    user_id: userId,
                  }]).select().single()
                  
                  if (nuevaProp) {
                    await handleCompletarCaptacion(nuevaProp.id)
                  }
                }}
                disabled={!propiedadNombre || !propiedadDistrito}
                style={{ 
                  ...getCrmButtonStyles(t, mode, 'purple'), 
                  width: '100%', 
                  padding: '12px 0', 
                  fontSize: 15,
                  opacity: (!propiedadNombre || !propiedadDistrito) ? 0.5 : 1
                }}
              >
                Crear y captar
              </button>
            </>
          ) : (
            <>
              <select
                value={propiedadIdSeleccionada}
                onChange={e => setPropiedadIdSeleccionada(e.target.value)}
                style={{ ...getCrmInputStyles(t), marginBottom: 8 }}
              >
                <option value="">Seleccionar propiedad...</option>
                {properties.filter(p => !p.propietario_id).map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} — {p.distrito}</option>
                ))}
              </select>
              <button 
                onClick={async () => {
                  if (!propiedadIdSeleccionada) {
                    alert('Selecciona una propiedad')
                    return
                  }
                  await handleCompletarCaptacion(propiedadIdSeleccionada)
                }}
                disabled={!propiedadIdSeleccionada}
                style={{ 
                  ...getCrmButtonStyles(t, mode, 'purple'), 
                  width: '100%', 
                  padding: '12px 0', 
                  fontSize: 15,
                  opacity: !propiedadIdSeleccionada ? 0.5 : 1
                }}
              >
                Vincular y captar
              </button>
              {properties.filter(p => !p.propietario_id).length === 0 && (
                <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 8 }}>
                  No hay propiedades disponibles para vincular
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
