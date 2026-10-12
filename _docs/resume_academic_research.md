# JUSTIN CLARKE
Dubai, UAE • justinsavioclarke@outlook.com • linkedin.com/in/justinsavioclarke • [justinclarke.github.io](https://justinclarke.github.io)

**Research Engineer & Educator:** Specializes in Machine Learning, AI Reliability, and Data Systems. Combines rigorous empirical research (AI evaluation, causal econometrics) with extensive experience tutoring university students and industry professionals.

**EDUCATION:** **M.Sc. Computer Science** — Queen Mary University of London • **B.Tech. CS & Engineering** — GITAM

---

### **TEACHING & MENTORSHIP**

#### **Computer Science & AI Tutor / Mentor** *(Independent — 2023 – Present)*
* **Individual & Professional Tutoring:** Instructed university students and working professionals (including engineers and data analysts at **American Express, Deloitte, and Cognizant**) in Python, SQL, Machine Learning, and Data Engineering.
* **Curriculum & Lab Design:** Designed hands-on learning modules, coding exercises, and real-world project workflows, translating complex AI and database concepts into accessible, structured lesson plans.
* **Research Mentorship:** Sourced and recruited a research intern for *DataScope*; scoped technical deliverables, guided schema-engine development, and provided continuous code review and feedback.

---

### **RESEARCH & TECHNICAL PROJECTS**

#### **DataScope: AI Reliability & Evaluation Research** *(May 2026 – Present)*
* **AI Context Degradation (Negative Result):** Measured LLM accuracy across 408 controlled tests, discovering answer correctness drops from **71.6% to 56.9%** when overloaded with raw data rows—proving that raw context degrades models already supplied with computed facts.
* **Testing AI System Assumptions:** Benchmarked core AI scaffolding against standardized fixtures, proving simplified bare schemas outperformed complex prompt templates (**15/24 vs 12/24** correctness) and identifying net-harmful prompt additions.
* **Verifiable AI Architecture:** Built a deterministic system where AI plans analytical queries but DuckDB executes them, enforcing a **100% citation validity gate** across 40 evaluation trials so models cannot invent numbers.
* **On-Device AI Benchmarking:** Benchmarked 5 small local AI models on WebGPU across 15 tasks; isolated critical failure modes where models generate clean code that returns incorrect numbers.

#### **Off The Pace: Econometric & Machine Learning Platform** *(Nov 2025 – Apr 2026)*
* **Driver vs. Car Skill Separation:** Formulated a two-way fixed-effects statistical model across **137,447 F1 laps** (7 seasons) to isolate driver skill from car advantage—solving motorsport's core non-random assignment confound.
* **Lap Performance Decomposition:** Decomposed lap variance into 7 physical factors (dirty air, fuel, tyres, weather) with an automated build gate enforcing lap-time reconstruction to within **0.0001s**.
* **Data Quality & Leakage Prevention:** Built an automated data-quality pipeline with an adversarial probe that caught and blocked temporal data leakage (**0.996 accuracy** vs 0.168 chance floor) before model training.
* **Predictive ML & Uncertainty Modeling:** Trained 5 XGBoost models for tyre degradation and stint life under time-series cross-validation, achieving **0.806 empirical coverage** with false-discovery rate control.

---

### **TECHNICAL & PEDAGOGICAL SKILLS**
* **Teaching & Mentorship:** Curriculum Design, Technical Mentorship, Lab Instruction, Student Assessment, Code Review, AI/Data Literacy.
* **Research & ML:** Machine Learning (XGBoost, scikit-learn), AI Evaluation (Evals, Grounding), Econometrics (Fixed Effects), Conformal Prediction, Python (`pandas`, `SciPy`, `Optuna`, `sqlglot`), SQL (DuckDB, PostgreSQL), TypeScript, Git Provenance.

---

<!-- ======================================================================= -->
<!-- ACADEMIC INTERVIEW & DEFENSE GUIDE (NON-PRINTED)                 -->
<!-- ======================================================================= -->

## **APPENDIX: TEACHING & RESEARCH DEFENSE GUIDE (NON-PRINTED)**

### **Key Defensible Findings & Teaching Context**
* **Professional Tutoring Claims:** Mentored learners and practicing professionals across Python, SQL, ML pipelines, and data modeling. Industry professionals tutored include staff at American Express, Deloitte, and Cognizant.
* **Grounding Monotone Degradation (71.6% → 56.9%):** `eval/claude/10-grounding-ladder/CHAT-RESULTS-gemini.json` (4 rungs × 102 calls).
* **Scaffolding Falsifications:** `eval/claude/16-light-model-sql-ceiling/` (Prompt 12/24 vs 15/24; Labels 9→12→15/21; Spec 0/8).
* **Two-Way HDFE Driver/Car Separation:** `off-the-pace/transform/` (PyFixest panel regression de-confounding 137,447 laps).
* **Adversarial Leakage Probe (0.996 vs 0.168):** `ml/artefacts/evaluation_metrics.json` (race_year recovery accuracy vs chance floor).
