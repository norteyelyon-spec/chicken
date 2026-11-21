import React from 'react';

export const Projectile3DSimLazy = React.lazy(() =>
  import('../ThreeLabSims').then((m) => ({ default: m.Projectile3DSim }))
);

export const Pendulum3DSimLazy = React.lazy(() =>
  import('../ThreeLabSims').then((m) => ({ default: m.Pendulum3DSim }))
);

export const OpticsBench3DSimLazy = React.lazy(() =>
  import('../ThreeLabSims').then((m) => ({ default: m.OpticsBench3DSim }))
);

export const Micrometer3DSimLazy = React.lazy(() =>
  import('../ThreeLabSims').then((m) => ({ default: m.Micrometer3DSim }))
);
