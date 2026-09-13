import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Map as MapLibreMap,
  NavigationControl,
  AttributionControl,
  Popup,
  type MapGeoJSONFeature,
  type MapLayerMouseEvent,
  type StyleSpecification,
} from 'maplibre-gl';
import { INDIA_CENTER, mapPoints, type MapPoint } from '../data/mapPoints';
import type { RiskLevel } from '../engine/types';

const PIN_COLORS: Record<RiskLevel, string> = {
  High: '#b3261e',
  Medium: '#b7791f',
  Low: '#2f6b3a',
};

const LEVEL_CLASS: Record<RiskLevel, string> = {
  High: 'border-risk-high text-risk-high',
  Medium: 'border-risk-medium text-risk-medium',
  Low: 'border-risk-low text-risk-low',
};

/** MapTiler-hosted MapLibre style; falls back to a keyless OSM raster style. */
const MAPTILER_STYLE = (key: string) =>
  `https://api.maptiler.com/maps/dataviz/style.json?key=${key}`;
const OSM_RASTER_STYLE: StyleSpecification = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

/** One GeoJSON Feature per monitored project. */
function buildGeoJSON(points: MapPoint[]): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: 'FeatureCollection',
    features: points.map((p) => ({
      type: 'Feature',
      id: Number(p.id.replace(/\D/g, '').slice(-8)) || undefined,
      properties: {
        id: p.id,
        name: p.name,
        district: p.district,
        state: p.state,
        riskLevel: p.riskLevel,
        riskScore: p.riskScore,
        progressPct: p.progressPct,
        summary: p.summary,
        // drivers joined with a newline; split on read to survive JSON stringify
        drivers: p.drivers.join('\n'),
      },
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
    })),
  };
}

function featureToPoint(f: MapGeoJSONFeature): MapPoint | null {
  const p = f.properties;
  if (!p || !p.id) return null;
  const hit = mapPoints.find((m) => m.id === p.id);
  return hit ?? null;
}

/** Popup body, also used by the fallback card list so content stays in sync. */
export function popupHTML(point: MapPoint): string {
  const drivers = point.drivers
    .map((d) => `<li>${d.replace(/</g, '&lt;')}</li>`)
    .join('');
  return `
    <div class="bs-popup">
      <p class="bs-popup-title">${point.name}</p>
      <p class="bs-popup-sub">${point.district}, ${point.state}</p>
      <p class="bs-popup-score">Risk score: <strong>${point.riskScore}</strong> / 100 ·
        <span class="bs-popup-level bs-level-${point.riskLevel.toLowerCase()}">${point.riskLevel}</span></p>
      <ul class="bs-popup-drivers">${drivers}</ul>
      <a class="bs-popup-link" href="#/dashboard">View Full Report →</a>
    </div>`;
}

interface RiskMapProps {
  /** MapTiler key; falls back to keyless OSM raster tiles when absent. */
  apiKey?: string;
}

export default function RiskMap({
  apiKey = import.meta.env.VITE_MAPTILER_KEY,
}: RiskMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const [failed, setFailed] = useState(false);

  const geojson = useMemo(() => buildGeoJSON(mapPoints), []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const style = apiKey ? MAPTILER_STYLE(apiKey) : OSM_RASTER_STYLE;
    const map = new MapLibreMap({
      container: containerRef.current,
      style,
      center: [INDIA_CENTER.lng, INDIA_CENTER.lat],
      zoom: 4.4,
      attributionControl: false,
    });
    mapRef.current = map;

    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(
      new AttributionControl({ compact: true }),
      'bottom-right',
    );
    if (!apiKey) {
      // OSM raster tiles are 256px @1x; flag the visual downgrade.
      console.info('Bhoomi Setu: no VITE_MAPTILER_KEY set — using OpenStreetMap raster tiles.');
    }

    const popup = new Popup({ offset: 18, maxWidth: '300px' });
    popupRef.current = popup;

    const onClickPoint = (e: MapLayerMouseEvent) => {
      const point = e.features?.[0] ? featureToPoint(e.features[0]) : null;
      if (!point) return;
      popup.setLngLat(e.lngLat).setHTML(popupHTML(point)).addTo(map);
    };

    const onEnter = () => (map.getCanvas().style.cursor = 'pointer');
    const onLeave = () => (map.getCanvas().style.cursor = '');

    const onStyleError = () => setFailed(true);
    map.on('error', onStyleError);

    map.on('load', () => {
      map.addSource('projects', { type: 'geojson', data: geojson });
      map.addLayer({
        id: 'project-pins',
        type: 'circle',
        source: 'projects',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3, 7,
            6, 12,
          ],
          'circle-color': [
            'match',
            ['get', 'riskLevel'],
            'High', PIN_COLORS.High,
            'Medium', PIN_COLORS.Medium,
            PIN_COLORS.Low,
          ],
          'circle-stroke-color': '#f4f0e6',
          'circle-stroke-width': 2,
        },
      });

      map.on('click', 'project-pins', onClickPoint);
      map.on('mouseenter', 'project-pins', onEnter);
      map.on('mouseleave', 'project-pins', onLeave);
    });

    return () => {
      popup.remove();
      map.remove();
      mapRef.current = null;
      popupRef.current = null;
    };
  }, [apiKey, geojson]);

  const showFallback = failed;

  return (
    <div className="relative">
      <div ref={containerRef} className="h-[420px] w-full sm:h-[520px]" />

      {/* Fixed legend overlay — flat, hairline-bordered, consistent with the portal. */}
      <div className="absolute left-3 top-3 z-10 border border-line bg-parchment/95 px-3 py-2">
        <p className="text-[11px] font-semibold text-ink">Risk level</p>
        <ul className="mt-1.5 space-y-1 text-xs text-ink-soft">
          {(['High', 'Medium', 'Low'] as const).map((lv) => (
            <li key={lv} className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: PIN_COLORS[lv] }}
              />
              {lv}
            </li>
          ))}
        </ul>
        {!apiKey && (
          <p className="mt-2 max-w-[190px] text-[10px] leading-snug text-ink-faint">
            OpenStreetMap tiles — set VITE_MAPTILER_KEY for MapTiler basemaps.
          </p>
        )}
      </div>

      {showFallback && (
        <div className="absolute inset-0 z-20 border border-line bg-parchment p-6 overflow-auto">
          <p className="font-serif text-lg font-bold text-ink">Map tiles unavailable</p>
          <p className="mt-1 max-w-xl text-sm text-ink-soft">
            The basemap failed to load (invalid key or network issue). All{' '}
            {mapPoints.length} monitored projects remain listed below.
          </p>
          <ul className="mt-4 space-y-1.5">
            {mapPoints.map((p) => (
              <li key={p.id} className="flex items-center gap-2 text-sm">
                <span className={`inline-block h-2.5 w-2.5 border ${LEVEL_CLASS[p.riskLevel]} bg-current`} />
                <span className="font-medium text-ink">{p.name}</span>
                <span className="text-xs text-ink-faint">
                  · {p.district}, {p.state} · score {p.riskScore}
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setFailed(false)}
            className="mt-4 border border-accent bg-accent px-4 py-1.5 text-sm font-semibold text-parchment hover:bg-accent-deep"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="ml-2 border border-line-strong px-4 py-1.5 text-sm font-semibold text-ink hover:bg-parchment-deep"
          >
            Reload page
          </button>
        </div>
      )}
    </div>
  );
}
