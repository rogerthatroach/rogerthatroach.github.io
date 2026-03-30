'use client';

import dynamic from 'next/dynamic';
import MathBlock from '@/components/blog/MathBlock';
import { tex } from '@/lib/katex';
import InlineEquation from '@/components/blog/InlineEquation';
import TheoremBlock from '@/components/blog/TheoremBlock';
import VisualizationContainer from '@/components/blog/VisualizationContainer';

const ClosedLoopCycle = dynamic(
  () => import('@/components/blog/diagrams/ClosedLoopCycle'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading closed-loop diagram&hellip;
      </div>
    ),
  }
);

const ModelSelectionScatter = dynamic(
  () => import('@/components/blog/diagrams/ModelSelectionScatter'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading model selection scatter&hellip;
      </div>
    ),
  }
);

const PSOSwarm = dynamic(
  () => import('@/components/blog/diagrams/PSOSwarm'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading PSO simulation&hellip;
      </div>
    ),
  }
);

const AbstractionLadder = dynamic(
  () => import('@/components/blog/diagrams/AbstractionLadder'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading abstraction ladder&hellip;
      </div>
    ),
  }
);

export default function ClosedLoopPost() {
  return (
    <>
      {/* ── Abstract ── */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">Abstract</h2>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        This paper examines a structural pattern &mdash; <strong>closed-loop optimization</strong>{' '}
        (sense &rarr; model &rarr; optimize &rarr; act) &mdash; as it manifests across four distinct
        application domains at ascending levels of abstraction: industrial emissions control via
        Particle Swarm Optimization at a 900MW coal power plant, cloud-based document processing
        pipelines, financial process automation, and enterprise agentic AI platforms. We present the
        formal PSO framework as applied to multi-output combustion tuning (84 simultaneous regression
        models across 90+ sensor inputs), derive the multi-objective optimization formulation for
        pollutant minimization under operational constraints, and demonstrate that the same four-phase
        architectural pattern recurs in each subsequent system despite fundamentally different
        technologies, domains, and abstraction levels. The paper argues that recognizing this
        structural isomorphism is itself a design methodology &mdash; one that accelerates
        architecture decisions in novel domains by drawing on proven patterns from prior ones.
      </p>

      {/* ── 1. Introduction ── */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">1. Introduction</h2>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Applied AI practitioners often describe their careers as a sequence of projects, each with
        its own technologies, clients, and challenges. This framing obscures a deeper structural
        truth: the most impactful AI systems share common architectural patterns regardless of
        domain. Recognizing these patterns is not merely an academic exercise &mdash; it is a
        practical design methodology that reduces architecture risk in novel applications.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        This paper traces one such pattern &mdash; <strong>closed-loop optimization</strong> &mdash;
        through four instantiations spanning a decade of applied work:
      </p>

      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-left text-text-tertiary">
              <th className="pb-2 pr-4 font-medium">Level</th>
              <th className="pb-2 pr-4 font-medium">Domain</th>
              <th className="pb-2 pr-4 font-medium">System</th>
              <th className="pb-2 font-medium">Years</th>
            </tr>
          </thead>
          <tbody className="text-text-secondary">
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">Physical</td>
              <td className="py-2 pr-4">Industrial power generation</td>
              <td className="py-2 pr-4">Combustion tuning via PSO</td>
              <td className="py-2 font-mono">2016&ndash;2019</td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">Cloud</td>
              <td className="py-2 pr-4">Document processing</td>
              <td className="py-2 pr-4">ML verification pipeline</td>
              <td className="py-2 font-mono">2021&ndash;2022</td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">Financial</td>
              <td className="py-2 pr-4">Enterprise finance</td>
              <td className="py-2 pr-4">Tax automation &amp; benchmarking</td>
              <td className="py-2 font-mono">2022&ndash;2024</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Intelligent</td>
              <td className="py-2 pr-4">Agentic AI</td>
              <td className="py-2 pr-4">LLM-powered decision platforms</td>
              <td className="py-2 font-mono">2024&ndash;present</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The formal treatment focuses on Level 1 (PSO for combustion tuning), where the mathematics
        is most explicit, and then demonstrates how the structural pattern abstracts to each
        subsequent level.
      </p>

      {/* ── 2. The Closed-Loop Optimization Pattern ── */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">
        2. The Closed-Loop Optimization Pattern
      </h2>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">2.1 Formal Definition</h3>

      <TheoremBlock variant="definition" number={1} title="Closed-Loop Optimization System">
        <p className="mb-2">
          A closed-loop optimization system <InlineEquation html={tex("\\mathcal{S}")} /> is a 4-tuple:
        </p>
        <MathBlock html={tex("\\mathcal{S} = (\\mathcal{Z},\\; \\mathcal{M},\\; \\mathcal{O},\\; \\mathcal{A})", true)} />
        <p className="mb-2">where:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <InlineEquation html={tex("\\mathcal{Z}: \\text{Environment} \\rightarrow \\mathcal{X}")} /> is
            the <strong>sensing function</strong>, mapping environmental state to an observation
            space <InlineEquation html={tex("\\mathcal{X} \\subseteq \\mathbb{R}^n")} />
          </li>
          <li>
            <InlineEquation html={tex("\\mathcal{M}: \\mathcal{X} \\rightarrow \\hat{\\mathcal{Y}}")} /> is
            the <strong>modeling function</strong>, mapping observations to predicted outputs{' '}
            <InlineEquation html={tex("\\hat{\\mathcal{Y}} \\subseteq \\mathbb{R}^m")} />
          </li>
          <li>
            <InlineEquation html={tex("\\mathcal{O}: \\hat{\\mathcal{Y}} \\times \\mathcal{C} \\rightarrow \\mathcal{X}^*")} />{' '}
            is the <strong>optimization function</strong>, finding optimal inputs{' '}
            <InlineEquation html={tex("\\mathcal{X}^* \\subseteq \\mathcal{X}")} /> subject to constraints{' '}
            <InlineEquation html={tex("\\mathcal{C}")} />
          </li>
          <li>
            <InlineEquation html={tex("\\mathcal{A}: \\mathcal{X}^* \\rightarrow \\text{Environment}")} />{' '}
            is the <strong>actuation function</strong>, applying optimized inputs to the environment
          </li>
        </ul>
      </TheoremBlock>

      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The system forms a closed loop because actuation modifies the environment, which is then
        re-sensed:
      </p>

      <MathBlock
        html={tex("\\text{Environment} \\xrightarrow{\\mathcal{Z}} \\mathcal{X} \\xrightarrow{\\mathcal{M}} \\hat{\\mathcal{Y}} \\xrightarrow{\\mathcal{O}} \\mathcal{X}^* \\xrightarrow{\\mathcal{A}} \\text{Environment} \\xrightarrow{\\mathcal{Z}} \\cdots", true)}
      />

      <VisualizationContainer
        minHeight={420}
        caption="Figure 1: The closed-loop optimization cycle — select a tab to see domain-specific instantiations"
      >
        {() => <ClosedLoopCycle />}
      </VisualizationContainer>

      {/* ── 2.2 Properties ── */}
      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">2.2 Properties</h3>

      <TheoremBlock variant="proposition" number={1} title="Feedback">
        <p>
          The system improves over time because actuation changes the environment, producing new
          observations that update the model:
        </p>
        <MathBlock html={tex("\\mathcal{M}_{t+1} = \\text{update}(\\mathcal{M}_t,\\; \\mathcal{Z}(\\text{Environment}_{t+1}))", true)} />
      </TheoremBlock>

      <TheoremBlock variant="proposition" number={2} title="Constraint Satisfaction">
        <p>
          The optimization function operates within a feasible set defined by operational,
          regulatory, or safety constraints:
        </p>
        <MathBlock html={tex("\\mathcal{X}^* = \\underset{x \\in \\mathcal{F}}{\\text{argmin}}\\; J(x) \\quad \\text{where} \\quad \\mathcal{F} = \\{x \\in \\mathcal{X} \\mid c_j(x) \\leq 0,\\; j = 1, \\ldots, p\\}", true)} />
      </TheoremBlock>

      <TheoremBlock variant="proposition" number={3} title="Human-in-the-Loop">
        <p>
          In high-stakes domains,{' '}
          <InlineEquation html={tex("\\mathcal{A}")} /> includes a human judgment gate:
        </p>
        <MathBlock html={tex("\\mathcal{A}(x^*) = \\begin{cases} \\text{apply}(x^*) & \\text{if human approves} \\\\ \\text{hold}(x^*) & \\text{otherwise} \\end{cases}", true)} />
      </TheoremBlock>

      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        This is not a limitation but a design feature. The system recommends; the human validates
        against context the model doesn&apos;t capture.
      </p>

      {/* ── 3. Level 1: PSO for Combustion Tuning ── */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">
        3. Level 1: Particle Swarm Optimization for Combustion Tuning
      </h2>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">3.1 Physical System</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The Maizuru 900MW coal-fired power plant (operated by Mitsubishi Hitachi Power Systems)
        combusts pulverized coal in a boiler to generate steam. The combustion process produces
        three primary pollutants &mdash; nitrogen oxides (NOx), sulfur oxides (SOx), and carbon
        monoxide (CO) &mdash; whose concentrations depend on boiler input settings: fuel mix ratios,
        air flow rates, damper positions, and secondary air distributions.
      </p>

      {/* ── 3.2 Sensing ── */}
      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">
        3.2 Sensing: The Input Space
      </h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The plant instruments 90+ sensors measuring:
      </p>
      <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-text-secondary">
        <li>
          Temperature at multiple boiler zones (
          <InlineEquation html={tex("T_1, T_2, \\ldots, T_k")} />)
        </li>
        <li>
          Pressure readings (<InlineEquation html={tex("P_1, P_2, \\ldots")} />)
        </li>
        <li>Flow rates (fuel, air, steam)</li>
        <li>Emissions concentrations at stack outlets</li>
        <li>Operational parameters (load, efficiency)</li>
      </ul>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        After feature engineering (domain-specific transformations, temporal aggregations,
        interaction terms developed in consultation with a mechanical engineer on the team), the
        input space is:
      </p>
      <MathBlock html={tex("\\mathbf{x} \\in \\mathbb{R}^n, \\quad n \\approx 90+", true)} />

      {/* ── 3.3 Modeling ── */}
      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">
        3.3 Modeling: 84 Simultaneous Regression Models
      </h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Each output variable of interest (emissions at different measurement points, temperature
        readings, efficiency indicators) receives its own regression model. Let{' '}
        <InlineEquation html={tex("y_i")} /> denote the <InlineEquation html={tex("i")} />-th output variable:
      </p>
      <MathBlock html={tex("\\hat{y}_i = f_i(\\mathbf{x};\\; \\boldsymbol{\\beta}_i), \\quad i = 1, 2, \\ldots, 84", true)} />
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The modeling task is to learn 84 parameter vectors{' '}
        <InlineEquation html={tex("\\{\\boldsymbol{\\beta}_1, \\boldsymbol{\\beta}_2, \\ldots, \\boldsymbol{\\beta}_{84}\\}")} />{' '}
        from historical sensor data.
      </p>

      {/* ── 3.3.1 Feature Selection ── */}
      <h4 className="mb-2 mt-6 text-lg font-medium text-text-primary">
        3.3.1 Feature Selection
      </h4>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        With <InlineEquation html={tex("n \\approx 90+")} /> candidate features and potential interaction
        terms, dimensionality reduction is necessary. We used correlation-based feature selection:
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Step 1: Feature-target correlation.</strong> For each model{' '}
        <InlineEquation html={tex("i")} />, compute Pearson correlation between each feature{' '}
        <InlineEquation html={tex("x_j")} /> and target <InlineEquation html={tex("y_i")} />:
      </p>
      <MathBlock
        html={tex("r_{j,i} = \\frac{\\sum_{t=1}^{T}(x_j^{(t)} - \\bar{x}_j)(y_i^{(t)} - \\bar{y}_i)}{\\sqrt{\\sum_{t=1}^{T}(x_j^{(t)} - \\bar{x}_j)^2 \\cdot \\sum_{t=1}^{T}(y_i^{(t)} - \\bar{y}_i)^2}}", true)}
        label="(1)"
      />
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Retain features where <InlineEquation html={tex("|r_{j,i}| > r_{\\min}")} /> for a configurable
        threshold <InlineEquation html={tex("r_{\\min}")} />.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Step 2: Feature-feature correlation.</strong> Among retained features, identify pairs
        with <InlineEquation html={tex("|r_{j,k}| > r_{\\text{collinear}}")} />. For collinear pairs,
        retain the feature with higher target correlation.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        This yields a model-specific feature set{' '}
        <InlineEquation html={tex("\\mathbf{x}_i \\subseteq \\mathbf{x}")} /> for each of the 84 models
        &mdash; not all models use the same features.
      </p>

      {/* ── 3.3.2 Model Selection ── */}
      <h4 className="mb-2 mt-6 text-lg font-medium text-text-primary">
        3.3.2 Model Selection: Multi-Indicator Evaluation
      </h4>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        For each model <InlineEquation html={tex("f_i")} />, we evaluated multiple candidate algorithms
        (linear regression, polynomial regression, ridge, lasso, random forest, gradient boosting,
        SVR) using k-fold cross-validation with <InlineEquation html={tex("K = 5")} /> folds. The
        selection criteria were:
      </p>

      <p className="mb-2 text-sm font-medium text-text-primary">
        Coefficient of Determination (<InlineEquation html={tex("R^2")} />):
      </p>
      <MathBlock
        html={tex("R^2_i = 1 - \\frac{\\sum_{t=1}^{T}(y_i^{(t)} - \\hat{y}_i^{(t)})^2}{\\sum_{t=1}^{T}(y_i^{(t)} - \\bar{y}_i)^2}", true)}
        label="(2)"
      />

      <p className="mb-2 text-sm font-medium text-text-primary">
        Root Mean Squared Error (RMSE):
      </p>
      <MathBlock
        html={tex("\\text{RMSE}_i = \\sqrt{\\frac{1}{T}\\sum_{t=1}^{T}(y_i^{(t)} - \\hat{y}_i^{(t)})^2}", true)}
        label="(3)"
      />

      <p className="mb-2 text-sm font-medium text-text-primary">
        Mean Absolute Percentage Error (MAPE):
      </p>
      <MathBlock
        html={tex("\\text{MAPE}_i = \\frac{100}{T}\\sum_{t=1}^{T}\\left|\\frac{y_i^{(t)} - \\hat{y}_i^{(t)}}{y_i^{(t)}}\\right|", true)}
        label="(4)"
      />

      <p className="mb-2 text-sm font-medium text-text-primary">Mean Absolute Error (MAE):</p>
      <MathBlock
        html={tex("\\text{MAE}_i = \\frac{1}{T}\\sum_{t=1}^{T}|y_i^{(t)} - \\hat{y}_i^{(t)}|", true)}
        label="(5)"
      />

      <p className="mb-2 text-sm font-medium text-text-primary">
        Inter-Fold Variance (<InlineEquation html={tex("\\sigma^2_{\\text{fold}}")} />):
      </p>
      <MathBlock
        html={tex("\\sigma^2_{\\text{fold},i} = \\text{Var}(\\{R^2_{i,1},\\; R^2_{i,2},\\; \\ldots,\\; R^2_{i,K}\\})", true)}
        label="(6)"
      />
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        where <InlineEquation html={tex("R^2_{i,k}")} /> is the <InlineEquation html={tex("R^2")} /> score of
        model <InlineEquation html={tex("i")} /> on fold <InlineEquation html={tex("k")} />.
      </p>

      <TheoremBlock variant="definition" number={2} title="Model Selection Criterion">
        <p>
          The selected model for output <InlineEquation html={tex("i")} /> is:
        </p>
        <MathBlock html={tex("f_i^* = \\underset{f \\in \\mathcal{F}}{\\text{argmax}}\\; R^2_i(f) \\quad \\text{subject to} \\quad \\sigma^2_{\\text{fold},i}(f) < \\sigma_{\\max}", true)} />
      </TheoremBlock>

      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The stability constraint (<InlineEquation html={tex("\\sigma^2_{\\text{fold}} < \\sigma_{\\max}")} />)
        is critical and frequently omitted in practice. A model with high{' '}
        <InlineEquation html={tex("R^2")} /> but high inter-fold variance has memorized training-set
        patterns rather than learning generalizable relationships. For a system where model
        predictions directly drive physical control recommendations, a stable model with slightly
        lower accuracy is preferable to an unstable model with higher peak accuracy.
      </p>

      <VisualizationContainer
        minHeight={420}
        caption="Figure 2: Model selection dashboard — R² vs. inter-fold variance with adjustable stability threshold"
      >
        {() => <ModelSelectionScatter />}
      </VisualizationContainer>

      {/* ── 3.4 Optimization: PSO ── */}
      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">
        3.4 Optimization: Particle Swarm Optimization
      </h3>

      <h4 className="mb-2 mt-6 text-lg font-medium text-text-primary">3.4.1 PSO Fundamentals</h4>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Particle Swarm Optimization (PSO), introduced by Kennedy and Eberhart [1], is a
        population-based metaheuristic inspired by collective behavior in biological swarms. A
        population of <InlineEquation html={tex("N")} /> particles navigates an{' '}
        <InlineEquation html={tex("n")} />-dimensional search space, each evaluating a candidate solution
        at its position.
      </p>

      <TheoremBlock variant="definition" number={3} title="Particle State">
        <p className="mb-2">
          Each particle <InlineEquation html={tex("i")} /> at iteration <InlineEquation html={tex("t")} /> has:
        </p>
        <ul className="list-inside list-disc space-y-1">
          <li>
            Position: <InlineEquation html={tex("\\mathbf{x}_i^{(t)} \\in \\mathbb{R}^n")} /> (a candidate
            set of boiler input settings)
          </li>
          <li>
            Velocity: <InlineEquation html={tex("\\mathbf{v}_i^{(t)} \\in \\mathbb{R}^n")} /> (the
            direction and magnitude of movement)
          </li>
          <li>
            Personal best:{' '}
            <InlineEquation html={tex("\\mathbf{p}_i^{(t)} = \\underset{s \\leq t}{\\text{argmin}}\\; J(\\mathbf{x}_i^{(s)})")} />
          </li>
          <li>
            Global best:{' '}
            <InlineEquation html={tex("\\mathbf{g}^{(t)} = \\underset{i,\\, s \\leq t}{\\text{argmin}}\\; J(\\mathbf{x}_i^{(s)})")} />
          </li>
        </ul>
      </TheoremBlock>

      {/* ── 3.4.2 Update Equations ── */}
      <h4 className="mb-2 mt-6 text-lg font-medium text-text-primary">3.4.2 Update Equations</h4>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The velocity and position update rules are:
      </p>
      <MathBlock
        html={tex("\\mathbf{v}_i^{(t+1)} = w \\cdot \\mathbf{v}_i^{(t)} + c_1 r_1 \\cdot (\\mathbf{p}_i^{(t)} - \\mathbf{x}_i^{(t)}) + c_2 r_2 \\cdot (\\mathbf{g}^{(t)} - \\mathbf{x}_i^{(t)})", true)}
        label="(7)"
      />
      <MathBlock
        html={tex("\\mathbf{x}_i^{(t+1)} = \\mathbf{x}_i^{(t)} + \\mathbf{v}_i^{(t+1)}", true)}
        label="(8)"
      />
      <p className="mb-4 text-base leading-relaxed text-text-secondary">where:</p>
      <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-text-secondary">
        <li>
          <InlineEquation html={tex("w")} /> is the <strong>inertia weight</strong> (controls exploration
          vs. exploitation)
        </li>
        <li>
          <InlineEquation html={tex("c_1")} /> is the <strong>cognitive coefficient</strong> (attraction to
          personal best)
        </li>
        <li>
          <InlineEquation html={tex("c_2")} /> is the <strong>social coefficient</strong> (attraction to
          global best)
        </li>
        <li>
          <InlineEquation html={tex("r_1, r_2 \\sim \\text{Uniform}(0, 1)")} /> are stochastic scaling
          factors
        </li>
      </ul>

      <TheoremBlock variant="proposition" number={5} title="Convergence Behavior">
        <p>
          Under the condition <InlineEquation html={tex("w < 1")} /> and{' '}
          <InlineEquation html={tex("c_1 + c_2 > 0")} />, the swarm contracts toward a region containing{' '}
          <InlineEquation html={tex("\\mathbf{g}^{(t)}")} /> [2]. With linearly decreasing inertia weight{' '}
          <InlineEquation html={tex("w(t) = w_{\\max} - (w_{\\max} - w_{\\min}) \\cdot t/t_{\\max}")} />,
          the swarm transitions from exploration (high <InlineEquation html={tex("w")} />, broad search)
          to exploitation (low <InlineEquation html={tex("w")} />, local refinement).
        </p>
      </TheoremBlock>

      <VisualizationContainer
        minHeight={500}
        caption="Figure 3: Interactive PSO swarm — adjust inertia, cognitive/social coefficients, and swarm size to observe convergence behavior"
      >
        {(isVisible) => <PSOSwarm isVisible={isVisible} />}
      </VisualizationContainer>

      {/* ── 3.4.3 Multi-Objective Formulation ── */}
      <h4 className="mb-2 mt-6 text-lg font-medium text-text-primary">
        3.4.3 Multi-Objective Formulation
      </h4>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The combustion tuning objective is to minimize pollutant emissions simultaneously:
      </p>
      <MathBlock
        html={tex("\\text{minimize} \\quad J(\\mathbf{x}) = \\alpha_1 \\cdot \\hat{y}_{\\text{NOx}}(\\mathbf{x}) + \\alpha_2 \\cdot \\hat{y}_{\\text{SOx}}(\\mathbf{x}) + \\alpha_3 \\cdot \\hat{y}_{\\text{CO}}(\\mathbf{x})", true)}
        label="(9)"
      />
      <p className="mb-4 text-base leading-relaxed text-text-secondary">subject to:</p>
      <MathBlock
        html={tex("\\begin{aligned} x_j^{\\min} &\\leq x_j \\leq x_j^{\\max} & \\forall j &= 1, \\ldots, n & &\\text{(operational bounds)} \\\\ y_{\\text{load}}(\\mathbf{x}) &\\geq y_{\\text{load}}^{\\min} & & & &\\text{(minimum load constraint)} \\\\ T_{\\text{boiler}}(\\mathbf{x}) &\\leq T_{\\max} & & & &\\text{(safety constraint)} \\end{aligned}", true)}
        label="(10)"
      />
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        where <InlineEquation html={tex("\\alpha_1, \\alpha_2, \\alpha_3")} /> are weighting coefficients
        reflecting the relative importance of each pollutant (configurable based on regulatory
        priorities), and{' '}
        <InlineEquation html={tex("\\hat{y}_{\\text{NOx}}, \\hat{y}_{\\text{SOx}}, \\hat{y}_{\\text{CO}}")} />{' '}
        are the trained regression models for each pollutant.
      </p>

      <p className="mb-2 text-sm font-medium text-text-primary">
        Why PSO over gradient-based methods?
      </p>

      <TheoremBlock variant="theorem" number={5} title="Non-Convexity Robustness">
        <p>
          For a non-convex objective <InlineEquation html={tex("J")} /> with multiple local minima,
          gradient-based methods converge to the nearest local minimum from initialization. PSO, as
          a population-based stochastic optimizer, samples from multiple basins of attraction
          simultaneously, providing probabilistic guarantees of finding the global minimum that
          gradient methods cannot [3].
        </p>
      </TheoremBlock>

      <TheoremBlock variant="proof">
        <p className="mb-2">
          <em>Sketch of argument.</em> Consider a landscape with <InlineEquation html={tex("B")} /> basins
          of attraction. A single gradient descent trajectory explores exactly one basin. A PSO
          swarm of <InlineEquation html={tex("N")} /> particles, initialized uniformly, places approximately{' '}
          <InlineEquation html={tex("N/B")} /> particles in each basin (for large{' '}
          <InlineEquation html={tex("N")} />). The global best{' '}
          <InlineEquation html={tex("\\mathbf{g}^{(t)}")} /> tracks the best solution across all basins.
          As long as at least one particle initializes in the basin containing the global minimum,
          the swarm will eventually converge there (under appropriate{' '}
          <InlineEquation html={tex("w, c_1, c_2")} /> settings). The probability of at least one particle
          initializing in the global basin approaches 1 as <InlineEquation html={tex("N")} /> grows:
        </p>
        <MathBlock html={tex("P(\\text{global basin covered}) = 1 - \\left(1 - \\frac{V_{\\text{global}}}{V_{\\text{total}}}\\right)^N", true)} />
        <p>
          where <InlineEquation html={tex("V_{\\text{global}}")} /> is the volume of the global basin
          relative to the total search space <InlineEquation html={tex("V_{\\text{total}}")} />.
        </p>
      </TheoremBlock>

      {/* ── 3.5 Actuation ── */}
      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">
        3.5 Actuation: Human-in-the-Loop
      </h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The PSO output is a set of optimal boiler input settings: specific fuel ratios, air flow
        rates, and damper positions. These recommendations were delivered to plant operators who
        made the physical adjustments.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The human-in-the-loop design was deliberate. In a 900MW power plant, automated control
        changes carry catastrophic risk &mdash; incorrect settings could damage equipment worth
        hundreds of millions of dollars or cause safety incidents. The operators provided a
        validation layer the model could not: awareness of transient plant states, equipment wear,
        and operational context not captured in sensor data.
      </p>

      {/* ── 3.6 Results ── */}
      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">3.6 Results</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The system achieved:
      </p>
      <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-text-secondary">
        <li>
          <strong>$3M annual cost savings</strong> through optimized fuel consumption and reduced
          emissions penalties
        </li>
        <li>
          <strong>Measurable reduction in NOx, SOx, and CO concentrations</strong> at stack outlets
        </li>
        <li>
          <strong>R&amp;D positioning</strong> &mdash; Digital Twin / combustion tuning was nascent
          technology in 2017&ndash;2018; this work positioned the consultancy as an innovator in
          industrial AI
        </li>
      </ul>

      {/* ── 4. The Pattern at Higher Abstraction Levels ── */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">
        4. The Pattern at Higher Abstraction Levels
      </h2>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">
        4.1 Structural Isomorphism
      </h3>

      <TheoremBlock variant="definition" number={4} title="Structural Isomorphism">
        <p className="mb-2">
          Two closed-loop optimization systems{' '}
          <InlineEquation html={tex("\\mathcal{S}_1 = (\\mathcal{Z}_1, \\mathcal{M}_1, \\mathcal{O}_1, \\mathcal{A}_1)")} />{' '}
          and{' '}
          <InlineEquation html={tex("\\mathcal{S}_2 = (\\mathcal{Z}_2, \\mathcal{M}_2, \\mathcal{O}_2, \\mathcal{A}_2)")} />{' '}
          are structurally isomorphic if there exist bijective mappings{' '}
          <InlineEquation html={tex("\\phi_Z, \\phi_M, \\phi_O, \\phi_A")} /> such that the compositional
          structure is preserved:
        </p>
        <MathBlock html={tex("\\phi_A \\circ \\phi_O \\circ \\phi_M \\circ \\phi_Z(\\mathcal{S}_1) \\cong \\mathcal{S}_2", true)} />
        <p>
          That is, the four-phase flow (sense &rarr; model &rarr; optimize &rarr; act) is the same
          in both systems, even if the concrete implementations differ entirely.
        </p>
      </TheoremBlock>

      {/* ── 4.2 Level 2 ── */}
      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">
        4.2 Level 2: Cloud Document Processing (2021&ndash;2022)
      </h3>
      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-left text-text-tertiary">
              <th className="pb-2 pr-4 font-medium">Phase</th>
              <th className="pb-2 font-medium">Instantiation</th>
            </tr>
          </thead>
          <tbody className="text-text-secondary">
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">
                <InlineEquation html={tex("\\mathcal{Z}")} /> (Sense)
              </td>
              <td className="py-2">
                Document ingestion &mdash; structured and unstructured files from
                insurance/financial clients
              </td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">
                <InlineEquation html={tex("\\mathcal{M}")} /> (Model)
              </td>
              <td className="py-2">
                Entity extraction models (Vertex AI, AutoML) &mdash; mapping document content to
                structured fields
              </td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">
                <InlineEquation html={tex("\\mathcal{O}")} /> (Optimize)
              </td>
              <td className="py-2">
                Reduce manual review cycles &mdash; maximize extraction accuracy to minimize human
                intervention
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4">
                <InlineEquation html={tex("\\mathcal{A}")} /> (Act)
              </td>
              <td className="py-2">
                Verified, structured outputs delivered to downstream systems
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── 4.3 Level 3 ── */}
      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">
        4.3 Level 3: Financial Process Automation (2022&ndash;2024)
      </h3>
      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-left text-text-tertiary">
              <th className="pb-2 pr-4 font-medium">Phase</th>
              <th className="pb-2 font-medium">Instantiation</th>
            </tr>
          </thead>
          <tbody className="text-text-secondary">
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">
                <InlineEquation html={tex("\\mathcal{Z}")} /> (Sense)
              </td>
              <td className="py-2">
                General Ledger data extraction via PySpark across enterprise financial systems
              </td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">
                <InlineEquation html={tex("\\mathcal{M}")} /> (Model)
              </td>
              <td className="py-2">
                PySpark transformation pipelines &mdash; mapping raw GL data to tax-ready formats
              </td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">
                <InlineEquation html={tex("\\mathcal{O}")} /> (Optimize)
              </td>
              <td className="py-2">
                Process time reduction: months &rarr; 90 minutes
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4">
                <InlineEquation html={tex("\\mathcal{A}")} /> (Act)
              </td>
              <td className="py-2">
                Automated tax returns + Tableau dashboards for CFO Group decision-making
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── 4.4 Level 4 ── */}
      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">
        4.4 Level 4: Agentic AI Platforms (2024&ndash;present)
      </h3>
      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-left text-text-tertiary">
              <th className="pb-2 pr-4 font-medium">Phase</th>
              <th className="pb-2 font-medium">Instantiation</th>
            </tr>
          </thead>
          <tbody className="text-text-secondary">
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">
                <InlineEquation html={tex("\\mathcal{Z}")} /> (Sense)
              </td>
              <td className="py-2">
                Policy documents, historical data, user queries &mdash; ingested via chunking +
                embedding pipelines
              </td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">
                <InlineEquation html={tex("\\mathcal{M}")} /> (Model)
              </td>
              <td className="py-2">
                LangGraph agentic orchestration &mdash; intent detection, sub-agent routing, RAG
                retrieval
              </td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">
                <InlineEquation html={tex("\\mathcal{O}")} /> (Optimize)
              </td>
              <td className="py-2">
                RAG relevance optimization, MCP tool selection, disambiguation &mdash; maximizing
                response accuracy under entitlement constraints
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4">
                <InlineEquation html={tex("\\mathcal{A}")} /> (Act)
              </td>
              <td className="py-2">
                Guided enterprise decisions &mdash; structured drafts, financial insights,
                benchmarking comparisons
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── 4.5 The Abstraction Gradient ── */}
      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">
        4.5 The Abstraction Gradient
      </h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Observation.</strong> As the abstraction level increases:
      </p>
      <ol className="mb-4 list-inside list-decimal space-y-3 text-sm text-text-secondary">
        <li>
          <strong>The sensing function becomes more semantic.</strong> Physical sensors (
          <InlineEquation html={tex("\\mathbb{R}^n")} />) &rarr; document parsers &rarr; data pipelines
          &rarr; embedding models (<InlineEquation html={tex("\\mathbb{R}^d")} />). The inputs evolve from
          physical measurements to semantic representations.
        </li>
        <li>
          <strong>The modeling function becomes more compositional.</strong> Single regression
          models &rarr; extraction pipelines &rarr; transformation chains &rarr; multi-agent
          orchestration. Each level composes more sub-models.
        </li>
        <li>
          <strong>The optimization function becomes more constrained.</strong> Operational bounds
          &rarr; accuracy thresholds &rarr; process SLAs &rarr; entitlement rules + regulatory
          compliance + data confidentiality. The constraint space grows richer.
        </li>
        <li>
          <strong>The actuation function becomes more autonomous.</strong> Human-operated controls
          &rarr; semi-automated pipelines &rarr; automated reports &rarr; AI-guided decisions with
          human oversight. But full autonomy is never the goal &mdash; human judgment remains in
          the loop.
        </li>
      </ol>

      <VisualizationContainer
        minHeight={480}
        caption="Figure 4: The Abstraction Ladder — four levels of the closed-loop pattern, from physical sensors to agentic AI"
      >
        {() => <AbstractionLadder />}
      </VisualizationContainer>

      {/* ── 5. Pattern Recognition as Design Methodology ── */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">
        5. Pattern Recognition as Design Methodology
      </h2>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">5.1 Practical Benefits</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Recognizing the closed-loop pattern in a new domain provides immediate architectural
        scaffolding:
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Accelerated design.</strong> When approaching a new enterprise AI problem, asking
        &ldquo;What is the sensing function? What is the model? What is the optimization objective?
        What is the actuation mechanism?&rdquo; immediately structures the solution space and
        reveals design choices.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Risk reduction.</strong> Patterns that have been validated at one level of
        abstraction carry structural guarantees to the next. The insight that &ldquo;human-in-the-loop
        improves system trust&rdquo; transfers from physical plant operators to enterprise knowledge
        workers.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Communication.</strong> Explaining a complex agentic AI system as &ldquo;the same
        closed-loop architecture as industrial optimization, but operating on policies instead of
        sensors&rdquo; makes the design accessible to non-technical stakeholders.
      </p>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">5.2 Limitations</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The pattern is structural, not implementational. Knowing that an agentic AI platform follows
        sense &rarr; model &rarr; optimize &rarr; act does not tell you which embedding model to
        use, how to design the agent orchestration, or how to enforce entitlements. The pattern
        provides the skeleton; domain expertise provides the flesh.
      </p>

      {/* ── 6. Related Work ── */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">6. Related Work</h2>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Particle Swarm Optimization.</strong> Kennedy and Eberhart [1] introduced PSO; Shi
        and Eberhart [2] added inertia weight for improved convergence. Clerc and Kennedy [4]
        provided convergence analysis. PSO remains widely used in engineering optimization due to
        its simplicity and effectiveness on non-convex landscapes.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Digital Twins.</strong> Grieves [5] introduced the Digital Twin concept; Tao et al.
        [6] formalized it for manufacturing. Our combustion tuning system predates the widespread
        adoption of the term but implements the core idea: a data-driven model of a physical system
        used for optimization and control.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Multi-Objective Optimization.</strong> Coello Coello et al. [7] survey evolutionary
        approaches to multi-objective optimization, including Pareto-based methods. Our weighted-sum
        approach is a simplification; Pareto-optimal methods (NSGA-II [8]) would allow exploring the
        full tradeoff frontier between pollutant types.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Agentic AI Architectures.</strong> LangGraph [9], AutoGen [10], and CrewAI provide
        orchestration frameworks. Our contribution is the recognition that these systems implement
        the same closed-loop pattern as classical control systems, which provides formal grounding
        for architectural decisions.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Architectural Patterns in Software.</strong> Gamma et al. [11] established design
        patterns as a communication and design tool. We extend this idea to AI system architecture,
        arguing that cross-domain structural patterns (like closed-loop optimization) serve the same
        function at the system level that GoF patterns serve at the code level.
      </p>

      {/* ── 7. Conclusion ── */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">7. Conclusion</h2>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The closed-loop optimization pattern &mdash; sense, model, optimize, act &mdash; is not
        merely a useful abstraction. It is a structural invariant that appears in systems as
        different as industrial combustion control and enterprise agentic AI. Recognizing this
        invariant provides a design methodology: decompose the new system into its four phases,
        identify what each phase looks like in the new domain, and apply the structural lessons
        learned from prior instantiations.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The most important structural lesson is this:{' '}
        <strong>the &ldquo;act&rdquo; step defines the system&apos;s value.</strong> A model that
        predicts emissions without recommending settings is a dashboard. A system that recommends
        optimal settings is a decision engine. An agentic platform that ingests policies without
        guiding decisions is a search tool. A platform that guides structured enterprise decisions
        is a transformation engine. The leap from descriptive to prescriptive &mdash; from informing
        to acting &mdash; is where the impact lives at every abstraction level.
      </p>

      {/* References and Further Reading rendered by PostLayout from data/posts/index.ts */}
    </>
  );
}
