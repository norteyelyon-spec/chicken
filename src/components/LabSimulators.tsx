import React, { Suspense } from 'react';
import type { SimulatorKind } from '../types';
import {
  Micrometer3DSimLazy,
  OpticsBench3DSimLazy,
  Pendulum3DSimLazy,
  Projectile3DSimLazy,
} from './labs/ThreeLabLazy';

const OhmsLawSimulator = React.lazy(() =>
  import('./labs/PhysicsElectricityWavesLabs').then((m) => ({ default: m.OhmsLawSimulator }))
);
const StandingWaveSimulator = React.lazy(() =>
  import('./labs/PhysicsElectricityWavesLabs').then((m) => ({ default: m.StandingWaveSimulator }))
);
const ElectrostaticsFieldSimulator = React.lazy(() =>
  import('./labs/PhysicsElectricityWavesLabs').then((m) => ({ default: m.ElectrostaticsFieldSimulator }))
);
const AcTransformerSimulator = React.lazy(() =>
  import('./labs/PhysicsElectricityWavesLabs').then((m) => ({ default: m.AcTransformerSimulator }))
);

const SimpleMachineSimulator = React.lazy(() =>
  import('./labs/PhysicsMechanicsThermalLabs').then((m) => ({ default: m.SimpleMachineSimulator }))
);
const KinematicsMotionSimulator = React.lazy(() =>
  import('./labs/PhysicsMechanicsThermalLabs').then((m) => ({ default: m.KinematicsMotionSimulator }))
);
const ThermalCalorimetrySimulator = React.lazy(() =>
  import('./labs/PhysicsMechanicsThermalLabs').then((m) => ({ default: m.ThermalCalorimetrySimulator }))
);

const GasLawsSimulator = React.lazy(() =>
  import('./labs/ChemistryReactionLabs').then((m) => ({ default: m.GasLawsSimulator }))
);
const TitrationSimulator = React.lazy(() =>
  import('./labs/ChemistryReactionLabs').then((m) => ({ default: m.TitrationSimulator }))
);

const ThomsonCRTSimulator = React.lazy(() =>
  import('./labs/ChemistryAtomicLabs').then((m) => ({ default: m.ThomsonCRTSimulator }))
);
const RutherfordScatteringSimulator = React.lazy(() =>
  import('./labs/ChemistryAtomicLabs').then((m) => ({ default: m.RutherfordScatteringSimulator }))
);
const RadioactiveDecaySimulator = React.lazy(() =>
  import('./labs/ChemistryAtomicLabs').then((m) => ({ default: m.RadioactiveDecaySimulator }))
);

const EnzymeRateSimulator = React.lazy(() =>
  import('./labs/BiologyLabs').then((m) => ({ default: m.EnzymeRateSimulator }))
);
const OsmosisCellSimulator = React.lazy(() =>
  import('./labs/BiologyLabs').then((m) => ({ default: m.OsmosisCellSimulator }))
);
const GeneticsPunnettSimulator = React.lazy(() =>
  import('./labs/BiologyLabs').then((m) => ({ default: m.GeneticsPunnettSimulator }))
);

const LogicGateSimulator = React.lazy(() =>
  import('./labs/MathIctLabs').then((m) => ({ default: m.LogicGateSimulator }))
);
const MathCalculusSimulator = React.lazy(() =>
  import('./labs/MathIctLabs').then((m) => ({ default: m.MathCalculusSimulator }))
);
const BearingsTrigSimulator = React.lazy(() =>
  import('./labs/MathIctLabs').then((m) => ({ default: m.BearingsTrigSimulator }))
);

const renderSimulator = (kind: SimulatorKind): React.ReactNode => {
  switch (kind) {
    case 'ohms-law':
      return <OhmsLawSimulator />;
    case 'projectile-3d':
      return <Projectile3DSimLazy />;
    case 'pendulum-3d':
      return <Pendulum3DSimLazy />;
    case 'optics-3d':
      return <OpticsBench3DSimLazy />;
    case 'micrometer-3d':
      return <Micrometer3DSimLazy />;
    case 'titration':
      return <TitrationSimulator />;
    case 'gas-laws':
      return <GasLawsSimulator />;
    case 'wave-standing':
      return <StandingWaveSimulator />;
    case 'enzyme-rate':
      return <EnzymeRateSimulator />;
    case 'logic-gate':
      return <LogicGateSimulator />;
    case 'thomson-crt':
      return <ThomsonCRTSimulator />;
    case 'rutherford-scattering':
      return <RutherfordScatteringSimulator />;
    case 'math-function-calc':
      return <MathCalculusSimulator />;
    case 'radioactive-decay':
      return <RadioactiveDecaySimulator />;
    case 'osmosis-cell':
      return <OsmosisCellSimulator />;
    case 'simple-machines':
      return <SimpleMachineSimulator />;
    case 'kinematics-motion':
      return <KinematicsMotionSimulator />;
    case 'thermal-calorimetry':
      return <ThermalCalorimetrySimulator />;
    case 'bearings-trig':
      return <BearingsTrigSimulator />;
    case 'electrostatics-field':
      return <ElectrostaticsFieldSimulator />;
    case 'ac-transformer-3d':
      return <AcTransformerSimulator />;
    case 'genetics-punnett':
      return <GeneticsPunnettSimulator />;
  }
};

export const LabSimulatorHost: React.FC<{ kind: SimulatorKind }> = ({ kind }) => {
  return (
    <Suspense
      fallback={
        <div className="min-h-[290px] rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center text-xs text-slate-400">
          Loading interactive WASSCE practical apparatus...
        </div>
      }
    >
      {renderSimulator(kind)}
    </Suspense>
  );
};
