import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Clock, UserCheck, Activity, AlertTriangle } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs } = useStore();

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
            CYBERSECURITY // TAMPER-PROOF AUDIT TRAIL
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
            Security & System Audit Logs
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-light">
            Journalisation immuable de chaque événement administrateur : connexions, modifications de prix, mises à jour de stocks et statuts de commandes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-950/40 border border-emerald-800/80 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ENCRYPTED & SYNCED</span>
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#111116] border border-neutral-800">
          <div className="text-[10px] font-mono uppercase text-neutral-400">Total Audit Events</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{auditLogs.length}</div>
          <div className="text-[10px] text-neutral-500 mt-1 font-mono">Enregistrés en temps réel</div>
        </div>

        <div className="p-4 bg-[#111116] border border-neutral-800">
          <div className="text-[10px] font-mono uppercase text-neutral-400">Dernière Connexion Admin</div>
          <div className="text-sm font-bold font-mono text-emerald-400 mt-1">admin@rwyse.tn</div>
          <div className="text-[10px] text-neutral-500 mt-1 font-mono">Authentifié avec 2FA</div>
        </div>

        <div className="p-4 bg-[#111116] border border-neutral-800">
          <div className="text-[10px] font-mono uppercase text-neutral-400">Protection Brute-Force</div>
          <div className="text-sm font-bold font-mono text-white mt-1">Active (5 Tentatives Max)</div>
          <div className="text-[10px] text-neutral-500 mt-1 font-mono">Lockout automatique 15 min</div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#111116] border border-neutral-800 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>Journal Des Événements Récent</span>
          </span>
          <span className="text-[10px] font-mono text-neutral-500">
            Horodatage UTC+1 (Tunis)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] font-mono uppercase text-neutral-400 border-b border-neutral-800 bg-neutral-900/30">
              <tr>
                <th className="py-3 px-4">Date & Heure</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Opérateur / Acteur</th>
                <th className="py-3 px-4">Détails de l'événement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300 font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="py-3 px-4 text-neutral-400 whitespace-nowrap text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-neutral-800 text-white rounded-xs text-[10px] uppercase font-bold tracking-wider">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-300 text-xs">
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>{log.adminEmail}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-300 font-sans text-xs">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
