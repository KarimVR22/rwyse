import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import {
  Search,
  Eye,
  X,
  Phone,
  Mail,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  AlertCircle,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    deleteOrder,
    refreshOrdersFromCloud,
    clearAllDemoOrders,
    isCloudSynced,
    isRefreshingOrders,
    siteSettings,
    adminSelectedOrderId,
    setAdminSelectedOrderId,
  } = useStore();

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-open order if selected from notifications
  React.useEffect(() => {
    if (adminSelectedOrderId) {
      const match = orders.find(
        (o) => o.id === adminSelectedOrderId || o.orderNumber.toLowerCase() === adminSelectedOrderId.toLowerCase()
      );
      if (match) {
        setSelectedOrder(match);
        setFilterStatus('All');
        setSearch('');
      }
    }
  }, [adminSelectedOrderId, orders]);

  const statuses: Order['status'][] = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  const pendingCount = orders.filter((o) => o.status === 'Pending').length;

  const filtered = orders.filter((o) => {
    if (filterStatus !== 'All' && o.status !== filterStatus) return false;
    if (
      search.trim() &&
      !o.orderNumber.toLowerCase().includes(search.toLowerCase()) &&
      !o.customerName.toLowerCase().includes(search.toLowerCase()) &&
      !o.customerPhone.includes(search) &&
      !o.city.toLowerCase().includes(search.toLowerCase()) &&
      !o.region.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getCleanPhoneForWhatsApp = (rawPhone: string) => {
    let cleaned = rawPhone.replace(/\D/g, '');
    if (cleaned.length === 8) {
      cleaned = '216' + cleaned;
    }
    return cleaned;
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    try {
      await deleteOrder(orderToDelete.id);
      if (selectedOrder?.id === orderToDelete.id) {
        setSelectedOrder(null);
      }
      if (adminSelectedOrderId === orderToDelete.id) {
        setAdminSelectedOrderId(null);
      }
      setOrderToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400">
              CENTRE DES COMMANDES // DISPATCH EN DIRECT
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-950/80 border border-emerald-600/50 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {isCloudSynced ? 'Firestore En Direct' : 'Synchronisation Cloud Active'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight flex items-center gap-3">
            <span>Gestion des Commandes</span>
            <span className="text-sm font-mono font-normal px-2.5 py-0.5 bg-neutral-800 text-neutral-300 border border-neutral-700">
              {orders.length} au total
            </span>
            {pendingCount > 0 && (
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/50">
                {pendingCount} en attente
              </span>
            )}
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-light">
            Toutes les commandes passées par les clients sont automatiquement enregistrées et synchronisées en temps réel dans le Cloud Firestore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {orders.length > 0 && (
            <button
              onClick={async () => {
                if (window.confirm('Voulez-vous réinitialiser et supprimer toutes les commandes de test pour ne conserver que les futures commandes réelles de vos clients ?')) {
                  await clearAllDemoOrders();
                }
              }}
              className="px-3 py-2 bg-neutral-900 border border-red-900/60 hover:border-red-500 text-red-400 hover:text-red-300 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Supprimer les commandes de test"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Nettoyer Commandes Test</span>
            </button>
          )}

          <button
            onClick={() => refreshOrdersFromCloud()}
            disabled={isRefreshingOrders}
            className="px-4 py-2 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-white text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            title="Rafraîchir depuis Firestore"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingOrders ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isRefreshingOrders ? 'Synchronisation...' : 'Actualiser Cloud'}</span>
          </button>
        </div>
      </div>

      {/* Cloud Sync Status Indicator Banner */}
      <div className="p-3 bg-[#111116] border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-neutral-300 font-mono text-[11px]">
            Statut Base de Données : <strong className="text-emerald-400">CONNECTÉ (Cloud Firestore)</strong>. Les nouvelles commandes des clients s'affichent instantanément ici.
          </span>
        </div>
        <span className="text-[10px] font-mono text-neutral-400">
          Dernière mise à jour : {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111116] border border-neutral-800 p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par #, nom, téléphone, ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', ...statuses].map((st) => {
            const count = st === 'All' ? orders.length : orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
                  filterStatus === st
                    ? 'bg-white text-black font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {st === 'All' ? 'Toutes' : st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#111116] border border-neutral-800 overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-neutral-600 mx-auto" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
              Aucune commande trouvée
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {search
                ? `Aucun résultat pour la recherche "${search}".`
                : 'Aucune commande ne correspond au filtre sélectionné.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] font-mono uppercase text-neutral-400 border-b border-neutral-800 bg-neutral-900/60">
              <tr>
                <th className="py-3 px-4">Commande</th>
                <th className="py-3 px-4">Client & Contact</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Articles</th>
                <th className="py-3 px-4">Montant Total</th>
                <th className="py-3 px-4">Statut en Direct</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-white tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <span>{ord.orderNumber}</span>
                      {ord.status === 'Pending' && (
                        <span className="w-2 h-2 rounded-full bg-amber-400" title="Nouvelle commande non traitée" />
                      )}
                    </div>
                    <span className="text-[10px] font-normal text-neutral-500 block">
                      {new Date(ord.createdAt).toLocaleDateString()} {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white block">{ord.customerName}</span>
                    <a
                      href={`tel:${ord.customerPhone}`}
                      className="font-mono text-emerald-400 hover:text-emerald-300 text-[11px] inline-flex items-center gap-1"
                    >
                      <Phone className="w-2.5 h-2.5" />
                      <span>{ord.customerPhone}</span>
                    </a>
                  </td>

                  <td className="py-3.5 px-4 text-[11px] text-neutral-400">
                    <span className="text-white font-medium block">{ord.city}</span>
                    <span className="truncate max-w-[160px] block text-neutral-400">{ord.region}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-white block">{ord.items.length} article(s)</span>
                    <span className="text-[10px] text-neutral-400 truncate max-w-[180px] block">
                      {ord.items.map((i) => `${i.name} (${i.size})`).join(', ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-white">
                    {ord.total.toFixed(2)} {siteSettings.currency}
                    <span className="text-[10px] font-normal text-amber-400/90 block uppercase font-mono">
                      {ord.paymentMethod === 'cod' ? 'Paiement à la livraison' : 'Carte'}
                    </span>
                  </td>

                  {/* Status Switcher Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['status'])}
                      className={`px-2.5 py-1 text-xs font-mono uppercase tracking-wider border focus:outline-none cursor-pointer transition-colors ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                          : ord.status === 'Cancelled'
                          ? 'bg-red-950/60 border-red-700 text-red-300'
                          : ord.status === 'Shipped'
                          ? 'bg-indigo-950/60 border-indigo-700 text-indigo-300'
                          : ord.status === 'Preparing'
                          ? 'bg-blue-950/60 border-blue-700 text-blue-300'
                          : ord.status === 'Confirmed'
                          ? 'bg-teal-950/60 border-teal-700 text-teal-300'
                          : 'bg-amber-950/60 border-amber-700 text-amber-300'
                      }`}
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st} className="bg-neutral-900 text-white">
                          {st === 'Pending'
                            ? '⏳ Pending (En attente)'
                            : st === 'Confirmed'
                            ? '✓ Confirmed (Confirmée)'
                            : st === 'Preparing'
                            ? '📦 Preparing (En préparation)'
                            : st === 'Shipped'
                            ? '🚚 Shipped (Expédiée)'
                            : st === 'Delivered'
                            ? '★ Delivered (Livrée)'
                            : '✕ Cancelled (Annulée)'}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer rounded-xs"
                        title="Voir tous les détails de la commande"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setOrderToDelete(ord)}
                        className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer rounded-xs"
                        title="Supprimer la commande"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <div className="relative w-full max-w-2xl bg-[#111116] border border-neutral-800 text-neutral-100 shadow-2xl p-6 sm:p-8 z-10 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                      Dossier Commande Client
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300">
                      Statut : {selectedOrder.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-mono text-white tracking-wider mt-0.5">
                    {selectedOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-900/60 border border-neutral-800 text-xs">
                <div className="space-y-1.5">
                  <strong className="text-white block uppercase tracking-wider mb-1 font-mono text-[11px]">
                    Profil du Client
                  </strong>
                  <div>
                    Nom complet : <strong className="text-white">{selectedOrder.customerName}</strong>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${selectedOrder.customerPhone}`}
                      className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 rounded-xs font-mono text-[11px] inline-flex items-center gap-1.5 hover:bg-emerald-900"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{selectedOrder.customerPhone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${getCleanPhoneForWhatsApp(selectedOrder.customerPhone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xs font-mono text-[11px] inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                  {selectedOrder.customerEmail && (
                    <div className="pt-1">
                      Email :{' '}
                      <a
                        href={`mailto:${selectedOrder.customerEmail}`}
                        className="font-mono text-neutral-300 hover:underline"
                      >
                        {selectedOrder.customerEmail}
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <strong className="text-white block uppercase tracking-wider mb-1 font-mono text-[11px]">
                    Adresse de Livraison
                  </strong>
                  <div className="text-white font-medium">{selectedOrder.address}</div>
                  <div>
                    {selectedOrder.city}, {selectedOrder.postalCode}
                  </div>
                  <div className="text-neutral-400 font-mono text-[11px]">{selectedOrder.region}</div>
                  {selectedOrder.notes && (
                    <div className="mt-2 p-2 bg-neutral-950 border border-neutral-800 text-amber-300/90 italic text-[11px]">
                      Note du client : "{selectedOrder.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Garments List */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Articles commandés ({selectedOrder.items.length})
                </span>
                <div className="divide-y divide-neutral-800/80 border border-neutral-800 bg-neutral-900/30">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <strong className="text-white uppercase tracking-wide block">{item.name}</strong>
                          <span className="text-neutral-400 text-[11px] font-mono">
                            Couleur : {item.color} · Taille : <strong className="text-white">{item.size}</strong> · Qté : {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="font-mono font-semibold text-white text-right">
                        {(item.price * item.quantity).toFixed(2)} {siteSettings.currency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 bg-neutral-900/60 border border-neutral-800 text-xs space-y-1.5">
                <div className="flex justify-between text-neutral-300">
                  <span>Sous-total articles :</span>
                  <span className="font-mono">{selectedOrder.subtotal.toFixed(2)} {siteSettings.currency}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Réduction appliquée :</span>
                    <span className="font-mono">-{selectedOrder.discountAmount.toFixed(2)} {siteSettings.currency}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-300">
                  <span>Frais de livraison ({selectedOrder.region}) :</span>
                  <span className="font-mono">{selectedOrder.deliveryFee.toFixed(2)} {siteSettings.currency}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Total à encaisser à la livraison (COD) :</span>
                  <span className="font-mono text-emerald-400 text-base">
                    {selectedOrder.total.toFixed(2)} {siteSettings.currency}
                  </span>
                </div>
              </div>

              {/* Status Update Trigger in Modal */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <span className="text-[11px] font-mono uppercase text-neutral-400 block">
                  Changer le statut en direct :
                </span>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((st) => (
                    <button
                      key={st}
                      onClick={async () => {
                        await updateOrderStatus(selectedOrder.id, st);
                        setSelectedOrder({ ...selectedOrder, status: st });
                      }}
                      className={`px-3 py-1.5 text-xs font-mono uppercase border cursor-pointer transition-colors ${
                        selectedOrder.status === st
                          ? 'bg-white text-black font-bold border-white shadow-md'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Danger Zone: Delete */}
              <div className="pt-2 flex justify-between items-center border-t border-neutral-800/80 text-xs text-neutral-500">
                <span>Date de commande : {new Date(selectedOrder.createdAt).toLocaleString()}</span>
                <button
                  onClick={() => setOrderToDelete(selectedOrder)}
                  className="text-red-400 hover:text-red-300 inline-flex items-center gap-1.5 cursor-pointer font-mono px-3 py-1.5 rounded-xs hover:bg-red-950/40 border border-transparent hover:border-red-900/60 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer cette commande</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-App Order Deletion Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            onClick={() => !isDeleting && setOrderToDelete(null)}
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-[#141419] border border-red-900/50 text-neutral-100 shadow-2xl p-6 z-10 space-y-5 rounded-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-700/60 flex items-center justify-center shrink-0 text-red-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">
                    Supprimer la commande ?
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Cette action supprimera définitivement la commande{' '}
                    <strong className="text-white font-mono">#{orderToDelete.orderNumber}</strong> de la base de données.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-neutral-900/80 border border-neutral-800 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Client :</span>
                  <span className="text-white font-semibold">{orderToDelete.customerName}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Téléphone :</span>
                  <span className="text-white">{orderToDelete.customerPhone}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Montant :</span>
                  <span className="text-emerald-400 font-bold">{orderToDelete.total.toFixed(2)} {siteSettings.currency}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setOrderToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 cursor-pointer disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 border border-red-500 shadow-lg cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeleting ? 'Suppression...' : 'Supprimer Définitivement'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
