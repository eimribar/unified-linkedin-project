import React, { lazy, Suspense } from 'react';

// Lazy load the heavy Three.js component
const DotMatrixComponent = lazy(() => import('./DotMatrixComponent'));

export const DotMatrixLazy: React.FC<any> = (props) => {
  return (
    <Suspense fallback={
      <div className="h-full w-full bg-gradient-to-br from-gray-50 to-white" />
    }>
      <DotMatrixComponent {...props} />
    </Suspense>
  );
};