import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import LoadingState from "./components/LoadingState";

const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Activities = lazy(() => import("./pages/Activities"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const Goals = lazy(() => import("./pages/Goals"));
const Reports = lazy(() => import("./pages/Reports"));

const App = () => (
  <ErrorBoundary>
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10"><LoadingState /></div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  </ErrorBoundary>
);

export default App;
