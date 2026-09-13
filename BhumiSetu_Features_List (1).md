# BhumiSetu — Features to Build

A prioritized feature list for the hackathon build. Grouped by priority so you know what to build first if time runs short.

---

## Must-Have Features (Core Demo — build these first)

1. **Risk Scoring Engine**
   Takes plot-level data (compensation gap, ownership mismatch, litigation flag, approval delay, R&R status) and outputs a risk level: High / Medium / Low.

2. **Plot-Level Scoring (not just project-level)**
   Score individual land plots, not just whole projects. This is your core differentiator, one disputed plot can drag down an otherwise-fine project, so this needs to be visible in the demo.

3. **Explainability Output**
   For every risk score, show the top 2–3 reasons behind it in plain language (e.g., "High compensation gap, active court case"), not just a number.

4. **Backtest Proof**
   A working example showing the model would have flagged a real known delay (e.g., a Gandipet-style case) as high-risk before it became public. This is your strongest credibility feature, don't skip it.

5. **Map / Dashboard View**
   A visual view (map or list) showing all plots color-coded by risk: red / amber / green. Clicking a plot shows its score and explanation.

6. **Recommendation per Risk**
   A suggested next step tied to the top risk driver, e.g., compensation gap → "review compensation rate," litigation → "start early negotiation." Simple rule-based mapping is enough.

---

## Should-Have Features (adds depth if time allows)

7. **Pre-Award Screening View**
   A separate check: before a project is approved, show what percentage of its land is already high-risk. This directly supports your "creative timing" angle, catching bad land before it's committed to.

8. **Project-Level Rollup**
   Alongside plot-level scores, show an aggregated project-level risk view so both granular and high-level pictures are visible.

9. **Risk Trend Over Time (simulated)**
   Even a simple simulated timeline showing a plot's risk score rising over a few months adds a strong "early warning" visual.

10. **Comparison View Across Projects**
    A simple table ranking your 2–3 demo projects by overall risk, useful for showing how a district administrator would prioritize where to act first.

---

## Nice-to-Have Features (only if everything above is done early)

11. **Simple Alert Simulation**
    A mock notification showing what an alert would look like when a plot crosses the risk limit (doesn't need to actually send anything).

12. **"What-if" Slider**
    Let a user adjust one input (e.g., compensation gap %) and watch the risk score change live, good interactive demo moment for judges.

13. **Downloadable Report**
    A button to export a plot's risk summary as a simple PDF or text report, since your solution doc already promises "actionable output," not just a dashboard.

14. **Multi-State Framing Toggle**
    A cosmetic label/dropdown showing "Telangana" vs. a placeholder second state, just to visually reinforce that the system isn't state-specific, without needing real data for it.

---

## Explicitly Skip (not worth hackathon time)

- Real government API integrations (Bhu Bharati, court systems)
- User authentication / role-based access
- Automated real SMS/email alerts
- Continuous retraining pipeline
- Statewide or national data coverage

---

## Suggested Build Order

Must-Haves 1 → 6, in the order listed, since each one builds on the last (score → explain → prove it works → visualize → recommend). Only move to Should-Haves once all six Must-Haves work end-to-end. This keeps you demo-ready at every stage, even if you run out of time before reaching the Nice-to-Haves.
