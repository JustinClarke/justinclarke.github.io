import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/utils';
import { ScrollReveal, MagneticButton, BackToTerminal, SpotlightCard, Badge } from '@/ui';
import { TheCloser } from '@/components/layout';

const AUDIO_FEATURES = [
	{ label: 'Danceability', value: 0.82, color: '#1DB954' },
	{ label: 'Energy', value: 0.74, color: '#1DB954' },
	{ label: 'Valence', value: 0.91, color: '#1DB954' },
	{ label: 'Acousticness', value: 0.12, color: '#4fd1c5' },
	{ label: 'Instrumentalness', value: 0.05, color: '#4fd1c5' },
	{ label: 'Liveness', value: 0.18, color: '#4fd1c5' },
];

const MODELS = [
	{
		name: 'Model 1: Hierarchical',
		desc: 'The flagship model. Uses a stable sort across 3 similarity dimensions: Genre TF-IDF → Popularity (Artist/Track) → Acoustic DNA.',
		tag: 'Recommended',
		c: 'text-[#1DB954]'
	},
	{
		name: 'Model 2: Averaged Hybrid',
		desc: 'A linear combination of vector distances. Balances genre, popularity, and acoustic features into a single similarity score.',
		tag: 'Balanced',
		c: 'text-white/60'
	},
	{
		name: 'Spotify Baseline',
		desc: 'The control group. Utilizes the official Spotify API recommendations endpoint as a performance benchmark.',
		tag: 'Control',
		c: 'text-white/20'
	}
];

export const SpotifyEnginePage = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<div ref={containerRef} className="min-h-screen bg-[#020202] text-white font-sans selection:bg-[#1DB954]/30 overflow-x-hidden">

			<BackToTerminal />

			{/* ── CINEMATIC HUD STATUS ─────────────────────────────── */}
			<div className="fixed top-12 right-12 z-[100] hidden md:flex gap-8 items-center font-mono text-[10px] tracking-[0.3em] uppercase opacity-40">
				<span>Project ID: SP-442</span>
				<div className="w-px h-3 bg-white/20" />
				<span className="flex items-center gap-2">
					<div className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
					Status: Production Ready
				</span>
			</div>

			{/* ── HERO: THE NEURAL VOID ────────────────────────────────── */}
			<section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-20 md:pb-0 px-6 overflow-hidden">
				{/* Animated Waveform Background */}
				<div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1DB95415_0%,transparent_70%)]" />
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] rotate-12">
						<svg className="w-[400px] md:w-[800px] h-[400px] md:h-[800px] text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.508 17.308c-.216.354-.672.468-1.026.252-2.85-1.74-6.438-2.13-10.662-1.164-.402.096-.804-.156-.9-.558-.096-.402.156-.804.558-.9 4.626-1.056 8.586-.612 11.772 1.332.354.21.468.672.258 1.038zm1.47-3.258c-.276.444-.858.588-1.302.312-3.264-2.004-8.238-2.586-12.096-1.416-.504.156-1.038-.138-1.194-.642-.156-.504.138-1.038.642-1.194 4.416-1.338 9.9-0.678 13.638 1.626.45.27.594.852.312 1.314zm.126-3.414c-3.912-2.322-10.374-2.538-14.136-1.398-.6.186-1.236-.15-1.422-.75-.186-.6.15-1.236.75-1.422 4.308-1.308 11.454-1.05 16.002 1.65.54.318.72.1.4.636-.318.54-.99.72-1.596.402l.006.006z" />
						</svg>
					</div>
				</div>

				<div className="relative z-10 max-w-7xl w-full text-center">
					<ScrollReveal direction="up">
						<div className="inline-flex items-center gap-3 mb-8 md:mb-10 px-4 py-1.5 rounded-[4px] border border-white/10 bg-white/[0.03] backdrop-blur-md relative group overflow-hidden">
							<svg className="w-4 h-4 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.508 17.308c-.216.354-.672.468-1.026.252-2.85-1.74-6.438-2.13-10.662-1.164-.402.096-.804-.156-.9-.558-.096-.402.156-.804.558-.9 4.626-1.056 8.586-.612 11.772 1.332.354.21.468.672.258 1.038zm1.47-3.258c-.276.444-.858.588-1.302.312-3.264-2.004-8.238-2.586-12.096-1.416-.504.156-1.038-.138-1.194-.642-.156-.504.138-1.038.642-1.194 4.416-1.338 9.9-0.678 13.638 1.626.45.27.594.852.312 1.314zm.126-3.414c-3.912-2.322-10.374-2.538-14.136-1.398-.6.186-1.236-.15-1.422-.75-.186-.6.15-1.236.75-1.422 4.308-1.308 11.454-1.05 16.002 1.65.54.318.72.1.4.636-.318.54-.99.72-1.596.402l.006.006z" />
							</svg>
							<span className="font-mono text-[9px] tracking-[0.4em] md:tracking-[0.6em] uppercase font-bold text-white/40">
								MSc Research <span className="text-white/80">Spotify Project</span>
							</span>
						</div>

						<h1 className="font-noto text-[13vw] sm:text-7xl md:text-[9rem] font-black leading-[0.85] tracking-tighter mb-10 md:mb-12 uppercase break-words">
							Predictive<br />
							<span className="text-[#1DB954] italic font-playfair font-normal pr-4 lowercase">Music</span>
							Engine.
						</h1>

						<p className="font-mono text-base md:text-3xl text-white/50 max-w-4xl mx-auto leading-relaxed font-medium mb-16 md:mb-24 px-4 md:px-0">
							A <span className="text-white underline decoration-[#1DB954] underline-offset-[12px]">Terminal-First</span> research artifact solving the cold-start problem through 3-dimensional hierarchical similarity.
						</p>

						<div className="flex flex-wrap justify-center gap-6 px-4 md:px-0">
							<MagneticButton>
								<a href="/resources/MSc Project/MSc Project.pdf" target="_blank" className="px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-[#1DB954] text-black font-mono text-xs font-black tracking-widest uppercase shadow-2xl block w-full md:w-auto text-center">
									Read Project Report
								</a>
							</MagneticButton>
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* ── SECTION 01: THE 3-MODEL ARCHITECTURE ─────────────────── */}
			<section className="py-20 md:py-28 px-6 md:px-12 bg-[#050505] border-y border-white/5">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 mb-16 md:mb-32 items-end">
						<ScrollReveal direction="left">
							<div className="flex flex-col gap-8">
								<span className="font-mono text-[#1DB954] text-[11px] tracking-[0.6em] uppercase font-black">Methodological Discipline</span>
								<h2 className="font-noto text-4xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Three Model<br /><span className="text-white/20 italic">Benchmark.</span></h2>
							</div>
						</ScrollReveal>
						<ScrollReveal direction="right">
							<p className="font-mono text-lg md:text-xl text-white/40 leading-relaxed max-w-xl">
								We tested our engineered models against Spotify's internal baseline. By measuring precision across three distinct input modes—Playlist, Song, and Artist—we solved for variety and acoustic resonance.
							</p>
						</ScrollReveal>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{MODELS.map((model, i) => (
							<ScrollReveal key={model.name} delay={i * 0.1}>
								<div className="p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-white/5 bg-white/[0.02] flex flex-col gap-10 md:gap-12 h-full group hover:bg-white/[0.04] transition-all shadow-2xl">
									<div className="flex justify-between items-start">
										<span className="font-mono text-[9px] uppercase font-black text-white/20 tracking-widest">{model.tag}</span>
										<div className={cn("w-2 h-2 rounded-full bg-current", model.c)} />
									</div>
									<div className="flex flex-col gap-4">
										<h3 className="font-noto text-2xl md:text-3xl font-black uppercase leading-tight">{model.name}</h3>
										<p className="font-mono text-xs md:text-sm text-white/40 leading-relaxed">{model.desc}</p>
									</div>
								</div>
							</ScrollReveal>
						))}
					</div>
				</div>
			</section>

			{/* ── SECTION 02: DATA ENGINEERING LAB ──────────────────────── */}
			<section className="py-20 md:py-32 px-6 md:px-12 bg-[#020202] relative overflow-hidden">
				<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 items-center">
					<ScrollReveal direction="left">
						<div className="flex flex-col gap-10 md:gap-12">
							<div className="flex flex-col gap-6">
								<span className="font-mono text-[#1DB954] text-[11px] tracking-[0.6em] uppercase font-black">Memory-First Design</span>
								<h2 className="font-noto text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Data<br /><span className="text-white/40">Engineering.</span></h2>
							</div>
							<p className="font-mono text-lg md:text-xl text-white/40 leading-relaxed">
								Handling a 1M-row dataset on edge environments required strict memory engineering. We utilized <span className="text-white">float16/int8</span> downcasting and chunked CSV processing to maintain a sub-200MB runtime memory footprint.
							</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-10 md:pt-12 border-t border-white/5">
								{[
									{ l: 'Dataset Growth', v: 'Self-Growing' },
									{ l: 'Memory Opt', v: 'float16/int8' },
									{ l: 'Ingestion', v: 'Spotipy (Live)' },
									{ l: 'Dimensions', v: '20+ Features' },
								].map(stat => (
									<div key={stat.l} className="flex flex-col gap-1">
										<span className="font-mono text-[9px] uppercase tracking-widest text-white/20 font-black">{stat.l}</span>
										<span className="font-noto text-xl md:text-2xl font-bold">{stat.v}</span>
									</div>
								))}
							</div>
						</div>
					</ScrollReveal>

					<ScrollReveal direction="right">
						<div className="relative p-8 md:p-12 rounded-[32px] md:rounded-[40px] bg-[#0c0c0c] border border-white/10 overflow-hidden group shadow-2xl">
							<div className="absolute top-0 right-0 p-8 md:p-12 text-white/5">
								<svg className="w-32 md:w-48 h-32 md:h-48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
							</div>
							<div className="flex flex-col gap-8 relative z-10">
								<div className="flex gap-2">
									<div className="w-2 h-2 rounded-full bg-[#1DB954]" />
									<div className="w-2 h-2 rounded-full bg-white/10" />
									<div className="w-2 h-2 rounded-full bg-white/10" />
								</div>
								<div className="overflow-x-auto pb-4">
									<code className="font-mono text-[10px] md:text-xs text-white/40 leading-relaxed block whitespace-pre">
										<span className="text-white/20"># Hierarchical Stable Sort Logic</span>
										<br />df['sim'] = <span className="text-[#1DB954]">cosine_similarity</span>(audio_vecs, play_audio)
										<br />df['sim2'] = <span className="text-[#1DB954]">cosine_similarity</span>(pop_vecs, play_pop)
										<br />df['sim3'] = <span className="text-[#1DB954]">cosine_similarity</span>(genre_tfidf, play_genre)
										<br />
										<br /><span className="text-white/20"># Resolving Cold-Start through Hierarchical Prioritization</span>
										<br />result = df.<span className="text-[#1DB954]">sort_values</span>(
										<br />&nbsp;&nbsp;['sim3', 'sim2', 'sim'],
										<br />&nbsp;&nbsp;ascending=False,
										<br />&nbsp;&nbsp;kind='stable'
										<br />)
									</code>
								</div>
							</div>
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* ── SECTION 03: RESEARCH ARTIFACTS ────────────────────────── */}
			<section className="py-20 md:py-32 px-6 md:px-12 bg-white text-black relative overflow-hidden">
				<div className="max-w-7xl mx-auto flex flex-col gap-16 md:gap-24">
					<div className="flex flex-col gap-6 max-w-2xl">
						<span className="font-mono text-black/30 text-[11px] tracking-[0.5em] uppercase font-black">Notebook Repository</span>
						<h2 className="font-noto text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">Research Artifacts.</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[
							{ name: 'Preprocessing.ipynb', icon: '🧹', desc: 'Data cleaning, float16 downcasting, and CSV chunking logic.', link: '/resources/MSc Project/Preprocessing.ipynb' },
							{ name: 'Feature_Extraction.ipynb', icon: '🧪', desc: 'Spotipy API ingestion and 1M-row MSD feature engineering.', link: '/resources/MSc Project/Reading1M_feature_extraction.ipynb' },
							{ name: 'Modeling.ipynb', icon: '🧠', desc: 'Hierarchical sort validation and Model 1 vs. Spotify Control.', link: '/resources/MSc Project/Modeling.ipynb' },
						].map(nb => (
							<a key={nb.name} href={nb.link} target="_blank" className="p-8 md:p-12 rounded-[32px] md:rounded-[40px] border border-black/10 bg-black/[0.01] hover:bg-black/[0.03] transition-all flex flex-col gap-6 md:gap-8 group">
								<div className="text-3xl md:text-4xl">{nb.icon}</div>
								<div className="flex flex-col gap-2">
									<h4 className="font-noto text-lg md:text-xl font-black uppercase">{nb.name}</h4>
									<p className="font-mono text-xs text-black/40 leading-relaxed">{nb.desc}</p>
								</div>
								<div className="mt-auto flex items-center gap-2 font-mono text-[9px] uppercase font-black text-black/20 group-hover:text-black transition-colors">
									View Source <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
								</div>
							</a>
						))}
					</div>
				</div>
			</section>

			{/* ── FOOTER ──────────────────────────────────────────────── */}
			<footer className="w-full border-t border-white/5">
				<TheCloser />
			</footer>
		</div>
	);
};
