/**
 * WorkflowLayers the "one pipeline, five layers" showcase: a stack of cards that
 * auto-rotate (via CardSwap), each with a hover spotlight and an animated SVG.
 *
 * Fits in: the overview, as the marquee architecture explainer.
 * Note:    The five layers are data (`LAYERS`); CardSwap handles the 3D shuffle.
 *          Each card draws its own wireframe glyph chosen by `step` in
 *          LayerIllustration.
 *
 * For beginners ----------------------------------------------------------------
 * This uses Framer Motion, an animation library:
 *  - `useMotionValue` holds a number that can change every frame WITHOUT
 *    re-rendering the component (cheap for mouse tracking). `mouseX`/`mouseY`
 *    follow the cursor inside a card.
 *  - `useMotionTemplate` weaves those live values into a CSS string here a
 *    radial-gradient that becomes the spotlight glow under the pointer.
 *  - `variants` + `whileHover` describe two states (initial/hover); Motion
 *    animates the SVG strokes between them (`pathLength` 0→1 = "draw the line").
 * -----------------------------------------------------------------------------
 */
import { MouseEvent } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { CardSwap, Card } from '../../ui/CardSwap';

interface Layer {
  step: string;
  name: string;
  description: string;
  metric: string;
  metricLabel: string;
  glow: string;
  accentText: string;
  shadow: string;
  glyph: string;
}

const LAYERS: Layer[] = [
  {
    step: '01',
    name: 'Bronze Ingestion',
    description: 'Automated F1 telemetry pipelines emitting Hive-partitioned, append-only Parquet datasets.',
    metric: '168',
    metricLabel: 'Races ingested (2018–2024)',
    glow: 'from-f1-red/20',
    accentText: 'text-f1-red',
    shadow: 'hover:shadow-[0_0_40px_rgba(225,6,0,0.2)]',
    glyph: '◢'
  },
  {
    step: '02',
    name: 'Lakehouse Engine',
    description: 'Local DuckDB warehouse structuring raw data into a governed Medallion architecture.',
    metric: '46',
    metricLabel: 'Staging & mart models',
    glow: 'from-amber-500/20',
    accentText: 'text-amber-500',
    shadow: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]',
    glyph: '▤'
  },
  {
    step: '03',
    name: 'Physics Transform',
    description: 'dbt-core pipelines enforcing a seven-term additive invariant on every parsed lap.',
    metric: '339',
    metricLabel: 'CI-enforced test assertions',
    glow: 'from-emerald-500/20',
    accentText: 'text-emerald-500',
    shadow: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]',
    glyph: '∑'
  },
  {
    step: '04',
    name: 'ML & Inference',
    description: 'Five XGBoost models predicting tyre degradation and stint life, exported as ONNX graphs.',
    metric: '27',
    metricLabel: 'Leakage & parity tests',
    glow: 'from-sky-500/20',
    accentText: 'text-sky-500',
    shadow: 'hover:shadow-[0_0_40px_rgba(14,165,233,0.2)]',
    glyph: '◈'
  },
  {
    step: '05',
    name: 'Wasm Client App',
    description: 'React UI running sub-10ms analytics via DuckDB-Wasm against a Parquet CDN.',
    metric: 'Zero',
    metricLabel: 'Server compute cost',
    glow: 'from-violet-500/20',
    accentText: 'text-violet-500',
    shadow: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]',
    glyph: '◉'
  }
];

function LayerIllustration({ step, accentClass }: { step: string; accentClass: string }) {
  const drawVariant = {
    initial: { pathLength: 0, opacity: 0 },
    hover: { 
      pathLength: 1, 
      opacity: 1, 
      transition: { duration: 1.5, ease: "easeOut" as const } 
    }
  };

  const paths = (() => {
    switch (step) {
      case '01':
        return [
          "M 10 20 L 40 50 L 10 80",
          "M 40 50 L 90 50",
          "M 70 30 L 90 50 L 70 70"
        ];
      case '02':
        return [
          "M 50 15 L 85 30 L 50 45 L 15 30 Z",
          "M 50 40 L 85 55 L 50 70 L 15 55 Z",
          "M 50 65 L 85 80 L 50 95 L 15 80 Z",
          "M 15 30 L 15 80",
          "M 50 45 L 50 95",
          "M 85 30 L 85 80"
        ];
      case '03':
        return [
          "M 15 25 L 35 25 L 50 50",
          "M 15 75 L 35 75 L 50 50",
          "M 50 50 L 70 50",
          "M 70 50 L 85 35",
          "M 70 50 L 85 65",
          "M 50 25 L 50 75"
        ];
      case '04':
        return [
          "M 20 20 L 50 35", "M 20 50 L 50 35", "M 20 80 L 50 35",
          "M 20 20 L 50 65", "M 20 50 L 50 65", "M 20 80 L 50 65",
          "M 50 35 L 80 50", "M 50 65 L 80 50",
          "M 23 20 A 3 3 0 1 1 17 20 A 3 3 0 1 1 23 20",
          "M 23 50 A 3 3 0 1 1 17 50 A 3 3 0 1 1 23 50",
          "M 23 80 A 3 3 0 1 1 17 80 A 3 3 0 1 1 23 80",
          "M 53 35 A 3 3 0 1 1 47 35 A 3 3 0 1 1 53 35",
          "M 53 65 A 3 3 0 1 1 47 65 A 3 3 0 1 1 53 65",
          "M 83 50 A 3 3 0 1 1 77 50 A 3 3 0 1 1 83 50"
        ];
      case '05':
        return [
          "M 15 15 L 85 15 L 85 85 L 15 85 Z",
          "M 15 30 L 85 30",
          "M 35 30 L 35 85",
          "M 45 45 L 75 45 L 75 55 L 45 55 Z",
          "M 45 65 L 75 65 L 75 75 L 45 75 Z"
        ];
      default:
        return [];
    }
  })();

  return (
    <svg 
      className="absolute -right-6 -bottom-6 w-64 h-64 opacity-20 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {paths.map((d, i) => (
        <g key={i}>
          {/* Base dim wireframe */}
          <path d={d} className="stroke-white/20" strokeWidth={0.5} strokeLinecap="round" strokeLinejoin="round" />
          {/* Animated bright stroke */}
          <motion.path
            d={d}
            className={`stroke-current ${accentClass}`}
            strokeWidth={1.5}
            strokeLinecap="round" 
            strokeLinejoin="round"
            variants={drawVariant}
          />
        </g>
      ))}
    </svg>
  );
}

// LEARN: `{ layer, ...rest }` pulls out the `layer` prop and bundles everything
//    else into `rest`. CardSwap injects its own positioning props onto each child,
//    so we forward `{...rest}` to <Card> to pass those through untouched.
function LayerCard({ layer, ...rest }: { layer: Layer; [key: string]: any }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // LEARN: On every pointer move, convert the cursor's page coordinates into
  //    coordinates relative to this card's top-left, then store them in the motion
  //    values. The spotlight gradient above reads them to follow the cursor.
  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <Card
      {...rest}
      customClass={`group relative overflow-hidden flex flex-col justify-between p-7 cursor-pointer bg-deep border border-white/10 ${layer.shadow} transition-shadow duration-500 text-white shadow-xl`}
      onMouseMove={handleMouseMove}
    >
      {/* Interactive Spotlight Glow */}
      <motion.div
        className={`pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${layer.glow} via-transparent to-transparent z-0`}
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              var(--tw-gradient-stops)
            )
          `
        }}
      />
      
      {/* Existing static radial glow fallback */}
      <div className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] ${layer.glow} via-transparent to-transparent opacity-30 group-hover:opacity-0 transition-opacity duration-500 z-0`} />
      
      {/* Animated SVG Wireframe */}
      <motion.div initial="initial" whileHover="hover" className="absolute inset-0 z-0 pointer-events-none">
        <LayerIllustration step={layer.step} accentClass={layer.accentText} />
      </motion.div>

      {/* Header row */}
      <div className="relative z-10 flex items-start justify-between">
        <span className="font-jetbrains text-[11px] uppercase tracking-[0.3em] text-white/50">
          Layer
        </span>
        <span className={`font-jetbrains text-5xl font-bold leading-none -mt-1 -mr-1 opacity-80 ${layer.accentText}`}>
          {layer.step}
        </span>
      </div>

      {/* Footer block */}
      <div className="relative z-10 space-y-3.5">
        <h3 className="text-2xl md:text-[30px] font-bold tracking-tight leading-none text-white">
          {layer.name}
        </h3>
        <p className="text-[13px] font-medium text-white/60 max-w-[88%] leading-snug">
          {layer.description}
        </p>

        {/* Metric, divided off */}
        <div className="flex items-center justify-between pt-3.5 border-t border-white/10">
          <div className="flex items-baseline gap-2">
            <span className={`text-[28px] font-extrabold tracking-tight leading-none ${layer.accentText}`}>{layer.metric}</span>
            <span className="text-[10px] font-jetbrains uppercase tracking-wider text-white/40 max-w-[120px] leading-tight">
              {layer.metricLabel}
            </span>
          </div>
          {/* Click hint */}
          <span className="flex items-center gap-1.5 text-[10px] font-jetbrains uppercase tracking-wider opacity-0 group-hover:opacity-70 transition-opacity duration-300 text-white/50">
            Next Layer
            <span aria-hidden className="text-xs leading-none">➔</span>
          </span>
        </div>
      </div>
    </Card>
  );
}

const GRID_BG = "pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black_70%,transparent_100%)] opacity-40";

export function WorkflowLayers() {
  return (
    <div className="py-16 md:py-24 border-t border-white/5 relative bg-graphite-900 overflow-hidden">
      <div className={GRID_BG} />

      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 relative z-10">
        
        {/* Scroll-Driven Staggered Text Reveal */}
        <motion.div 
          className="w-full md:w-[28%] space-y-5 text-center md:text-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
        >
          <motion.span 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } } }}
            className="inline-block text-[11px] font-jetbrains uppercase tracking-[0.2em] text-f1-red/80"
          >
            How it works
          </motion.span>
          
          <motion.h2 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } } }}
            className="text-3xl md:text-4xl font-sans font-bold text-white tracking-tight leading-[1.1]"
          >
            One pipeline,<br />five layers.
          </motion.h2>
          
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } } }}
            className="text-sm md:text-base text-white/50 font-sans leading-relaxed max-w-sm mx-auto md:mx-0"
          >
            Raw telemetry becomes a named, physically-grounded answer. Each card is a stage in that journey.
          </motion.p>
        </motion.div>

        <div className="w-full md:w-[72%] flex justify-center items-center min-h-[420px] md:min-h-[560px] relative">
          <CardSwap
            width={460}
            height={340}
            cardDistance={64}
            verticalDistance={84}
            delay={4500}
            skewAmount={5}
          >
            {LAYERS.map((layer) => (
              <LayerCard key={layer.step} layer={layer} />
            ))}
          </CardSwap>
        </div>
      </div>
    </div>
  );
}
