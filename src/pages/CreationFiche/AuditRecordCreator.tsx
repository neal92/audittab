import { CheckSquare, XSquare, Plus, Trash2, Camera, Minus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { CheckpointData } from './data';
import { useAuditRecordCreator } from './hooks';
import { MOCK_PROJECTS } from './data';
import { useState } from 'react';

/**
 * Composant principal pour la création et gestion des fiches d'audit
 * Utilise le hook useAuditRecordCreator pour la logique métier
 */
export default function AuditRecordCreator() {
  const {
    templates,
    projects,
    records,
    showCreator,
    selectedTemplate,
    selectedProject,
    formData,
    startCreating,
    cancelCreating,
    updateFormData,
    setSelectedProject,
    saveRecord,
    deleteRecord,
    setShowCreator,
  } = useAuditRecordCreator();

  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

  const renderTemplateList = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map(template => (
        <div 
          key={template.id} 
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => startCreating(template)}
        >
          <h3 className="text-lg font-semibold text-slate-900">{template.name}</h3>
          <p className="text-sm text-slate-600 mt-1">{template.description}</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
            <span>{template.fields.length} champs</span>
          </div>
        </div>
      ))}

      <div 
        className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => alert('Fonctionnalité en développement')}
      >
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
          <Plus className="h-6 w-6 text-slate-600" />
        </div>
        <h3 className="font-semibold text-slate-700">Créer une structure</h3>
        <p className="text-sm text-slate-500 mt-1">Définir une nouvelle structure de fiche</p>
      </div>
    </div>
  );

  const renderCreator = () => {
    if (!selectedTemplate) return null;
    
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Nouvelle fiche d'audit</h2>
          <button 
            onClick={cancelCreating}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Structure
              </label>
              <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                {selectedTemplate.name}
              </div>
            </div>

            {selectedTemplate.project_id && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  📁 Projet
                </label>
                <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                  {MOCK_PROJECTS.find(p => p.id === selectedTemplate.project_id)?.name || selectedTemplate.project_id}
                </div>
              </div>
            )}

            {selectedTemplate.intervention && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  🔧 Intervention
                </label>
                <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                  {selectedTemplate.intervention}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Opérations */}
        {selectedTemplate.operations && selectedTemplate.operations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Opérations</h3>
            
            <div className="space-y-4">
              {selectedTemplate.operations.map((operation) => (
                <div key={operation.id} className="border border-audittab-green-200 rounded-lg p-4 bg-audittab-green-50">
                  <h4 className="font-semibold text-audittab-navy mb-3">{operation.name}</h4>
                  
                  {operation.checkpoints && operation.checkpoints.length > 0 ? (
                    <div className="space-y-3">
                      {operation.checkpoints.map((checkpoint, checkpointIndex) => {
                        const operationKey = `operation_${operation.id}`;
                        const checkpointData = formData[operationKey]?.[checkpointIndex] || {
                          id: checkpoint.id,
                          label: checkpoint.label,
                          description: checkpoint.description,
                          value: null,
                          notes: ''
                        };
                        const fieldType = checkpoint.type || 'conforme';
                        
                        return (
                          <div key={checkpoint.id} className="bg-white rounded-lg p-3 border border-audittab-green-100">
                            <div className="mb-3">
                              <div className="font-medium text-sm text-slate-800">{checkpoint.label}</div>
                              {checkpoint.description && (
                                <div className="text-xs text-slate-500 mt-1">{checkpoint.description}</div>
                              )}
                            </div>
                            
                            {/* Rendu selon le type de champ */}
                            {fieldType === 'conforme' && (
                              <div className="flex gap-2 mb-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const checkpoints = [...(formData[operationKey] || [])];
                                    if (!checkpoints[checkpointIndex]) {
                                      checkpoints[checkpointIndex] = {
                                        id: checkpoint.id,
                                        label: checkpoint.label,
                                        description: checkpoint.description,
                                        value: 'conforme',
                                        notes: ''
                                      };
                                    } else {
                                      checkpoints[checkpointIndex].value = 'conforme';
                                    }
                                    updateFormData(operationKey, checkpoints);
                                  }}
                                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    checkpointData.value === 'conforme'
                                      ? 'bg-green-600 text-white border-2 border-green-700'
                                      : 'bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-200'
                                  }`}
                                >
                                  <CheckSquare className="h-4 w-4" /> Conforme
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    const checkpoints = [...(formData[operationKey] || [])];
                                    if (!checkpoints[checkpointIndex]) {
                                      checkpoints[checkpointIndex] = {
                                        id: checkpoint.id,
                                        label: checkpoint.label,
                                        description: checkpoint.description,
                                        value: 'non_applicable',
                                        notes: ''
                                      };
                                    } else {
                                      checkpoints[checkpointIndex].value = 'non_applicable';
                                    }
                                    updateFormData(operationKey, checkpoints);
                                  }}
                                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    checkpointData.value === 'non_applicable'
                                      ? 'bg-slate-600 text-white border-2 border-slate-700'
                                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-slate-200'
                                  }`}
                                >
                                  <Minus className="h-4 w-4" /> Non applicable
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    const checkpoints = [...(formData[operationKey] || [])];
                                    if (!checkpoints[checkpointIndex]) {
                                      checkpoints[checkpointIndex] = {
                                        id: checkpoint.id,
                                        label: checkpoint.label,
                                        description: checkpoint.description,
                                        value: 'non_conforme',
                                        notes: ''
                                      };
                                    } else {
                                      checkpoints[checkpointIndex].value = 'non_conforme';
                                    }
                                    updateFormData(operationKey, checkpoints);
                                  }}
                                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    checkpointData.value === 'non_conforme'
                                      ? 'bg-red-600 text-white border-2 border-red-700'
                                      : 'bg-red-100 text-red-700 hover:bg-red-200 border-2 border-red-200'
                                  }`}
                                >
                                  <XSquare className="h-4 w-4" /> Non conforme
                                </button>
                              </div>
                            )}
                            
                            {fieldType === 'text' && (
                              <input
                                type="text"
                                value={checkpointData.value || ''}
                                onChange={(e) => {
                                  const checkpoints = [...(formData[operationKey] || [])];
                                  if (!checkpoints[checkpointIndex]) {
                                    checkpoints[checkpointIndex] = {
                                      id: checkpoint.id,
                                      label: checkpoint.label,
                                      description: checkpoint.description,
                                      value: e.target.value,
                                      notes: ''
                                    };
                                  } else {
                                    checkpoints[checkpointIndex].value = e.target.value;
                                  }
                                  updateFormData(operationKey, checkpoints);
                                }}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                                placeholder="Saisir une valeur..."
                              />
                            )}
                            
                            {fieldType === 'number' && (
                              <input
                                type="number"
                                value={checkpointData.value || ''}
                                onChange={(e) => {
                                  const checkpoints = [...(formData[operationKey] || [])];
                                  if (!checkpoints[checkpointIndex]) {
                                    checkpoints[checkpointIndex] = {
                                      id: checkpoint.id,
                                      label: checkpoint.label,
                                      description: checkpoint.description,
                                      value: e.target.value,
                                      notes: ''
                                    };
                                  } else {
                                    checkpoints[checkpointIndex].value = e.target.value;
                                  }
                                  updateFormData(operationKey, checkpoints);
                                }}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                                placeholder="0"
                              />
                            )}
                            
                            {fieldType === 'select' && (
                              <select
                                value={checkpointData.value || ''}
                                onChange={(e) => {
                                  const checkpoints = [...(formData[operationKey] || [])];
                                  if (!checkpoints[checkpointIndex]) {
                                    checkpoints[checkpointIndex] = {
                                      id: checkpoint.id,
                                      label: checkpoint.label,
                                      description: checkpoint.description,
                                      value: e.target.value,
                                      notes: ''
                                    };
                                  } else {
                                    checkpoints[checkpointIndex].value = e.target.value;
                                  }
                                  updateFormData(operationKey, checkpoints);
                                }}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                              >
                                <option value="">Sélectionner...</option>
                                {checkpoint.options && checkpoint.options.map((option: any) => (
                                  <option key={option.id} value={option.id}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            )}
                            
                            {fieldType === 'checkbox' && (
                              <div className="flex items-center gap-2 mb-3">
                                <input
                                  type="checkbox"
                                  checked={!!checkpointData.value}
                                  onChange={(e) => {
                                    const checkpoints = [...(formData[operationKey] || [])];
                                    if (!checkpoints[checkpointIndex]) {
                                      checkpoints[checkpointIndex] = {
                                        id: checkpoint.id,
                                        label: checkpoint.label,
                                        description: checkpoint.description,
                                        value: e.target.checked,
                                        notes: ''
                                      };
                                    } else {
                                      checkpoints[checkpointIndex].value = e.target.checked;
                                    }
                                    updateFormData(operationKey, checkpoints);
                                  }}
                                  className="h-4 w-4 text-audittab-green rounded focus:ring-2 focus:ring-orange-500"
                                />
                                <span className="text-sm text-slate-600">Cocher si applicable</span>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs text-slate-600">Notes supplémentaires (optionnel)</label>
                                <button
                                  type="button"
                                  className="flex items-center gap-1 px-2 py-1 text-xs text-audittab-green hover:text-audittab-green-700 hover:bg-audittab-green-50 rounded transition-colors"
                                  title="Ajouter une photo"
                                >
                                  <Camera className="h-4 w-4" />
                                  <span>Photo</span>
                                </button>
                              </div>
                              <textarea
                                value={checkpointData.notes || ''}
                                onChange={(e) => {
                                  const checkpoints = [...(formData[operationKey] || [])];
                                  if (!checkpoints[checkpointIndex]) {
                                    checkpoints[checkpointIndex] = {
                                      id: checkpoint.id,
                                      label: checkpoint.label,
                                      description: checkpoint.description,
                                      value: null,
                                      notes: e.target.value
                                    };
                                  } else {
                                    checkpoints[checkpointIndex].notes = e.target.value;
                                  }
                                  updateFormData(operationKey, checkpoints);
                                }}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                                placeholder="Saisir des notes..."
                                rows={2}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 italic">Aucun point de contrôle défini</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTemplate.fields && selectedTemplate.fields.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Informations</h3>
            
            <div className="space-y-6">
              {selectedTemplate.fields.map(field => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === 'checkpoints' ? (
                  <div className="space-y-4">
                    {/* Liste des points de contrôle prédéfinis */}
                    <div className="space-y-3">
                      {field.checkpoints && field.checkpoints.length > 0 ? (
                        field.checkpoints.map((checkpoint: { id: string; label: string; description?: string }, index: number) => {
                          // Récupérer ou créer les données d'évaluation pour ce point de contrôle
                          const checkpointData = formData[field.label]?.[index] || {
                            id: uuidv4(),
                            label: checkpoint.label,
                            description: checkpoint.description,
                            status: null,
                            notes: ''
                          };
                          
                          return (
                            <div key={checkpoint.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                              <div className="mb-3">
                                <h4 className="font-medium text-slate-800">{checkpoint.label}</h4>
                                {checkpoint.description && (
                                  <p className="text-sm text-slate-600 mt-1">{checkpoint.description}</p>
                                )}
                              </div>
                              
                              <div className="flex gap-3 mb-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const checkpoints = [...(formData[field.label] || [])];
                                    if (!checkpoints[index]) {
                                      // Initialiser si nécessaire
                                      checkpoints[index] = {
                                        id: uuidv4(),
                                        label: checkpoint.label,
                                        description: checkpoint.description,
                                        status: 'conforme',
                                        notes: ''
                                      };
                                    } else {
                                      checkpoints[index].status = 'conforme';
                                    }
                                    updateFormData(field.label, checkpoints);
                                  }}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                    checkpointData.status === 'conforme'
                                      ? 'bg-green-100 text-green-800 border border-green-300'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  <CheckSquare className="h-4 w-4" /> Conforme
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    const checkpoints = [...(formData[field.label] || [])];
                                    if (!checkpoints[index]) {
                                      // Initialiser si nécessaire
                                      checkpoints[index] = {
                                        id: uuidv4(),
                                        label: checkpoint.label,
                                        description: checkpoint.description,
                                        status: 'non_conforme',
                                        notes: ''
                                      };
                                    } else {
                                      checkpoints[index].status = 'non_conforme';
                                    }
                                    updateFormData(field.label, checkpoints);
                                  }}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                    checkpointData.status === 'non_conforme'
                                      ? 'bg-red-100 text-red-800 border border-red-300'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  <XSquare className="h-4 w-4" /> Non conforme
                                </button>
                              </div>
                              
                              <div>
                                <textarea
                                  value={checkpointData.notes || ''}
                                  onChange={(e) => {
                                    const checkpoints = [...(formData[field.label] || [])];
                                    if (!checkpoints[index]) {
                                      // Initialiser si nécessaire
                                      checkpoints[index] = {
                                        id: uuidv4(),
                                        label: checkpoint.label,
                                        description: checkpoint.description,
                                        status: null,
                                        notes: e.target.value
                                      };
                                    } else {
                                      checkpoints[index].notes = e.target.value;
                                    }
                                    updateFormData(field.label, checkpoints);
                                  }}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                                  placeholder="Notes supplémentaires (optionnel)"
                                  rows={2}
                                />
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                          <p className="text-slate-500">Aucun point de contrôle défini dans la structure</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : field.type === 'checkbox' ? (
                  <div className="space-y-2">
                    {field.checkboxes && field.checkboxes.length > 0 ? (
                      field.checkboxes.map((checkbox: { id: string; label: string }) => {
                        // Obtenir l'état actuel de cette case
                        const checkboxValues = formData[field.label] || {};
                        
                        return (
                          <div key={checkbox.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`checkbox-${field.id}-${checkbox.id}`}
                              checked={!!checkboxValues[checkbox.id]}
                              onChange={(e) => {
                                const updatedValues = {
                                  ...(formData[field.label] || {}),
                                  [checkbox.id]: e.target.checked
                                };
                                updateFormData(field.label, updatedValues);
                              }}
                              className="h-5 w-5 text-slate-900 rounded focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                            />
                            <label htmlFor={`checkbox-${field.id}-${checkbox.id}`} className="ml-2 text-sm text-slate-700">
                              {checkbox.label}
                            </label>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`checkbox-${field.id}`}
                          checked={!!formData[field.label]}
                          onChange={(e) => updateFormData(field.label, e.target.checked)}
                          className="h-5 w-5 text-slate-900 rounded focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                        <label htmlFor={`checkbox-${field.id}`} className="ml-2 text-sm text-slate-700">
                          {field.label}
                        </label>
                      </div>
                    )}
                  </div>
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.label] || ''}
                    onChange={(e) => updateFormData(field.label, e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required={field.required}
                  >
                    <option value="">Sélectionner...</option>
                    {field.options && field.options.map((option: { id: string; label: string }) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={formData[field.label] || ''}
                    onChange={(e) => updateFormData(field.label, e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required={field.required}
                  />
                )}
              </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={saveRecord}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            disabled={!selectedProject}
          >
            Enregistrer
          </button>
        </div>
      </div>
    );
  };

  const renderRecordsList = () => (
    <div className="space-y-4">
      {records.map(record => {
        const template = templates.find(t => t.id === record.template_id);
        const project = projects.find(p => p.id === record.project_id);
        const isExpanded = expandedRecordId === record.id;

        // Calculer les statistiques pour l'aperçu
        let totalCheckpoints = 0;
        let conformeCount = 0;
        let nonConformeCount = 0;
        let nonApplicableCount = 0;

        if (template?.operations) {
          template.operations.forEach((operation) => {
            const operationKey = `operation_${operation.id}`;
            const operationData = record.data[operationKey];
            if (Array.isArray(operationData)) {
              operationData.forEach((checkpoint: CheckpointData) => {
                totalCheckpoints++;
                if (checkpoint.value === 'conforme') conformeCount++;
                if (checkpoint.value === 'non_conforme') nonConformeCount++;
                if (checkpoint.value === 'non_applicable') nonApplicableCount++;
              });
            }
          });
        }

        return (
          <div key={record.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* En-tête cliquable - Résumé */}
            <div 
              className="bg-slate-50 px-6 py-4 border-b border-slate-200 cursor-pointer"
              onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {template?.name || 'Structure inconnue'}
                  </h3>
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <span className="font-semibold">📁</span>
                      <span>{project?.name || 'Projet inconnu'}</span>
                    </div>
                    {template?.intervention && (
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <span className="font-semibold">🔧</span>
                        <span>{template.intervention}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span>📅</span>
                      <span>{new Date(record.created_at).toLocaleDateString('fr-FR', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                  
                  {/* Statistiques */}
                  {totalCheckpoints > 0 && (
                    <div className="flex items-center gap-3 mt-3">
                      {conformeCount > 0 && (
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                          <span className="font-medium text-green-700">{conformeCount} conforme{conformeCount > 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {nonConformeCount > 0 && (
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                          <span className="font-medium text-red-700">{nonConformeCount} non conforme{nonConformeCount > 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {nonApplicableCount > 0 && (
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className="w-3 h-3 bg-slate-500 rounded-full"></span>
                          <span className="font-medium text-slate-700">{nonApplicableCount} non applicable{nonApplicableCount > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRecord(record.id);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors p-2 rounded"
                    title="Supprimer cette fiche"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <span className="text-slate-400 text-sm">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Contenu détaillé - Affiché uniquement si la fiche est étendue */}
            {isExpanded && (
              <div className="bg-slate-50 p-6">
                {/* Afficher les opérations */}
                {template?.operations && template.operations.length > 0 && (
                  <div className="space-y-4">
                    {template.operations.map((operation) => {
                      const operationKey = `operation_${operation.id}`;
                      const operationData = record.data[operationKey];
                      
                      // Calculer le statut de l'opération
                      let operationStatus: 'conforme' | 'non_conforme' | 'neutral' = 'neutral';
                      if (Array.isArray(operationData) && operationData.length > 0) {
                        const conformiteFields = operationData.filter((c: CheckpointData) => 
                          ['conforme', 'non_conforme', 'non_applicable'].includes(c.value)
                        );
                        
                        if (conformiteFields.length > 0) {
                          const hasNonConforme = conformiteFields.some((c: CheckpointData) => c.value === 'non_conforme');
                          const allConforme = conformiteFields.every((c: CheckpointData) => 
                            c.value === 'conforme' || c.value === 'non_applicable'
                          );
                          
                          if (hasNonConforme) {
                            operationStatus = 'non_conforme';
                          } else if (allConforme && conformiteFields.some((c: CheckpointData) => c.value === 'conforme')) {
                            operationStatus = 'conforme';
                          }
                        }
                      }
                      
                      // Déterminer les classes CSS selon le statut
                      const headerClasses = operationStatus === 'conforme' 
                        ? 'bg-audittab-green' 
                        : operationStatus === 'non_conforme' 
                        ? 'bg-red-500' 
                        : 'bg-slate-600';
                      
                      return (
                        <div key={operation.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                          <div className={`${headerClasses} px-4 py-3 flex items-center justify-between`}>
                            <h5 className="font-semibold text-white text-lg">{operation.name}</h5>
                            {Array.isArray(operationData) && operationData.length > 0 && (() => {
                              // Ne compter que les champs de type conformité
                              const conformiteFields = operationData.filter((c: CheckpointData) => 
                                ['conforme', 'non_conforme', 'non_applicable'].includes(c.value)
                              );
                              const conformeCount = operationData.filter((c: CheckpointData) => c.value === 'conforme').length;
                              
                              return conformiteFields.length > 0 ? (
                                <span className={`text-sm px-3 py-1 rounded-full ${
                                  operationStatus === 'conforme' ? 'text-audittab-green-100 bg-audittab-green-700' :
                                  operationStatus === 'non_conforme' ? 'text-red-100 bg-red-700' :
                                  'text-slate-100 bg-slate-700'
                                }`}>
                                  {conformeCount}/{conformiteFields.length} OK
                                </span>
                              ) : null;
                            })()}
                          </div>
                          <div className="p-5">
                            {Array.isArray(operationData) && operationData.length > 0 ? (
                              <div className="space-y-4">
                                {operationData.map((checkpoint: CheckpointData) => {
                                  // Déterminer le type de champ
                                  const isConformeField = ['conforme', 'non_conforme', 'non_applicable'].includes(checkpoint.value);
                                  const isBooleanField = typeof checkpoint.value === 'boolean';
                                  const isTextField = typeof checkpoint.value === 'string' && !isConformeField;
                                  const isNumberField = typeof checkpoint.value === 'number';
                                  
                                  return (
                                    <div key={checkpoint.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                      {/* En-tête du checkpoint */}
                                      <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex-1">
                                          <h6 className="font-semibold text-slate-900 text-sm mb-1">{checkpoint.label}</h6>
                                          {checkpoint.description && (
                                            <p className="text-xs text-slate-500">{checkpoint.description}</p>
                                          )}
                                        </div>
                                      </div>

                                      {/* Affichage selon le type */}
                                      <div className="flex items-center gap-3">
                                        {/* Type: Conforme/Non conforme/Non applicable */}
                                        {isConformeField && (
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-600 uppercase tracking-wide font-medium">Statut:</span>
                                            <span className={`px-3 py-1.5 rounded-lg font-semibold text-sm ${
                                              checkpoint.value === 'conforme' ? 'bg-green-500 text-white' : 
                                              checkpoint.value === 'non_conforme' ? 'bg-red-500 text-white' : 
                                              'bg-slate-400 text-white'
                                            }`}>
                                              {checkpoint.value === 'conforme' ? '✓ Conforme' : 
                                               checkpoint.value === 'non_conforme' ? '✗ Non conforme' : 
                                               '− Non applicable'}
                                            </span>
                                          </div>
                                        )}

                                        {/* Type: Checkbox */}
                                        {isBooleanField && (
                                          <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1.5 rounded-lg font-semibold text-sm ${
                                              checkpoint.value ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-700'
                                            }`}>
                                              {checkpoint.value ? 'Oui' : 'Non'}
                                            </span>
                                          </div>
                                        )}

                                        {/* Type: Texte */}
                                        {isTextField && (
                                          <div className="flex items-center gap-2 flex-1">
                                            <span className="text-xs text-slate-600 uppercase tracking-wide font-medium">Texte:</span>
                                            <span className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 flex-1">
                                              {checkpoint.value}
                                            </span>
                                          </div>
                                        )}

                                        {/* Type: Nombre */}
                                        {isNumberField && (
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-600 uppercase tracking-wide font-medium">Nombre:</span>
                                            <span className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-900">
                                              {checkpoint.value}
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Notes */}
                                      {checkpoint.notes && (
                                        <div className="mt-3 pt-3 border-t border-slate-300">
                                          <span className="text-xs text-slate-600 uppercase tracking-wide font-medium block mb-1">Note:</span>
                                          <p className="text-sm text-slate-700 italic bg-white p-2 rounded border border-slate-200">
                                            {checkpoint.notes}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-sm text-slate-400 italic text-center py-3">Aucune donnée</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Afficher les autres champs (exclure intervention) */}
                {Object.entries(record.data).some(([key]) => !key.startsWith('operation_') && key !== 'intervention' && key !== 'Intervention') && (
                  <div className="mt-4 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-700 px-4 py-3">
                      <h4 className="font-semibold text-white">Informations supplémentaires</h4>
                    </div>
                    <div className="p-5">
                      <div className="space-y-3">
                        {Object.entries(record.data).map(([key, value]) => {
                          if (key.startsWith('operation_') || key === 'intervention' || key === 'Intervention') return null;
                          
                          return (
                            <div key={key} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                              <span className="text-xs text-slate-600 uppercase tracking-wide font-medium block mb-1">{key}</span>
                              <span className="text-sm text-slate-900 bg-white px-3 py-2 rounded border border-slate-300 block">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );  function setShowBuilder(open: boolean): void {
    setShowCreator(open);
  }

  return (
    <div className="container mx-auto p-6">    
      <div id="main-content" className="transition-all duration-300">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <img 
              src="/logo-audittab.png" 
              alt="AuditTab" 
              className="h-12 w-auto"
              onError={(e) => {
                // Fallback si l'image n'est pas trouvée
                e.currentTarget.style.display = 'none';
              }}
            />
            <h1 className="text-3xl font-bold text-audittab-navy">Fiches d'audits</h1>
          </div>
          {!showCreator && (
            <button 
              onClick={() => setShowCreator(true)} 
              className="flex items-center gap-2 px-4 py-2 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Nouvelle fiche
            </button>
          )}
        </div>

        {showCreator ? (
          selectedTemplate ? renderCreator() : renderTemplateList()
        ) : (
          <>
            {records.length > 0 ? (
              renderRecordsList()
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <div className="bg-slate-50 rounded-xl p-10 text-center">
                  <p className="text-slate-600 mb-4">Aucune fiche d'audit n'a été créée</p>
                  <button
                    onClick={() => setShowBuilder(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-700 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Créer ma première fiche
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
