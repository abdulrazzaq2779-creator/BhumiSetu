# BhumiRisk -- AI-Powered Predictive Analytics for Land Acquisition Delay Detection

------------------------------------------------------------------------

## 1. What BhumiRisk Is

BhumiRisk is an **AI/ML-based decision support platform** that predicts,
well in advance, which land acquisition projects --- and specifically
which *parcels within a project* --- are at risk of delay, and why, so
that administrators can intervene before a stall becomes a multi-year
holdup.

It does not replace the acquisition process; it sits **on top of**
existing systems (Bhu Bharati, registration databases, court/legal case
systems, GIS survey data) as an intelligence layer that continuously
scores risk, explains the drivers, and routes alerts to the right
stakeholder.

This directly answers the problem statement's core ask: *"an intelligent
mechanism capable of identifying projects that are likely to experience
delays before they occur."*

**The key design choice that differentiates BhumiRisk from a standard
risk-scoring tool:** most delay-detection approaches would score risk at
the *project* level only (e.g., "NIMZ Zaheerabad: High Risk"). BhumiRisk
scores risk at the *parcel/survey-number* level and rolls those scores
up to the project. This matters because Telangana's own cases show
project-level scoring alone can miss the real risk --- Musi Riverfront's
court-stopped dispossession involved just 9.08 acres in Gandipet out of
a 3,279-acre project, but that single parcel-level dispute halted work
across the much larger project. A project-level score would have shown
Musi as "mostly on track" right up until that dispute surfaced. A
parcel-level score would have flagged Gandipet specifically, months
earlier.

------------------------------------------------------------------------

## 2. How It Maps to the Problem Statement's Expected Solution

  -----------------------------------------------------------------------
  Expected Solution Requirement       BhumiRisk Component
  ----------------------------------- -----------------------------------
  AI/ML-based predictive models for   **Delay Prediction Engine**
  forecasting delays                  (classification + survival analysis
                                      models, Section 4)

  Automated identification of         **Risk Scoring Service** --- every
  high-delay-probability projects     project and parcel re-scored on
                                      each data refresh

  Project-wise risk scoring &         **High / Medium / Low risk
  prioritization                      classification**, ranked project
                                      *and* parcel queue for
                                      administrators

  Identification of key delay drivers **Explainable AI (SHAP) layer** ---
                                      per-project and per-parcel driver
                                      breakdown

  Explainable AI for transparency     SHAP-based feature attribution
                                      shown directly in the dashboard,
                                      not a black-box score

  Interactive dashboards (delay       **BhumiRisk Dashboard** (Apache
  probability, risk category, trends, Superset / Power BI)
  comparatives)                       

  GIS-enabled visualization of        **Risk heat map** (GeoServer +
  high-risk projects                  OpenLayers/Leaflet on PostGIS),
                                      drillable from project down to
                                      parcel

  Automated alerts & notifications    **Alert Engine** (SMS/email/push
                                      via configurable thresholds)

  Predictive recommendations for      **Recommendation Module** --- maps
  corrective action                   top delay drivers to standard
                                      mitigation playbooks

  Continuous model learning           **Feedback + retraining pipeline**
                                      --- model updates as new project
                                      data arrives

  APIs for integration with existing  **RESTful/GraphQL API layer** for
  systems                             Bhu Bharati, registration, court
                                      systems, GIS

  Secure role-based access & audit    **RBAC + audit logging** for Land
  trails                              Requiring Bodies, District Admin,
                                      State/Central users
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 3. System Architecture

``` text
┌──────────────────────────────────────────────────────────────────────────────┐
│ DATA SOURCES                                                                 │
│                                                                              │
│ Bhu Bharati (land records)  │ Registration & Mutation DB                    │
│ Legal case records (courts/tribunals)  │ GIS survey data                    │
│ Compensation & disbursement records  │ Notifications/approvals              │
│ Rehabilitation & resettlement (R&R) progress reports                         │
└───────────────────────────────────────────────┬──────────────────────────────┘
                                                │
                                                ▼
┌───────────────────────────────────────────────┐
│ Data Ingestion Layer                         │
│ (batch + real-time APIs)                     │
└───────────────────────────────────────────────┘
                                                │
                                                ▼
┌───────────────────────────────────────────────┐
│ Feature Engineering                           │
│ → per-parcel + per-project risk features     │
│ (see Section 5)                               │
└───────────────────────────────────────────────┘
                                                │
                                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ Predictive Modelling Layer                                                   │
│                                                                              │
│ • Delay classification (H/M/L risk)                                         │
│   at parcel level, rolled up to project                                     │
│ • Time-to-possession regression                                              │
│ • Stage-wise delay probability                                               │
└──────────────────────────────────────────────────────────────────────────────┘
                                                │
                                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ Explainability Layer (SHAP/LIME)                                             │
│ → top contributing factors per parcel/project                                │
└──────────────────────────────────────────────────────────────────────────────┘
                                                │
                                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ Dashboard & GIS │ Alert Engine                                               │
│ (Superset/Power BI, │ (SMS/Email/Push,                                       │
│ GeoServer/OpenLayers) │ threshold-based)                                     │
└──────────────────────────────────────────────────────────────────────────────┘
                                                │
                                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ Feedback Loop → Retraining Pipeline                                          │
│ (new outcomes improve model over time)                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Architecture flow:** Data Sources → Data Ingestion → Feature
Engineering → Predictive Modelling → Explainability → Dashboard/GIS &
Alerts → Feedback/Retraining.

## 4. Predictive Modelling Approach

BhumiRisk uses three complementary model types rather than a single
score, because "delay" is not one event --- it can happen at different
stages, at different granularities (parcel vs. project), and for
different durations:

  -----------------------------------------------------------------------
  Model                   Purpose                 Technique
  ----------------------- ----------------------- -----------------------
  **Stage-wise delay      Predicts probability of Gradient-boosted trees
  classifier**            delay at each           (XGBoost/LightGBM) ---
                          acquisition stage       handles mixed tabular
                          (notification → survey  data well, strong
                          → compensation →        baseline for this data
                          possession → R&R),      type
                          computed at the parcel  
                          level and aggregated to 
                          project level           

  **Risk categorization   Buckets each parcel and Same classifier,
  model**                 each project into High  calibrated probability
                          / Medium / Low risk for thresholds
                          prioritization          

  **Time-to-possession    Estimates expected      Survival analysis (Cox
  model**                 delay duration (in      proportional hazards)
                          months) per parcel      --- appropriate since
                                                  possession is a "time
                                                  until event" problem
                                                  with many still-pending
                                                  (censored) cases
  -----------------------------------------------------------------------

**Why parcel-level, not just project-level:** a project like Musi
Riverfront can be 95%+ complete by area and still be fully blocked by a
handful of disputed parcels. Scoring only at the project level averages
this risk away. Scoring at the parcel level and surfacing the
*highest-risk parcels within an otherwise low-risk project* is what lets
an administrator act on the actual bottleneck rather than a diluted
average.

**Explainability:** Every prediction is paired with a SHAP value
breakdown showing, e.g., *"Survey No. 142, Gandipet is High Risk
primarily due to: active litigation (1 stay order), compensation gap
(35% below market), and R&R site not yet finalized."* This satisfies the
requirement for transparent, actionable predictions --- not just a
number.

**Continuous learning:** As projects reach new milestones (compensation
paid, possession taken, dispute resolved), outcomes feed back into the
training set on a scheduled retraining cycle, so accuracy improves as
more Telangana (and eventually national) project data accumulates.

------------------------------------------------------------------------

## 5. Data Sources & Feature Engineering

Directly built from the problem statement's data source list, grounded
in real Telangana project variables, and structured so every feature can
be computed at either parcel or project level:

  -----------------------------------------------------------------------
  Data Source                         Example Features Extracted
  ----------------------------------- -----------------------------------
  **Land acquisition records / Bhu    Land area, project type, number of
  Bharati**                           survey numbers, ownership mismatch
                                      count (per survey number)

  **Compensation data**               Offer-to-market-rate ratio,
                                      disbursement delay (days),
                                      assigned-vs-private compensation
                                      gap

  **Legal case records**              Active litigation count, stay-order
                                      flag, historical case resolution
                                      time --- trackable per parcel where
                                      disputes are parcel-specific

  **GIS data**                        Land-use type, forest/wetland
                                      overlap, terrain/accessibility
                                      factors

  **Notifications & approvals**       Time elapsed since notification,
                                      number of pending approvals,
                                      agencies involved

  **Rehabilitation & resettlement     R&R completion %, number of
  data**                              displaced families, resettlement
                                      site readiness

  **Historical performance**          Past delay record of the
                                      implementing agency/district,
                                      project-type base delay rate

  **Stakeholder responsiveness**      Average response time of revenue
                                      officers/agencies to queries or
                                      objections
  -----------------------------------------------------------------------

### Backtesting on real cases

Telangana's ongoing projects double as validation data: - **NIMZ
Zaheerabad** --- a \~87% compensation gap (₹7 lakh offered vs. ₹50
lakh--1 crore expected) combined with rising objection filings in
Yelgoi/Bardipur is exactly the feature combination the model should
learn to flag as High Risk *before* acquisition visibly paused. - **Musi
Riverfront (Gandipet)** --- this is the clearest test of the
parcel-level design: the project as a whole would score as manageable
risk, but the Gandipet survey numbers specifically --- active
litigation, incomplete R&R planning --- should be flagged High Risk in
isolation. A model that only scores at the project level would fail this
backtest; a parcel-level model should catch it. - **Regional Ring Road**
--- only 60% acquired against a hard project timeline is a case where
stage-wise delay probability (at "possession" stage) should have been
flagged months earlier based on approval hand-off lag across districts.

------------------------------------------------------------------------

## 6. Dashboard & GIS Visualization

Built on the suggested technology stack:

-   **Database:** PostgreSQL with PostGIS (spatial queries on survey
    numbers, district boundaries)
-   **GIS layer:** GeoServer + OpenLayers/Leaflet --- renders a **risk
    heat map** where districts/projects are color-coded
    (red/amber/green) by predicted delay probability, drillable down to
    individual parcels within a project
-   **Visualization:** Apache Superset / Power BI for delay-probability
    trends, district-wise and state-wise comparatives, timeline
    analysis, and performance indicators
-   **Views for different stakeholders:**
    -   **Policymakers/Central Ministries:** state-wide heat map,
        comparative analytics across states/districts
    -   **District Administration:** ranked list of high-risk projects
        in their jurisdiction, with the ability to drill into the
        specific high-risk parcels driving each project's score
    -   **Project Implementing Agencies:** stage-wise delay probability
        for their specific projects, with recommended actions

------------------------------------------------------------------------

## 7. Alerts & Decision Support

-   **Automated alerts** (SMS Gateway/Email APIs/Push) fire when a
    project or an individual parcel crosses a risk threshold, or when a
    specific driver (e.g., litigation count) spikes.
-   **Recommendation module** maps the top SHAP-identified drivers to a
    standard playbook, e.g.:
    -   High compensation gap → recommend market-rate
        reassessment/review
    -   Rising objection rate → recommend early mediation intervention
    -   Approval hand-off lag → flag specific department for escalation
    -   R&R backlog → recommend acceleration of resettlement site
        readiness

This turns the score into an **action**, not just a warning.

------------------------------------------------------------------------

## 8. Integration, Security & Scalability

-   **APIs:** RESTful/GraphQL endpoints for integration with Bhu
    Bharati, registration systems, court/tribunal case management, and
    other state/central land management systems.
-   **Cloud infrastructure:** NIC Cloud (MeghRaj) for government
    deployments, with AWS/Azure Government Cloud as alternatives.
-   **Access control:** Role-based access (Land Requiring Bodies,
    Acquiring Authorities, District Admin, State/Central users, Policy
    Makers) with full audit trails for accountability.
-   **Scalability:** Designed to onboard project data
    district-by-district, state-by-state, with the same model
    architecture extensible nationwide across States and Union
    Territories.

------------------------------------------------------------------------

## 9. Implementation Roadmap

### Phase 1 (Months 1--4): Data Foundation

-   Integrate Bhu Bharati, registration, mutation, and legal case data
    for a pilot set of Telangana projects (NIMZ Zaheerabad, one RRR
    stretch, Musi Riverfront).
-   **Address data fragmentation up front, not as an afterthought:**
    these sources currently live in separate departmental systems with
    no shared parcel-level identifier. Phase 1 includes a
    manual/semi-automated reconciliation step for the pilot set ---
    matching survey numbers across Revenue, registration, and court
    records by hand where automated linkage fails --- so the pilot
    starts on a clean, unified dataset rather than assuming integration
    is a simple API call. This reconciliation step is also where older,
    non-digitized ownership records for the pilot parcels get digitized.
-   Build the feature engineering pipeline and baseline risk classifier
    on this reconciled pilot dataset.

### Phase 2 (Months 5--8): Model Development & Backtesting

-   Train stage-wise delay classifier and time-to-possession survival
    model, at both parcel and project level.
-   Backtest against historical Telangana outcomes (Section 5) to
    validate that the model would have flagged known delays ---
    including parcel-specific ones like Gandipet --- early.
-   Build SHAP-based explainability layer.

### Phase 3 (Months 9--12): Dashboard & Alerts Pilot

-   Deploy GIS-enabled dashboard and heat map for pilot districts, with
    parcel-level drill-down.
-   Launch automated alerts and recommendation engine.
-   Onboard District Administration users for live monitoring.

### Phase 4 (Months 13--18): Scale-Up & Continuous Learning

-   Expand to additional Telangana projects (irrigation, airports,
    radial roads), prioritizing districts where records are already
    digitized, and extending the Phase 1 reconciliation approach to new
    districts as they come online.
-   Activate feedback-driven retraining pipeline.
-   Open APIs for integration with State and Central systems ahead of
    nationwide rollout.

------------------------------------------------------------------------

## 10. Expected Outcomes

  -----------------------------------------------------------------------
  Metric                  Baseline (Current)      Target After BhumiRisk
                                                  (hypothesis to validate
                                                  in Phase 2 backtesting)
  ----------------------- ----------------------- -----------------------
  **Lead time before      0 (detected only after  6--12 months early
  delay becomes visible** it occurs)              warning

  **Prediction accuracy   No system exists        **Target** 80%+
  (high-risk                                      precision on backtested
  classification)**                               cases --- to be
                                                  validated during Phase
                                                  2, not a pre-measured
                                                  result

  **Administrator         Reactive (post-delay)   Proactive (pre-delay,
  response time to                                threshold-triggered)
  emerging risk**                                 

  **Projects with         0%                      100% of monitored
  documented risk driver                          projects
  visibility**                                    

  **Resource allocation   Ad hoc,                 Prioritized by
  efficiency**            complaint-driven        data-driven risk
                                                  ranking, down to the
                                                  specific high-risk
                                                  parcel
  -----------------------------------------------------------------------

*Note: the 80%+ precision figure is a design target based on the
strength of the feature set (Section 5), not a measured outcome --- this
project has no historical backtested results yet. Phase 2 of the roadmap
exists specifically to validate or revise this target against real
Telangana data before any pilot deployment.*

------------------------------------------------------------------------

## 11. What Makes This Creative and Buildable

-   **Parcel-level risk scoring, not just project-level** --- the core
    differentiator. Telangana's own cases (Musi Riverfront/Gandipet)
    show that project-level averages can hide the exact parcel causing a
    stall; scoring at the parcel level and rolling up to project level
    is what makes the system's output *actionable* rather than a diluted
    summary.
-   **Grounded in real, verifiable Telangana data** (NIMZ, RRR, Musi,
    irrigation projects) rather than a generic hypothetical model ---
    every feature and threshold is traceable to an actual documented
    case.
-   **Explainability-first design**: the system never outputs a bare
    number; every risk score comes with its drivers and a recommended
    action, satisfying the transparency requirement explicitly called
    out in the problem statement.
-   **Reuses existing government data infrastructure** (Bhu Bharati,
    registration systems, GIS survey data) rather than requiring new
    data collection from scratch, with an explicit reconciliation step
    in Phase 1 to handle the fact that this data isn't yet unified ---
    reducing implementation risk by being honest about where the real
    work is.
-   **Modular and incrementally deployable**: starts with a risk
    classifier and dashboard for a handful of pilot projects, then
    scales feature-by-feature (survival model, GIS heat maps, alerts,
    retraining pipeline) toward full statewide and eventually national
    deployment, matching the scalability requirement in the problem
    statement.

------------------------------------------------------------------------

*BhumiRisk: Turning land acquisition monitoring from reactive reporting
into predictive, explainable, action-ready governance --- down to the
parcel that's actually causing the delay.*
