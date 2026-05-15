# 02: Content & Keyword Strategy

## 🎯 Target Keywords
Focus on role-intent and portfolio-intent queries rather than generic educational terms.

| Tier | Cluster | Application |
| :--- | :--- | :--- |
| **Primary** | "analytics engineer portfolio", "data architect case studies" | Home Title, H1, OG Title |
| **Secondary** | "SQL portfolio project", "data engineering case study" | Archive Page, Project H1s |
| **Long-tail** | "M:N relationship SQL disaster relief", "employee archetype framework" | Project H2/H3 headings |

## 🏗 Semantic Hierarchy (Snippet Bait)
Google rewards question-shaped headings. Restructure project headers to target "Featured Snippets".

### Example: `SqlDisasterPage.tsx`
*   **H1 (SR-Only)**: `SQL Disaster Response System — Philippine Relief Logistics Database`
*   **Visual H1**: `DISASTER response.` (Aria-hidden)
*   **H2**: `How do you model multi-tier disaster relief operations in SQL?`
    *   *Follow with a 40-60 word high-density paragraph.*
*   **H2**: `What relational patterns handle M:N supply chain modeling?`
    *   *Follow with a bulleted list.*

## 👁 Visually-Styled vs. Semantically-Correct H1s
Use the `sr-only` pattern to keep the HUD design while giving Google the keywords it needs:

```tsx
<h1 className="sr-only">
  SQL Disaster Response System — Philippine Relief Logistics Database
</h1>
<div aria-hidden="true" className="...">
  {/* Your styled HUD text here */}
</div>
```
