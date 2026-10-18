import React, { useState } from 'react';
import { AzureService, AzureCategory } from '../types';
import { RenderAzureIcon } from './AzureIcons';
import { Check, X, Search, Filter, Plus } from 'lucide-react';

interface StackSelectorProps {
  catalog: Record<string, AzureService>;
  selectedServiceIds: string[];
  onToggleService: (serviceId: string) => void;
  onApplyChanges: () => void;
  onClose: () => void;
}

const CATEGORIES: AzureCategory[] = [
  'Datos',
  'ETLs',
  'Cómputo',
  'Desarrollo Web',
  'Contenedores',
  'Kubernetes',
  'AI',
  'Seguridad',
  'Redes'
];

export function StackSelector({
  catalog,
  selectedServiceIds,
  onToggleService,
  onApplyChanges,
  onClose,
}: StackSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const services = Object.values(catalog);

  const filteredServices = services.filter((srv) => {
    const matchesCategory = selectedCategory === 'all' || srv.category === selectedCategory;
    const matchesSearch = srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          srv.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Catálogo de Recursos Azure por Stacks</span>
              <span className="text-xs font-normal text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                {selectedServiceIds.length} seleccionados
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Datos, ETLs, Cómputo, Desarrollo Web, Contenedores, Kubernetes e Inteligencia Artificial
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 w-64">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar servicio Azure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none w-full"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredServices.map((srv) => {
            const isSelected = selectedServiceIds.includes(srv.id);
            return (
              <div
                key={srv.id}
                onClick={() => onToggleService(srv.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                    <RenderAzureIcon icon={srv.id} size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-100 truncate">
                        {srv.name}
                      </span>
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-slate-600">
                          <Plus className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-blue-400 font-mono block mt-0.5">
                      {srv.category}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {srv.description}
                    </p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 truncate">
                  {srv.type}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {selectedServiceIds.length} componentes elegidos para síntesis de arquitectura
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onApplyChanges();
                onClose();
              }}
              className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-sm"
            >
              Aplicar y Regenerar Arquitectura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
