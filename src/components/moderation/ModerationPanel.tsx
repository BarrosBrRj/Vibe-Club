import React, { useState } from 'react';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, UserX, Trash2, 
  EyeOff, Clock, Search, Filter, History, MessageSquare, 
  ShoppingBag, Users, User, FileText, ArrowRight, ShieldCheck,
  AlertOctagon, Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReportItem, ReportTargetType, ModerationAuditAction } from '../../types/moderation';

export const ModerationPanel: React.FC = () => {
  const { 
    reports, 
    auditLog, 
    removeReportedContent, 
    warnUser, 
    suspendUser, 
    dismissReport,
    showToast
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'resolved'>('pending');
  const [sortBy, setSortBy] = useState<'recent' | 'count'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'queue' | 'audit'>('queue');

  // Suspension modal state
  const [suspendingReport, setSuspendingReport] = useState<ReportItem | null>(null);
  const [suspensionDuration, setSuspensionDuration] = useState<'1_dia' | '7_dias' | 'permanente'>('7_dias');
  const [suspensionReason, setSuspensionReason] = useState('Violação reiterada das diretrizes da comunidade');

  // Removal justification modal state
  const [removingReport, setRemovingReport] = useState<ReportItem | null>(null);
  const [removalJustification, setRemovalJustification] = useState('Conteúdo viola as regras de convivência e segurança do Vibe Clube');

  // Warning modal state
  const [warningReport, setWarningReport] = useState<ReportItem | null>(null);
  const [warningMessage, setWarningMessage] = useState('Seu conteúdo foi denunciado e identificado como impróprio. Evite reincidência para não sofrer suspensão de conta.');

  // Filter & sort logic
  const filteredReports = reports
    .filter(item => {
      // Status filter
      if (filterStatus === 'pending' && item.status !== 'pending') return false;
      if (filterStatus === 'resolved' && item.status === 'pending') return false;

      // Category filter
      if (filterCategory !== 'all') {
        if (filterCategory === 'post' && item.targetType !== 'post') return false;
        if (filterCategory === 'marketplace' && item.targetType !== 'marketplace') return false;
        if (filterCategory === 'user' && item.targetType !== 'user') return false;
        if (filterCategory === 'group' && (item.targetType !== 'group' && item.targetType !== 'community' && item.targetType !== 'page')) return false;
        if (filterCategory === 'chat' && item.targetType !== 'chat_message') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.targetName?.toLowerCase().includes(q);
        const matchesAuthor = item.targetAuthorName?.toLowerCase().includes(q);
        const matchesSnippet = item.targetContentSnippet?.toLowerCase().includes(q);
        const matchesReasons = item.reasons.some(r => r.toLowerCase().includes(q));
        return matchesName || matchesAuthor || matchesSnippet || matchesReasons;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'count') {
        return b.reportCount - a.reportCount;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const getTargetBadge = (type: ReportTargetType) => {
    switch (type) {
      case 'post':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 flex items-center gap-1"><FileText className="w-3 h-3" /> Post</span>;
      case 'marketplace':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> Marketplace</span>;
      case 'user':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 flex items-center gap-1"><User className="w-3 h-3" /> Perfil</span>;
      case 'group':
      case 'community':
      case 'page':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1"><Users className="w-3 h-3" /> Grupo/Pág</span>;
      case 'chat_message':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Chat</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Conteúdo</span>;
    }
  };

  const handleConfirmRemoval = () => {
    if (!removingReport) return;
    removeReportedContent(removingReport.id, removalJustification);
    setRemovingReport(null);
  };

  const handleConfirmWarning = () => {
    if (!warningReport || !warningReport.targetAuthorId) return;
    warnUser(warningReport.id, warningReport.targetAuthorId, warningMessage);
    setWarningReport(null);
  };

  const handleConfirmSuspension = () => {
    if (!suspendingReport || !suspendingReport.targetAuthorId) return;
    suspendUser(
      suspendingReport.id, 
      suspendingReport.targetAuthorId, 
      suspensionDuration, 
      suspensionReason
    );
    setSuspendingReport(null);
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const resolvedCount = reports.filter(r => r.status !== 'pending').length;

  return (
    <div className="space-y-5 animate-in fade-in pb-10">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-purple-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Painel de Moderação & Segurança
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/40 text-purple-300 border border-purple-400/30">
                  Staff Only
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Supervisão de denúncias, aplicação de sanções e auditoria em tempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'queue'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Fila ({pendingCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'audit'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Auditoria ({auditLog.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'queue' ? (
        <div className="space-y-4">
          
          {/* Controls: Search, Categories, Status, Sorting */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar denúncia ou usuário..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto text-xs font-bold">
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterStatus === 'pending'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pendentes ({pendingCount})
                </button>
                <button
                  onClick={() => setFilterStatus('resolved')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterStatus === 'resolved'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Resolvidas ({resolvedCount})
                </button>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
                <span className="text-slate-500 font-medium">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 outline-hidden text-xs cursor-pointer"
                >
                  <option value="recent">Mais recentes</option>
                  <option value="count">Mais denunciadas (Agrupadas)</option>
                </select>
              </div>

            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'Todos os tipos' },
                { id: 'post', label: 'Posts' },
                { id: 'marketplace', label: 'Marketplace' },
                { id: 'user', label: 'Perfis' },
                { id: 'group', label: 'Grupos & Comunidades' },
                { id: 'chat', label: 'Chat' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    filterCategory === cat.id
                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Report Queue List */}
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-black text-base text-slate-900">
                {filterStatus === 'pending' ? 'Tudo limpo na fila de denúncias!' : 'Nenhuma denúncia resolvida encontrada'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {filterStatus === 'pending' 
                  ? 'Nenhum conteúdo com denúncias pendentes no momento. A comunidade está segura.'
                  : 'As denúncias analisadas e tratadas aparecerão aqui.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <div 
                  key={report.id}
                  className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-xs ${
                    report.autoHidden 
                      ? 'border-amber-400/80 bg-amber-50/20' 
                      : report.status === 'resolved' 
                      ? 'border-slate-200 opacity-80' 
                      : 'border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    
                    {/* Left: Info & Content Preview */}
                    <div className="space-y-2.5 flex-1 min-w-0">
                      
                      {/* Top Badges & Meta */}
                      <div className="flex flex-wrap items-center gap-2">
                        {getTargetBadge(report.targetType)}
                        
                        {/* Report count badge */}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                          report.reportCount >= 5 
                            ? 'bg-red-600 text-white animate-pulse' 
                            : report.reportCount > 1 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          <AlertTriangle className="w-3 h-3" />
                          <span>{report.reportCount} {report.reportCount === 1 ? 'denúncia' : 'denúncias'}</span>
                        </span>

                        {/* Automatic Hidden Badge if 5+ reports */}
                        {report.autoHidden && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white flex items-center gap-1">
                            <EyeOff className="w-3 h-3" />
                            <span>Auto-Ocultado (5+ denúncias)</span>
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400 font-medium ml-auto sm:ml-0">
                          {new Date(report.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Content Preview Box */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                        <div className="flex items-center gap-2">
                          {report.targetAuthorAvatar && (
                            <img
                              src={report.targetAuthorAvatar}
                              alt={report.targetAuthorName || 'Autor'}
                              className="w-6 h-6 rounded-full object-cover shrink-0"
                            />
                          )}
                          <span className="font-bold text-slate-900 truncate">
                            Autor: {report.targetAuthorName || 'Usuário Desconhecido'}
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            (ID: {report.targetAuthorId || report.targetId})
                          </span>
                        </div>

                        {report.targetName && (
                          <div className="font-semibold text-slate-800">
                            {report.targetName}
                          </div>
                        )}

                        {report.targetContentSnippet && (
                          <p className="text-slate-700 italic bg-white p-2 rounded-lg border border-slate-200/60">
                            "{report.targetContentSnippet}"
                          </p>
                        )}

                        {report.targetImageUrl && (
                          <img
                            src={report.targetImageUrl}
                            alt="Prévia denunciada"
                            className="w-24 h-24 object-cover rounded-lg border border-slate-200 mt-1"
                          />
                        )}
                      </div>

                      {/* Reasons list */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-700">Motivos apontados:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {report.reasons.map((r, i) => (
                            <span key={i} className="px-2 py-0.5 bg-red-50 text-red-700 rounded-lg text-[11px] font-bold border border-red-200">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Reporter note */}
                      {report.details && report.details.length > 0 && report.details.some(d => !!d) && (
                        <div className="text-[11px] text-slate-600 bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                          <span className="font-bold text-amber-900">Observações de denunciantes: </span>
                          <span>{report.details.filter(Boolean).join(' | ')}</span>
                        </div>
                      )}

                      {report.latestReporterName && (
                        <div className="text-[10px] text-slate-400">
                          Denunciado por: <span className="font-semibold text-slate-600">{report.latestReporterName}</span>
                          {report.reporterIds.length > 1 && ` e outros ${report.reporterIds.length - 1} usuários`}
                        </div>
                      )}

                    </div>

                    {/* Right / Actions Buttons */}
                    {report.status === 'pending' ? (
                      <div className="flex lg:flex-col gap-2 shrink-0 justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
                        
                        {/* Remove Content */}
                        <button
                          onClick={() => {
                            setRemovingReport(report);
                            setRemovalJustification(`Violação: ${report.reasons.join(', ')}`);
                          }}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                          title="Remover conteúdo e notificar autor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remover</span>
                        </button>

                        {/* Warn User */}
                        {report.targetAuthorId && (
                          <button
                            onClick={() => {
                              setWarningReport(report);
                              setWarningMessage(`Aviso oficial: Seu conteúdo foi denunciado por "${report.reasons.join(', ')}". Por favor, respeite as diretrizes da comunidade.`);
                            }}
                            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                            title="Enviar advertência formal"
                          >
                            <AlertOctagon className="w-3.5 h-3.5" />
                            <span>Advertir</span>
                          </button>
                        )}

                        {/* Suspend User */}
                        {report.targetAuthorId && (
                          <button
                            onClick={() => {
                              setSuspendingReport(report);
                              setSuspensionReason(`Violações graves/reiteradas: ${report.reasons.join(', ')}`);
                            }}
                            className="px-3 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                            title="Suspender temporariamente ou banir"
                          >
                            <UserX className="w-3.5 h-3.5 text-red-400" />
                            <span>Suspender</span>
                          </button>
                        )}

                        {/* Dismiss Report */}
                        <button
                          onClick={() => dismissReport(report.id)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          title="Ignorar denúncia (conteúdo em conformidade)"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Ignorar</span>
                        </button>

                      </div>
                    ) : (
                      <div className="flex lg:flex-col gap-1 shrink-0 justify-end">
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Resolvida</span>
                        </span>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      ) : (
        /* Audit Log Tab */
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-purple-600" />
                <span>Histórico de Ações da Moderação</span>
              </h3>
              <p className="text-xs text-slate-500">
                Registro imutável de todas as decisões tomadas pela equipe para auditoria
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {auditLog.length} ações
            </span>
          </div>

          {auditLog.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Nenhuma ação registrada no log de auditoria ainda.
            </div>
          ) : (
            <div className="space-y-2.5">
              {auditLog.map((action) => (
                <div key={action.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                      action.actionType === 'remove_content' ? 'bg-red-100 text-red-800' :
                      action.actionType === 'suspend_user' ? 'bg-black text-white' :
                      action.actionType === 'warn_user' ? 'bg-amber-100 text-amber-900' :
                      'bg-slate-200 text-slate-800'
                    }`}>
                      {action.actionType === 'remove_content' && 'Conteúdo Removido'}
                      {action.actionType === 'suspend_user' && `Usuário Suspenso (${action.duration?.replace('_', ' ') || '7 dias'})`}
                      {action.actionType === 'warn_user' && 'Advertência Aplicada'}
                      {action.actionType === 'dismiss_report' && 'Denúncia Arquivada'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(action.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-slate-800 font-semibold pt-1">
                    Moderador: <span className="font-bold text-purple-700">{action.moderatorName}</span>
                    {action.targetAuthorName && (
                      <span> → Alvo: <span className="font-bold text-slate-900">{action.targetAuthorName}</span></span>
                    )}
                  </div>

                  <div className="text-slate-600">
                    <strong>Motivo/Justificativa:</strong> {action.reason}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Remover Conteúdo com Justificativa */}
      {removingReport && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-red-600 border-b pb-3">
              <Trash2 className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-slate-900">Confirmar Remoção de Conteúdo</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              O conteúdo será excluído permanentemente da plataforma. Uma notificação automática será enviada ao autor ({removingReport.targetAuthorName}) informando a categoria da infração, <strong>sem revelar quem realizou a denúncia</strong>.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Justificativa enviada ao autor:
              </label>
              <textarea
                rows={3}
                value={removalJustification}
                onChange={(e) => setRemovalJustification(e.target.value)}
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 outline-hidden font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setRemovingReport(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmRemoval}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Remover e Notificar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Advertir Usuário */}
      {warningReport && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-amber-600 border-b pb-3">
              <AlertOctagon className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-slate-900">Enviar Advertência Formal</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Uma notificação prioritária oficial será enviada para <strong>{warningReport.targetAuthorName}</strong>.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Mensagem de advertência:
              </label>
              <textarea
                rows={3}
                value={warningMessage}
                onChange={(e) => setWarningMessage(e.target.value)}
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 outline-hidden font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setWarningReport(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmWarning}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Enviar Advertência
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Suspender Usuário */}
      {suspendingReport && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-slate-900 border-b pb-3">
              <UserX className="w-5 h-5 text-red-600" />
              <h3 className="font-extrabold text-base text-slate-900">Suspender Usuário</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Durante a suspensão, <strong>{suspendingReport.targetAuthorName}</strong> não poderá publicar posts, comentar, criar anúncios no Marketplace nem dar matches no Vibe Encontros. O acesso a chats existentes permanecerá ativo.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Duração da suspensão:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '1_dia', label: '1 Dia' },
                  { id: '7_dias', label: '7 Dias' },
                  { id: 'permanente', label: 'Permanente' },
                ].map((dur) => (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => setSuspensionDuration(dur.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      suspensionDuration === dur.id
                        ? 'border-red-600 bg-red-50 text-red-950 ring-2 ring-red-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Motivo da sanção:
              </label>
              <input
                type="text"
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 outline-hidden font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setSuspendingReport(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspension}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Confirmar Suspensão
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
