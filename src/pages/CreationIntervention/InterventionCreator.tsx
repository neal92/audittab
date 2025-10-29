import { CheckSquare, XSquare, Plus, Trash2, GripVertical, Type, Hash, AlignLeft, CheckCheck, Calendar, Image as ImageIcon, Star, List, Camera, Mic, Paperclip, ChevronUp, ChevronDown, Settings, Eye } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
// Injecte l'animation CSS pour l'étoile favoris une seule fois
if (typeof window !== 'undefined' && !document.head.querySelector('style[data-fav-anim]')) {
  const style = document.createElement('style');
  style.innerHTML = `
  .fav-anim.animate-fav {
    animation: fav-pop 0.35s cubic-bezier(.36,1.6,.64,1) 1;
  }
  @keyframes fav-pop {
    0% { transform: scale(1) rotate(0deg); }
    30% { transform: scale(1.3) rotate(-15deg); }
    60% { transform: scale(0.9) rotate(10deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
  `;
  style.setAttribute('data-fav-anim', 'true');
  document.head.appendChild(style);
}
import { Intervention, Operation, OperationField, FieldType } from '../../lib/types';

/**
 * Composant pour la création et gestion des interventions
 * Une intervention contient des opérations, chaque opération contient des champs
 */
export default function InterventionCreator() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [currentIntervention, setCurrentIntervention] = useState<Partial<Intervention> | null>(null);

  // État pour le drag & drop
  const [draggedField, setDraggedField] = useState<{ type: FieldType; label: string } | null>(null);
  
  // État pour afficher plus ou moins d'outils
  const [showAllTools, setShowAllTools] = useState(false);
  
  // État pour gérer l'expansion des options de champ
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);
  
  // État pour gérer les favoris de la toolbox (stocké dans localStorage)
  const [favoriteTools, setFavoriteTools] = useState<FieldType[]>(() => {
    const stored = localStorage.getItem('favoriteToolboxItems');
    return stored ? JSON.parse(stored) : [];
  });

  // État pour afficher la modal d'aperçu
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Sauvegarder les favoris dans localStorage
  const toggleFavoriteTool = (type: FieldType) => {
    const newFavorites = favoriteTools.includes(type)
      ? favoriteTools.filter(t => t !== type)
      : [...favoriteTools, type];
    setFavoriteTools(newFavorites);
    localStorage.setItem('favoriteToolboxItems', JSON.stringify(newFavorites));
  };

  // Charger les interventions depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem('interventions');
    if (stored) {
      setInterventions(JSON.parse(stored));
    }
  }, []);

  // Boîte à outils avec les différents types de champs
  const allToolboxItems: { type: FieldType; label: string; icon: any; description: string }[] = [
    { type: 'checkpoint', label: 'Point de contrôle', icon: CheckSquare, description: 'Conforme/Non conforme/Non applicable' },
    { type: 'text', label: 'Texte court', icon: Type, description: 'Champ de saisie texte' },
    { type: 'textarea', label: 'Texte long', icon: AlignLeft, description: 'Zone de texte multiligne' },
    { type: 'number', label: 'Nombre', icon: Hash, description: 'Valeur numérique' },
    { type: 'select', label: 'Liste déroulante', icon: List, description: 'Sélection parmi des options' },
    { type: 'checkbox', label: 'Case à cocher', icon: CheckCheck, description: 'Oui/Non' },
    { type: 'rating', label: 'Évaluation', icon: Star, description: 'Note sur 5 étoiles' },
    { type: 'date', label: 'Date', icon: Calendar, description: 'Sélection de date' },
    { type: 'photo', label: 'Photo', icon: ImageIcon, description: 'Prise de photo' },
  ];

  // Trier les outils : favoris en premier
  const sortedToolboxItems = [...allToolboxItems].sort((a, b) => {
    const aFav = favoriteTools.includes(a.type);
    const bFav = favoriteTools.includes(b.type);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  // Outils visibles selon l'état showAllTools
  const visibleToolboxItems = showAllTools ? sortedToolboxItems : sortedToolboxItems.slice(0, 5);

  // Démarrer la création d'une nouvelle intervention
  const startCreating = () => {
    setCurrentIntervention({
      id: uuidv4(),
      name: '',
      description: '',
      operations: [],
      company_id: 'mock-company',
      created_by: 'mock-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setIsCreating(true);
  };

  // Annuler la création
  const cancelCreating = () => {
    setCurrentIntervention(null);
    setIsCreating(false);
  };

  // Sauvegarder l'intervention
  const saveIntervention = () => {
    if (currentIntervention && currentIntervention.name) {
      let updatedInterventions;
      
      // Vérifier si c'est une modification ou une création
      const existingIndex = interventions.findIndex(i => i.id === currentIntervention.id);
      
      if (existingIndex >= 0) {
        // Mise à jour d'une intervention existante
        updatedInterventions = interventions.map(i => 
          i.id === currentIntervention.id ? currentIntervention as Intervention : i
        );
        alert('Intervention modifiée avec succès !');
      } else {
        // Création d'une nouvelle intervention
        updatedInterventions = [...interventions, currentIntervention as Intervention];
        alert('Intervention créée avec succès !');
      }
      
      setInterventions(updatedInterventions);
      localStorage.setItem('interventions', JSON.stringify(updatedInterventions));
      setCurrentIntervention(null);
      setIsCreating(false);
    }
  };

  // Ajouter une opération
  const addOperation = () => {
    if (!currentIntervention) return;
    const newOperation: Operation = {
      id: uuidv4(),
      name: `Opération ${(currentIntervention.operations?.length || 0) + 1}`,
      description: '',
      fields: [],
    };
    setCurrentIntervention({
      ...currentIntervention,
      operations: [...(currentIntervention.operations || []), newOperation],
    });
  };

  // Supprimer une opération
  const deleteOperation = (operationId: string) => {
    if (!currentIntervention) return;
    setCurrentIntervention({
      ...currentIntervention,
      operations: currentIntervention.operations?.filter(op => op.id !== operationId) || [],
    });
  };

  // Mettre à jour une opération
  const updateOperation = (operationId: string, updates: Partial<Operation>) => {
    if (!currentIntervention) return;
    setCurrentIntervention({
      ...currentIntervention,
      operations: currentIntervention.operations?.map(op =>
        op.id === operationId ? { ...op, ...updates } : op
      ) || [],
    });
  };

  // Ajouter un champ à une opération via drag & drop
  const handleDrop = (operationId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedField || !currentIntervention) return;

    const newField: OperationField = {
      id: uuidv4(),
      type: draggedField.type,
      label: draggedField.label,
      description: '',
      required: false,
    };

    setCurrentIntervention({
      ...currentIntervention,
      operations: currentIntervention.operations?.map(op =>
        op.id === operationId
          ? { ...op, fields: [...op.fields, newField] }
          : op
      ) || [],
    });

    setDraggedField(null);
  };

  // Supprimer un champ d'une opération
  const deleteField = (operationId: string, fieldId: string) => {
    if (!currentIntervention) return;
    setCurrentIntervention({
      ...currentIntervention,
      operations: currentIntervention.operations?.map(op =>
        op.id === operationId
          ? { ...op, fields: op.fields.filter(f => f.id !== fieldId) }
          : op
      ) || [],
    });
  };

  // Mettre à jour un champ
  const updateField = (operationId: string, fieldId: string, updates: Partial<OperationField>) => {
    if (!currentIntervention) return;
    setCurrentIntervention({
      ...currentIntervention,
      operations: currentIntervention.operations?.map(op =>
        op.id === operationId
          ? {
              ...op,
              fields: op.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
            }
          : op
      ) || [],
    });
  };

  // Réorganiser les champs dans une opération
  const reorderFields = (operationId: string, fromIndex: number, toIndex: number) => {
    if (!currentIntervention) return;
    
    setCurrentIntervention({
      ...currentIntervention,
      operations: currentIntervention.operations?.map(op => {
        if (op.id === operationId) {
          const fields = [...op.fields];
          const [movedField] = fields.splice(fromIndex, 1);
          fields.splice(toIndex, 0, movedField);
          return { ...op, fields };
        }
        return op;
      }) || [],
    });
  };

  // Supprimer une intervention
  const deleteIntervention = (interventionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette intervention ? Cette action est irréversible.')) return;
    
    const updatedInterventions = interventions.filter(i => i.id !== interventionId);
    setInterventions(updatedInterventions);
    localStorage.setItem('interventions', JSON.stringify(updatedInterventions));
  };

  // Rendre la liste des interventions
  const renderInterventionsList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-audittab-navy">Mes interventions</h2>
        <button
          onClick={startCreating}
          className="flex items-center gap-2 px-4 py-2 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-dark transition-colors"
        >
          <Plus className="h-5 w-5" />
          Créer une intervention
        </button>
      </div>

      {interventions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune intervention</h3>
          <p className="text-slate-600 mb-6">Commencez par créer votre première intervention</p>
          <button
            onClick={startCreating}
            className="inline-flex items-center gap-2 px-6 py-3 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-dark transition-colors"
          >
            <Plus className="h-5 w-5" />
            Créer une intervention
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {interventions.map(intervention => (
            <div key={intervention.id} className="relative">
              <button
                onClick={() => {
                  setCurrentIntervention(intervention);
                  setIsCreating(true);
                }}
                className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-audittab-green transition-all text-left"
              >
                <h3 className="text-lg font-semibold text-slate-900">{intervention.name}</h3>
                <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
                  <span>{intervention.operations.length} opération(s)</span>
                  <span>
                    {new Date(intervention.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </button>
              
              {/* Bouton de suppression */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteIntervention(intervention.id);
                }}
                className="absolute top-2 right-2 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer l'intervention"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Rendre le créateur d'intervention
  const renderCreator = () => {
    if (!currentIntervention) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Créer une intervention</h2>
          <div className="flex gap-3">
            <button
              onClick={cancelCreating}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={saveIntervention}
              disabled={!currentIntervention.name}
              className="px-6 py-2 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-dark transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Enregistrer
            </button>
          </div>
        </div>

        {/* Informations de base */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Informations générales</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom de l'intervention *
              </label>
              <input
                type="text"
                value={currentIntervention.name || ''}
                onChange={(e) => setCurrentIntervention({ ...currentIntervention, name: e.target.value })}
                placeholder="Ex: Contrôle qualité bâtiment A"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Boîte à outils - Colonne de gauche */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">🧰 Boîte à outils</h3>
              <p className="text-sm text-slate-600 mb-4">
                Glissez-déposez les éléments dans les opérations
              </p>
              <div className="space-y-2">
                {visibleToolboxItems.map(item => {
                  const Icon = item.icon;
                  const isFavorite = favoriteTools.includes(item.type);
                  
                  return (
                    <div
                      key={item.type}
                      className="relative flex items-center gap-3 p-3 bg-slate-50 border-2 border-slate-200 rounded-lg hover:bg-slate-100 hover:border-audittab-green transition-all"
                    >
                      {/* Bouton favori */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteTool(item.type);
                          // Animation visuelle rapide
                          const btn = e.currentTarget;
                          btn.classList.add('animate-fav');
                          setTimeout(() => btn.classList.remove('animate-fav'), 350);
                        }}
                        className={`p-1 rounded transition-colors fav-anim ${
                          isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-slate-300 hover:text-yellow-400'
                        }`}
                        title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        style={{ outline: 'none' }}
                      >
                        <span className="inline-block" aria-hidden="true">
                          {isFavorite ? '★' : '☆'}
                        </span>
                      </button>
                      
                      {/* Item draggable */}
                      <div
                        draggable
                        onDragStart={() => setDraggedField({ type: item.type, label: item.label })}
                        onDragEnd={() => setDraggedField(null)}
                        className="flex items-center gap-3 flex-1 cursor-move"
                      >
                        <GripVertical className="h-4 w-4 text-slate-400" />
                        <Icon className="h-5 w-5 text-audittab-green" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-900">{item.label}</div>
                          <div className="text-xs text-slate-500">{item.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Bouton Voir plus d'outils en bas */}
              {!showAllTools && (
                <button
                  onClick={() => setShowAllTools(true)}
                  className="w-full mt-3 px-4 py-2 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-dark transition-colors text-sm font-medium"
                >
                  Voir plus d'outils ({allToolboxItems.length - visibleToolboxItems.length} autres)
                </button>
              )}
              
              {showAllTools && (
                <button
                  onClick={() => setShowAllTools(false)}
                  className="w-full mt-3 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  Voir moins d'outils
                </button>
              )}
            </div>
          </div>

          {/* Zone des opérations - Colonne de droite */}
          <div className="col-span-12 lg:col-span-9">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Opérations</h3>
                <button
                  onClick={addOperation}
                  className="flex items-center gap-2 px-4 py-2 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-dark transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une opération
                </button>
              </div>

              {currentIntervention.operations && currentIntervention.operations.length > 0 ? (
                <div className="space-y-4">
                  {currentIntervention.operations.map((operation) => (
                    <div
                      key={operation.id}
                      className="bg-white rounded-xl shadow-sm border-2 border-slate-200 p-6"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(operation.id, e)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 mr-4">
                          <input
                            type="text"
                            value={operation.name}
                            onChange={(e) => updateOperation(operation.id, { name: e.target.value })}
                            className="text-lg font-semibold text-slate-900 bg-transparent border-b-2 border-transparent hover:border-slate-300 focus:border-audittab-green focus:outline-none w-full"
                          />
                          <input
                            type="text"
                            value={operation.description || ''}
                            onChange={(e) => updateOperation(operation.id, { description: e.target.value })}
                            placeholder="Description de l'opération"
                            className="text-sm text-slate-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-audittab-green focus:outline-none w-full mt-2"
                          />
                        </div>
                        <button
                          onClick={() => deleteOperation(operation.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Zone de drop */}
                      <div className="min-h-[100px] border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50">
                        {operation.fields.length === 0 ? (
                          <div className="text-center text-slate-500 py-8">
                            <div className="text-4xl mb-2">👆</div>
                            <p className="text-sm">Glissez des éléments ici depuis la boîte à outils</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {operation.fields.map((field, fieldIndex) => {
                              const toolboxItem = allToolboxItems.find(t => t.type === field.type);
                              const Icon = toolboxItem?.icon || Type;
                              const fieldKey = `${operation.id}-${field.id}`;
                              const isExpanded = expandedFieldId === fieldKey;
                              
                              return (
                                <div
                                  key={field.id}
                                  className="relative overflow-hidden"
                                >
                                  {/* Conteneur avec animation swipe */}
                                  <div
                                    className={`transition-transform duration-300 ease-in-out ${
                                      isExpanded ? '-translate-x-24' : 'translate-x-0'
                                    }`}
                                  >
                                    <div className="bg-white border border-slate-200 rounded-lg p-4">
                                      <div className="flex items-start gap-3">
                                        {/* Boutons de réorganisation */}
                                        <div className="flex flex-col gap-1">
                                          <button
                                            onClick={() => reorderFields(operation.id, fieldIndex, fieldIndex - 1)}
                                            disabled={fieldIndex === 0}
                                            className="p-1 text-slate-400 hover:text-audittab-green hover:bg-slate-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                            title="Monter"
                                          >
                                            <ChevronUp className="h-4 w-4" />
                                          </button>
                                          <button
                                            onClick={() => reorderFields(operation.id, fieldIndex, fieldIndex + 1)}
                                            disabled={fieldIndex === operation.fields.length - 1}
                                            className="p-1 text-slate-400 hover:text-audittab-green hover:bg-slate-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                            title="Descendre"
                                          >
                                            <ChevronDown className="h-4 w-4" />
                                          </button>
                                        </div>
                                        
                                        <Icon className="h-5 w-5 text-audittab-green mt-1" />
                                        <div className="flex-1">
                                          <input
                                            type="text"
                                            value={field.label}
                                            onChange={(e) => updateField(operation.id, field.id, { label: e.target.value })}
                                            className="font-medium text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-audittab-green focus:outline-none w-full mb-2"
                                          />
                                          <input
                                            type="text"
                                            value={field.description || ''}
                                            onChange={(e) => updateField(operation.id, field.id, { description: e.target.value })}
                                            placeholder="Description du champ"
                                            className="text-sm text-slate-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-audittab-green focus:outline-none w-full"
                                          />
                                          
                                          {/* Options pour le champ select */}
                                          {field.type === 'select' && (
                                            <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                              <div className="text-xs font-medium text-slate-700 mb-2">Options de la liste :</div>
                                              <div className="space-y-2">
                                                {(field.options || []).map((option, idx) => (
                                                  <div key={option.id} className="flex gap-2">
                                                    <input
                                                      type="text"
                                                      value={option.label}
                                                      onChange={(e) => {
                                                        const newOptions = [...(field.options || [])];
                                                        newOptions[idx] = { ...option, label: e.target.value };
                                                        updateField(operation.id, field.id, { options: newOptions });
                                                      }}
                                                      placeholder={`Option ${idx + 1}`}
                                                      className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded"
                                                    />
                                                    <button
                                                      onClick={() => {
                                                        const newOptions = (field.options || []).filter((_, i) => i !== idx);
                                                        updateField(operation.id, field.id, { options: newOptions });
                                                      }}
                                                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                      <XSquare className="h-4 w-4" />
                                                    </button>
                                                  </div>
                                                ))}
                                                <button
                                                  onClick={() => {
                                                    const newOptions = [...(field.options || []), { id: uuidv4(), label: '' }];
                                                    updateField(operation.id, field.id, { options: newOptions });
                                                  }}
                                                  className="text-xs text-audittab-green hover:text-audittab-green-dark flex items-center gap-1"
                                                >
                                                  <Plus className="h-3 w-3" /> Ajouter une option
                                                </button>
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        {/* Bouton engrenage */}
                                        <button
                                          type="button"
                                          onClick={() => setExpandedFieldId(isExpanded ? null : fieldKey)}
                                          className="p-2 text-slate-400 hover:text-audittab-green hover:bg-slate-100 rounded-lg transition-colors"
                                          title="Options du champ"
                                        >
                                          <Settings className="h-5 w-5" />
                                        </button>

                                        <button
                                          onClick={() => deleteField(operation.id, field.id)}
                                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Panneau d'options (révélé par le swipe) */}
                                  <div
                                    className={`absolute right-0 top-0 h-full w-24 bg-slate-100 border-l-2 border-slate-200 flex items-center justify-center transition-opacity duration-300 rounded-r-lg ${
                                      isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                    }`}
                                  >
                                    <div className="flex flex-col gap-2 px-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateField(operation.id, field.id, { required: !field.required });
                                        }}
                                        className={`px-2 py-2 text-xs font-medium rounded-lg transition-colors ${
                                          field.required
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-slate-300 text-slate-700 hover:bg-slate-400'
                                        }`}
                                      >
                                        {field.required ? 'Obligatoire' : 'Optionnel'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune opération</h3>
                  <p className="text-slate-600 mb-6">Ajoutez votre première opération à cette intervention</p>
                  <button
                    onClick={addOperation}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-dark transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Ajouter une opération
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bouton d'aperçu de la fiche */}
        {currentIntervention.operations && currentIntervention.operations.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowPreviewModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-dark transition-colors"
            >
              <Eye className="h-5 w-5" />
              Aperçu de la fiche
            </button>
          </div>
        )}
      </div>
    );
  };

  // Rendre la modal d'aperçu de l'intervention
  const renderPreviewModal = () => {
    if (!showPreviewModal || !currentIntervention) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
        <div className="bg-slate-50 rounded-xl shadow-xl max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
          {/* En-tête */}
          <div className="bg-white border-b border-slate-200 p-6 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-audittab-navy">Aperçu de l'intervention</h2>
                <p className="text-sm text-slate-600 mt-1">
                  {currentIntervention.name || 'Intervention sans nom'}
                </p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XSquare className="h-6 w-6 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6 space-y-6">
            {currentIntervention.operations && currentIntervention.operations.length > 0 ? (
              currentIntervention.operations.map((operation) => (
                <div key={operation.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-audittab-navy mb-1">{operation.name}</h3>
                  {operation.description && (
                    <p className="text-sm text-slate-600 mb-4">{operation.description}</p>
                  )}

                  <div className="space-y-4">
                    {operation.fields.map((field) => {
                      const toolboxItem = allToolboxItems.find(t => t.type === field.type);
                      const Icon = toolboxItem?.icon || Type;

                      return (
                        <div key={field.id} className="border-l-4 border-audittab-green pl-4 pr-4 py-3 rounded-lg bg-slate-50">
                          <div className="flex items-start gap-2 mb-2">
                            <Icon className="h-4 w-4 text-audittab-green mt-0.5" />
                            <label className="block text-sm font-medium text-slate-900">
                              {field.label || 'Champ sans nom'}
                              {field.required && <span className="text-red-600 ml-1">*</span>}
                            </label>
                          </div>
                          {field.description && (
                            <p className="text-xs text-slate-500 mb-2 ml-6">{field.description}</p>
                          )}

                          {/* Aperçu selon le type de champ */}
                          <div className="ml-6">
                            {field.type === 'checkpoint' && (
                              <div className="space-y-2">
                                <div className="flex gap-2 text-xs">
                                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded border border-green-200">✓ Conforme</span>
                                  <span className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded border border-slate-300">− N/A</span>
                                  <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded border border-red-200">✗ Non conforme</span>
                                </div>
                                <div className="relative">
                                  <textarea
                                    placeholder="Commentaire..."
                                    rows={2}
                                    className="w-full px-3 py-1.5 pr-10 text-xs border border-slate-300 rounded bg-white"
                                    disabled
                                  />
                                  <button className="absolute right-2 top-2 p-1 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Mic className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <button className="p-1.5 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Camera className="h-4 w-4" />
                                  </button>
                                  <button className="p-1.5 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Paperclip className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                            {field.type === 'text' && (
                              <div className="space-y-2">
                                <div className="relative">
                                  <input type="text" placeholder="Exemple de texte..." className="w-full px-3 py-1.5 pr-10 text-sm border border-slate-300 rounded bg-white" disabled />
                                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Mic className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <button className="p-1.5 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Camera className="h-4 w-4" />
                                  </button>
                                  <button className="p-1.5 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Paperclip className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                            {field.type === 'textarea' && (
                              <div className="space-y-2">
                                <div className="relative">
                                  <textarea placeholder="Exemple de texte long..." rows={2} className="w-full px-3 py-1.5 pr-10 text-sm border border-slate-300 rounded bg-white" disabled />
                                  <button className="absolute right-2 top-2 p-1 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Mic className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <button className="p-1.5 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Camera className="h-4 w-4" />
                                  </button>
                                  <button className="p-1.5 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Paperclip className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                            {field.type === 'number' && (
                              <div className="space-y-2">
                                <input type="number" placeholder="123" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white" disabled />
                                <div className="flex justify-end gap-2">
                                  <button className="p-1.5 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Camera className="h-4 w-4" />
                                  </button>
                                  <button className="p-1.5 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Paperclip className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                            {field.type === 'rating' && (
                              <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star key={star} className="h-5 w-5 text-slate-300" />
                                ))}
                                <span className="ml-2 text-sm text-slate-500">0/5</span>
                              </div>
                            )}
                            {field.type === 'checkbox' && (
                              <div className="space-y-2">
                                <div className="flex gap-2 text-xs">
                                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded border border-green-200">✓ Oui</span>
                                  <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded border border-red-200">✗ Non</span>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <button className="p-1.5 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Camera className="h-4 w-4" />
                                  </button>
                                  <button className="p-1.5 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Paperclip className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                            {field.type === 'date' && (
                              <div className="space-y-2">
                                <input type="date" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white" disabled />
                                <div className="flex justify-end gap-2">
                                  <button className="p-1.5 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Camera className="h-4 w-4" />
                                  </button>
                                  <button className="p-1.5 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Paperclip className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                            {field.type === 'photo' && (
                              <div className="space-y-2">
                                <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded text-sm" disabled>
                                  📷 Prendre une photo
                                </button>
                              </div>
                            )}
                            {field.type === 'select' && (
                              <div className="space-y-2">
                                <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white" disabled>
                                  <option>Sélectionner...</option>
                                  {(field.options || []).map(opt => (
                                    <option key={opt.id}>{opt.label || 'Option'}</option>
                                  ))}
                                </select>
                                {field.options && field.options.length > 0 && (
                                  <div className="text-xs text-slate-500">
                                    Options : {field.options.map(opt => opt.label).join(', ')}
                                  </div>
                                )}
                                <div className="flex justify-end gap-2">
                                  <button className="p-1.5 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Camera className="h-4 w-4" />
                                  </button>
                                  <button className="p-1.5 text-slate-400 bg-slate-100 rounded" disabled>
                                    <Paperclip className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                <p className="text-slate-500">Aucune opération dans cette intervention</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {isCreating ? renderCreator() : renderInterventionsList()}
      </div>
      {/* Modal d'aperçu */}
      {renderPreviewModal()}
    </div>
  );
}
