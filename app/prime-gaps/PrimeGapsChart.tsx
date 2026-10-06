'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type PrimesPayload = {
  source: string;
  source_url: string;
  source_note: string;
  count: number;
  first: number;
  last: number;
  primes: number[];
  gaps: number[];
};

type PlotlyModule = {
  newPlot: (el: HTMLElement, data: unknown[], layout: unknown, config?: unknown) => Promise<unknown>;
  react: (el: HTMLElement, data: unknown[], layout: unknown, config?: unknown) => Promise<unknown>;
  relayout: (el: HTMLElement, update: Record<string, unknown>) => Promise<unknown>;
  purge: (el: HTMLElement) => void;
};

declare global {
  interface Window {
    Plotly?: PlotlyModule;
  }
}

const PLOTLY_CDN = 'https://cdn.plot.ly/plotly-2.35.2.min.js';
const DATA_URL = '/data/primes-100k.json';

function loadPlotly(): Promise<PlotlyModule> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Plotly needs the browser'));
  }
  if (window.Plotly) return Promise.resolve(window.Plotly);

  const existing = document.querySelector<HTMLScriptElement>(`script[src="${PLOTLY_CDN}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => {
        if (window.Plotly) resolve(window.Plotly);
        else reject(new Error('Plotly failed to load'));
      });
      existing.addEventListener('error', () => reject(new Error('Plotly script error')));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = PLOTLY_CDN;
    script.async = true;
    script.onload = () => {
      if (window.Plotly) resolve(window.Plotly);
      else reject(new Error('Plotly failed to load'));
    };
    script.onerror = () => reject(new Error('Plotly script error'));
    document.head.appendChild(script);
  });
}

function twinColors(gaps: number[]): string[] {
  return gaps.map((g) => (g === 2 ? '#0057a8' : '#c4b8a4'));
}

export default function PrimeGapsChart() {
  const plotRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<PrimesPayload | null>(null);
  const indicesRef = useRef<number[]>([]);
  const [status, setStatus] = useState('Loading prime list…');
  const [meta, setMeta] = useState('');
  const [mode, setMode] = useState<'gap' | 'twin'>('gap');
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildTrace = useCallback((payload: PrimesPayload, colorMode: 'gap' | 'twin') => {
    const isTwin = colorMode === 'twin';
    return {
      type: 'scattergl',
      mode: 'markers',
      x: payload.gaps,
      y: payload.primes,
      customdata: indicesRef.current,
      marker: isTwin
        ? {
            size: 3,
            color: twinColors(payload.gaps),
            opacity: 0.8,
          }
        : {
            size: 3,
            color: payload.gaps,
            colorscale: 'Viridis',
            opacity: 0.72,
            colorbar: {
              title: { text: 'Gap', side: 'right' },
              thickness: 14,
              len: 0.55,
            },
          },
      hovertemplate:
        'Index: %{customdata}<br>' +
        'Prime: %{y}<br>' +
        'Gap to next: %{x}' +
        '<extra></extra>',
    };
  }, []);

  const layout = useCallback(
    () => ({
      paper_bgcolor: '#fffaf0',
      plot_bgcolor: '#f2ecdf',
      font: { color: '#171717', family: 'Arial, Helvetica, sans-serif', size: 12 },
      margin: { l: 64, r: 28, t: 16, b: 52 },
      xaxis: {
        title: { text: 'Gap to next prime (pₙ₊₁ − pₙ)' },
        gridcolor: '#d9d0bf',
        zeroline: false,
        rangemode: 'tozero' as const,
      },
      yaxis: {
        title: { text: 'Prime number' },
        gridcolor: '#d9d0bf',
        zeroline: false,
      },
      dragmode: 'pan' as const,
      hovermode: 'closest' as const,
    }),
    [],
  );

  const config = {
    responsive: true,
    scrollZoom: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false,
  };

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        setStatus('Loading Plotly…');
        const Plotly = await loadPlotly();
        setStatus('Loading Caldwell prime list…');
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error(`Failed to load ${DATA_URL}`);
        const data = (await res.json()) as PrimesPayload;

        if (data.count !== 100000 || data.primes.length !== 100000 || data.gaps.length !== 100000) {
          throw new Error('Expected 100,000 primes and gaps');
        }
        if (data.first !== 2 || data.last !== 1299709 || data.primes[0] !== 2 || data.primes[data.primes.length - 1] !== 1299709) {
          throw new Error('Prime range mismatch — expected first 2, last 1,299,709');
        }

        if (cancelled || !plotRef.current) return;

        dataRef.current = data;
        indicesRef.current = data.primes.map((_, i) => i + 1);
        const maxGap = Math.max(...data.gaps);
        setMeta(
          `${data.count.toLocaleString()} primes · first ${data.first} · last ${data.last.toLocaleString()} · max gap ${maxGap} · source: PrimePages`,
        );
        setStatus('');
        plotRef.current.innerHTML = '';
        await Plotly.newPlot(plotRef.current, [buildTrace(data, 'gap')], layout(), config);
        if (!cancelled) setReady(true);
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          setError(message);
          setStatus('');
        }
      }
    }

    void boot();
    return () => {
      cancelled = true;
      if (plotRef.current && window.Plotly) {
        try {
          window.Plotly.purge(plotRef.current);
        } catch {
          /* ignore */
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- boot once on mount
  }, [buildTrace, layout]);

  useEffect(() => {
    const payload = dataRef.current;
    const el = plotRef.current;
    if (!ready || !payload || !el || !window.Plotly) return;
    void window.Plotly.react(el, [buildTrace(payload, mode)], layout(), config);
  }, [mode, ready, buildTrace, layout]);

  const resetZoom = () => {
    if (!plotRef.current || !window.Plotly) return;
    void window.Plotly.relayout(plotRef.current, {
      'xaxis.autorange': true,
      'yaxis.autorange': true,
    });
  };

  return (
    <div className="prime-gaps-shell">
      <div className="prime-gaps-toolbar">
        <button type="button" className="cta-button cta-button--secondary" onClick={resetZoom} disabled={!ready}>
          Reset zoom
        </button>
        <button
          type="button"
          className={mode === 'gap' ? 'cta-button' : 'cta-button cta-button--secondary'}
          onClick={() => setMode('gap')}
          disabled={!ready}
        >
          Color by gap size
        </button>
        <button
          type="button"
          className={mode === 'twin' ? 'cta-button' : 'cta-button cta-button--secondary'}
          onClick={() => setMode('twin')}
          disabled={!ready}
        >
          Highlight twin primes (gap = 2)
        </button>
        {meta ? <p className="prime-gaps-meta">{meta}</p> : null}
      </div>

      {error ? (
        <div className="prime-gaps-status" role="alert">
          Could not load the graph: {error}
        </div>
      ) : null}
      {status ? (
        <div className="prime-gaps-status" role="status">
          {status}
        </div>
      ) : null}

      <div ref={plotRef} className="prime-gaps-plot" aria-label="Prime gap scatter plot" />

      <p className="prime-gaps-hint">
        Scroll to zoom, drag to pan. Hover a point for index, prime, and gap. Double-click the plot (or Reset zoom) for
        the full view.
      </p>
    </div>
  );
}
