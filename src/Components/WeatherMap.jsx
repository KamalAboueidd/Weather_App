import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

const customMarker = divIcon({
  className: 'custom-map-marker',
  html: `<div style="display:flex;justify-content:center;align-items:flex-end;transform:translateY(4px);"><span style="width:32px;height:32px;border-radius:50%;background:rgba(14,165,233,0.15);border:2px solid #0ea5e9;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 6px rgba(14,165,233,0.12);"><span style="width:12px;height:12px;border-radius:50%;background:#0ea5e9;box-shadow:0 0 0 6px rgba(14,165,233,0.18);"></span></span></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -32],
  tooltipAnchor: [0, -32],
})

function MapSelector({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng)
    },
  })
  return null
}

function MapAutoCenter({ position }) {
  const map = useMap()

  useEffect(() => {
    if (position?.lat != null && position?.lon != null) {
      map.flyTo([position.lat, position.lon], 8, { duration: 1.2 })
    }
  }, [map, position])

  return null
}

export default function WeatherMap({ position, onSelectLocation, onGoHome }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 shadow-sm">
      <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-3xl bg-white/95 px-4 py-3 text-sm text-slate-900 shadow-md">
        <p className="font-semibold">Tap on the map to select a place</p>
        <p className="text-xs text-slate-500">The weather updates automatically.</p>
      </div>
      <button
        type="button"
        onClick={onGoHome}
        className="absolute right-4 bottom-5 z-20 rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-sky-500/20 transition hover:bg-sky-500"
      >
        My location
      </button>
      <MapContainer
        center={[position.lat ?? 30.0444, position.lon ?? 31.2357]}
        zoom={6}
        scrollWheelZoom={true}
        className="h-[540px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapAutoCenter position={position} />
        <Marker position={[position.lat ?? 30.0444, position.lon ?? 31.2357]} icon={customMarker}>
          <Popup closeButton={false} className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-lg">
            <div className="text-sm font-semibold">Selected location</div>
            <div className="mt-1 text-xs text-slate-500">{position.name || position.label || 'Selected point'}</div>
          </Popup>
          <Tooltip direction="top" offset={[0, -28]} opacity={1} className="rounded-3xl border border-slate-200 bg-slate-950/90 px-3 py-2 text-xs text-white shadow-lg">
            {position.name || position.label || 'Selected point'}
          </Tooltip>
        </Marker>
        <MapSelector onSelect={onSelectLocation} />
      </MapContainer>
    </div>
  )
}
