import React from 'react';
import { SectionHeader, LedgerRow } from '../ui';

// RPOC service target: Q4 2026. Pure client-side date math — no backend.
export const RPOC_TARGET = new Date('2026-10-01T00:00:00Z');
export const daysToRpoc = () =>
  Math.max(0, Math.ceil((RPOC_TARGET.getTime() - Date.now()) / 86400000));

const MissionsManifest = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-6">
      <SectionHeader
        index="005"
        label="MISSIONS MANIFEST"
        title="Dated, not vague."
        className="mb-10"
      />

      <div className="max-w-4xl">
        <LedgerRow
          id="SVC-RPOC"
          label="RPOC-AS-A-SERVICE"
          sublabel="Rendezvous, proximity operations, and capture — arm + ASTRA-P + NavIQ as a turnkey closed-loop system."
          to="/products/rpoc-service"
          trailing={
            <span className="type-mono-label text-ember border border-ember/40 bg-ember-subtle px-3 py-1.5">
              Q4 2026 — NOW BOOKING
            </span>
          }
        />
        <LedgerRow
          id="SVC-DEORB"
          label="DE-ORBIT-AS-A-SERVICE"
          sublabel="End-of-life disposal for satellites and debris, on the same capture stack."
          to="/products/de-orbit-service"
          trailing={
            <span className="type-mono-label text-text-muted border hairline px-3 py-1.5">
              2028 — PLANNED
            </span>
          }
        />
        <div className="pt-6">
          <span className="type-mono-label text-accent">
            T−{daysToRpoc()} DAYS TO RPOC SERVICE
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default MissionsManifest;
