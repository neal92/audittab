import { CheckSquare, XSquare, Minus, Camera, ArrowLeft, Save, Paperclip, Mic, Star, Plus, Trash, Copy } from 'lucide-react';
import { OperationField } from '../../lib/types';
import { useRecordCreator } from './hooks';

/**
 * Composant pour créer et remplir des fiches basées sur des interventions
 */
export default function RecordCreator() {
  const {
    interventions,
    records,
    selectedIntervention,
    formData,
    fieldComments,
    isCreating,
    viewingRecord,
    showNewRecordModal,
    editingRecordId,
    setSelectedIntervention,
    setSelectedProject,
    setFormData,
    setFieldComments,
    setIsCreating,
    setViewingRecord,
    setShowNewRecordModal,
    setEditingRecordId,
    setConclusion,
    setNonConformites,
    setSignature,
    cancelCreating,
    updateFieldValue,
    updateFieldComment,
    saveRecord,
    deleteRecord,
    duplicateRecord,
  } = useRecordCreator();

  // Rendre un champ selon son type
  const renderField = (field: OperationField, operationId: string) => {
    const value = formData[operationId]?.[field.id];

    const renderFieldActions = () => (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => alert('Ajouter une photo - Fonctionnalité à venir')}
          className="p-2 text-slate-500 hover:text-audittab-green hover:bg-slate-100 rounded-lg transition-colors"
          title="Ajouter une photo"
        >
          <Camera className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => alert('Ajouter une pièce jointe - Fonctionnalité à venir')}
          className="p-2 text-slate-500 hover:text-audittab-green hover:bg-slate-100 rounded-lg transition-colors"
          title="Ajouter une pièce jointe"
        >
          <Paperclip className="h-5 w-5" />
        </button>
      </div>
    );

    switch (field.type) {
      case 'checkpoint':
        const commentValue = fieldComments[operationId]?.[field.id] || '';
        
        return (
          <div className={`space-y-3 p-4 rounded-lg transition-colors ${
            value === 'non_conforme' ? 'bg-red-50 border-2 border-red-200' : ''
          }`}>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateFieldValue(operationId, field.id, 'conforme')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  value === 'conforme'
                    ? 'bg-green-600 text-white border-2 border-green-700'
                    : 'bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-200'
                }`}
              >
                <CheckSquare className="h-5 w-5" /> Conforme
              </button>
              
              <button
                type="button"
                onClick={() => updateFieldValue(operationId, field.id, 'non_applicable')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  value === 'non_applicable'
                    ? 'bg-slate-600 text-white border-2 border-slate-700'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-2 border-slate-200'
                }`}
              >
                <Minus className="h-5 w-5" /> Non applicable
              </button>
              
              <button
                type="button"
                onClick={() => updateFieldValue(operationId, field.id, 'non_conforme')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  value === 'non_conforme'
                    ? 'bg-red-600 text-white border-2 border-red-700'
                    : 'bg-red-50 text-red-700 hover:bg-red-100 border-2 border-red-200'
                }`}
              >
                <XSquare className="h-5 w-5" /> Non conforme
              </button>
            </div>
            
            {/* Champ texte qui apparaît après sélection */}
            {value && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Commentaire :
                </label>
                <div className="relative">
                  <textarea
                    value={commentValue}
                    onChange={(e) => updateFieldComment(operationId, field.id, e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    rows={3}
                    className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-transparent resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => alert('Enregistrement audio - Fonctionnalité à venir')}
                    className="absolute right-2 top-2 p-1.5 text-slate-500 hover:text-audittab-green hover:bg-slate-100 rounded-lg transition-colors"
                    title="Enregistrement audio"
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              {renderFieldActions()}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="flex items-start gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={value || ''}
                onChange={(e) => updateFieldValue(operationId, field.id, e.target.value)}
                placeholder="Saisir le texte..."
                className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => alert('Enregistrement audio - Fonctionnalité à venir')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-audittab-green hover:bg-slate-100 rounded-lg transition-colors"
                title="Enregistrement audio"
              >
                <Mic className="h-5 w-5" />
              </button>
            </div>
            {renderFieldActions()}
          </div>
        );

      case 'textarea':
        return (
          <div className="flex items-start gap-2">
            <div className="relative flex-1">
              <textarea
                value={value || ''}
                onChange={(e) => updateFieldValue(operationId, field.id, e.target.value)}
                placeholder="Saisir le texte..."
                rows={4}
                className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => alert('Enregistrement audio - Fonctionnalité à venir')}
                className="absolute right-2 top-2 p-1.5 text-slate-500 hover:text-audittab-green hover:bg-slate-100 rounded-lg transition-colors"
                title="Enregistrement audio"
              >
                <Mic className="h-5 w-5" />
              </button>
            </div>
            {renderFieldActions()}
          </div>
        );

      case 'number':
        return (
          <div className="flex items-start gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                value={value || ''}
                onChange={(e) => updateFieldValue(operationId, field.id, e.target.value)}
                placeholder="Saisir un nombre..."
                className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => alert('Enregistrement audio - Fonctionnalité à venir')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-audittab-green hover:bg-slate-100 rounded-lg transition-colors"
                title="Enregistrement audio"
              >
                <Mic className="h-5 w-5" />
              </button>
            </div>
            {renderFieldActions()}
          </div>
        );

      case 'rating':
        return (
          <div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => updateFieldValue(operationId, field.id, rating)}
                    className="transition-all"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        rating <= (value || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300 hover:text-yellow-300'
                      }`}
                    />
                  </button>
                ))}
                {value && (
                  <span className="ml-2 text-sm text-slate-600 self-center">
                    {value}/5
                  </span>
                )}
              </div>
              {renderFieldActions()}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-start gap-2">
            <div className="flex gap-2 flex-1">
              <button
                type="button"
                onClick={() => updateFieldValue(operationId, field.id, true)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  value === true
                    ? 'bg-green-600 text-white border-2 border-green-700'
                    : 'bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-200'
                }`}
              >
                ✓ Oui
              </button>
              
              <button
                type="button"
                onClick={() => updateFieldValue(operationId, field.id, false)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  value === false
                    ? 'bg-red-600 text-white border-2 border-red-700'
                    : 'bg-red-50 text-red-700 hover:bg-red-100 border-2 border-red-200'
                }`}
              >
                ✗ Non
              </button>
            </div>
            {renderFieldActions()}
          </div>
        );

      case 'date':
        return (
          <div className="flex items-start gap-2">
            <div className="relative flex-1">
              <input
                type="date"
                value={value || ''}
                onChange={(e) => updateFieldValue(operationId, field.id, e.target.value)}
                className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => alert('Enregistrement audio - Fonctionnalité à venir')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-audittab-green hover:bg-slate-100 rounded-lg transition-colors"
                title="Enregistrement audio"
              >
                <Mic className="h-5 w-5" />
              </button>
            </div>
            {renderFieldActions()}
          </div>
        );

      case 'photo':
        return (
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  // Simuler la prise de photo
                  alert('Fonctionnalité photo à venir...');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                <Camera className="h-5 w-5" />
                Prendre une photo
              </button>
              {value && (
                <div className="text-sm text-slate-600">
                  Photo enregistrée ✓
                </div>
              )}
            </div>
            {renderFieldActions()}
          </div>
        );

      case 'select':
        return (
          <div className="flex items-start gap-2">
            <select
              value={value || ''}
              onChange={(e) => updateFieldValue(operationId, field.id, e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-transparent"
            >
              <option value="">Sélectionner...</option>
              {field.options?.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            {renderFieldActions()}
          </div>
        );

      default:
        return <div className="text-sm text-slate-500">Type de champ non supporté</div>;
    }
  };

  // Rendre le formulaire de création
  const renderCreator = () => {
    if (!selectedIntervention) return null;

    return (
      <div className="space-y-6">
        {/* En-tête simplifié */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={cancelCreating}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-audittab-navy">{(() => {
                const existingRecordsCount = records.filter(record => record.intervention_id === selectedIntervention.id).length;
                const currentNumber = existingRecordsCount + 1;
                const formattedNumber = currentNumber.toString().padStart(3, '0');
                return `${selectedIntervention.name} - ProjetParis - ${formattedNumber}`;
              })()}</h2>
              <p className="text-sm text-slate-600">
              </p>
            </div>
          </div>
          <button
            onClick={saveRecord}
            className="flex items-center gap-2 px-6 py-2 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-dark transition-colors"
          >
            <Save className="h-5 w-5" />
            Enregistrer
          </button>
        </div>

        {/* Opérations et champs */}
        <div className="space-y-6">
          {selectedIntervention.operations.map((operation) => (
            <div key={operation.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-audittab-navy mb-1">{operation.name}</h3>
              {operation.description && (
                <p className="text-sm text-slate-600 mb-4">{operation.description}</p>
              )}

              <div className="space-y-4">
                {operation.fields.map((field) => {
                  const fieldValue = formData[operation.id]?.[field.id];
                  const isNonConforme = field.type === 'checkpoint' && fieldValue === 'non_conforme';
                  
                  return (
                    <div 
                      key={field.id} 
                      className={`border-l-4 pl-4 pr-4 py-3 rounded-lg bg-slate-50 ${
                        isNonConforme ? 'border-red-600' : 'border-audittab-green'
                      }`}
                    >
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-slate-900">
                          {field.label}
                          {field.required && <span className="text-red-600 ml-1">*</span>}
                        </label>
                        {field.description && (
                          <p className="text-xs text-slate-500 mt-1">{field.description}</p>
                        )}
                      </div>
                      {renderField(field, operation.id)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Rendre le visualiseur de fiche
  const renderRecordViewer = () => {
    if (!viewingRecord) return null;

    const intervention = interventions.find(i => i.id === viewingRecord.intervention_id);
    if (!intervention) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
        <div className="bg-slate-50 rounded-xl shadow-xl max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
          {/* En-tête */}
          <div className="bg-white border-b border-slate-200 p-6 sticky top-0 z-10">
            <div className="flex justify-between items-center">

              <div>
                <h2 className="text-2xl font-bold text-audittab-navy">{(() => {
                  const interventionRecords = records.filter(r => r.intervention_id === viewingRecord.intervention_id);
                  const recordIndex = interventionRecords.findIndex(r => r.id === viewingRecord.id) + 1;
                  const formattedNumber = recordIndex.toString().padStart(3, '0');
                  return `${intervention.name}_ProjetParis_${formattedNumber}`;
                  })()}
                </h2>

                <p className="text-xs text-slate-500 mt-2">
                  Créée le {new Date(viewingRecord.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>

              </div>

              <button
                onClick={() => setViewingRecord(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XSquare className="h-6 w-6 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6 space-y-6">
            {intervention.operations.map((operation) => (
              <div key={operation.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-audittab-navy mb-1">{operation.name}</h3>
                {operation.description && (
                  <p className="text-sm text-slate-600 mb-4">{operation.description}</p>
                )}

                <div className="space-y-4">
                  {operation.fields.map((field) => {
                    const value = viewingRecord.data[operation.id]?.[field.id];
                    const comment = viewingRecord.comments?.[operation.id]?.[field.id];
                    const isNonConforme = field.type === 'checkpoint' && value === 'non_conforme';
                    
                    return (
                      <div 
                        key={field.id} 
                        className={`border-l-4 pl-4 pr-4 py-3 rounded-lg bg-slate-50 ${
                          isNonConforme ? 'border-red-600' : 'border-audittab-green'
                        }`}
                      >
                        <label className="block text-sm font-medium text-slate-900 mb-2">
                          {field.label}
                          {field.required && <span className="text-red-600 ml-1">*</span>}
                        </label>
                        {field.description && (
                          <p className="text-xs text-slate-500 mb-2">{field.description}</p>
                        )}
                        
                        {/* Affichage de la valeur selon le type */}
                        <div className="bg-white rounded-lg p-3 text-sm text-slate-900">
                          {field.type === 'checkpoint' && (
                            <div className="space-y-2">
                              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium ${
                                value === 'conforme' ? 'bg-green-100 text-green-700' :
                                value === 'non_conforme' ? 'bg-red-100 text-red-700' :
                                value === 'non_applicable' ? 'bg-slate-100 text-slate-700' :
                                'text-slate-400'
                              }`}>
                                {value === 'conforme' && <><CheckSquare className="h-4 w-4" /> Conforme</>}
                                {value === 'non_conforme' && <><XSquare className="h-4 w-4" /> Non conforme</>}
                                {value === 'non_applicable' && <><Minus className="h-4 w-4" /> Non applicable</>}
                                {!value && 'Non renseigné'}
                              </span>
                              {comment && (
                                <div className="mt-2 pt-2 border-t border-slate-200">
                                  <p className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                                    Commentaire :
                                    <Mic className="h-4 w-4 text-slate-400" />
                                  </p>
                                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{comment}</p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {field.type === 'rating' && (
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                  key={star}
                                  className={`h-5 w-5 ${star <= (value || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                                />
                              ))}
                              <span className="ml-2 text-slate-600">({value || 0}/5)</span>
                            </div>
                          )}
                          
                          {field.type === 'checkbox' && (
                            <span className={value ? 'text-green-600 font-medium' : 'text-slate-400'}>
                              {value ? '✓ Oui' : 'Non'}
                            </span>
                          )}
                          
                          {field.type === 'select' && (
                            <span>{field.options?.find(opt => opt.id === value)?.label || value || 'Non renseigné'}</span>
                          )}
                          
                          {field.type === 'photo' && (
                            <span className={value ? 'text-audittab-green font-medium' : 'text-slate-400'}>
                              {value ? '📷 Photo enregistrée' : 'Aucune photo'}
                            </span>
                          )}
                          
                          {['text', 'textarea', 'number', 'date'].includes(field.type) && (
                            <span className={value ? '' : 'text-slate-400'}>
                              {value || 'Non renseigné'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Rendre la liste des interventions disponibles
  const renderInterventionsList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-audittab-navy mb-2">Mes fiches</h2>
          <p className="text-slate-600">Créez et gérez vos fiches d'intervention</p>
        </div>
        <button
          onClick={() => setShowNewRecordModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-dark transition-colors"
        >
          <Plus className="h-5 w-5" />
          Ajouter une fiche
        </button>
      </div>

      {/* Liste des fiches créées */}
      {records.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold text-audittab-navy mb-4">Fiches récentes</h3>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Projet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date de création</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {records.map(record => (
                  <tr key={record.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => {
                    if (!record.completed) {
                      // Ouvrir l'édition pour les fiches "À sauvegarder"
                      const intervention = interventions.find(i => i.id === record.intervention_id);
                      if (intervention) {
                        setSelectedIntervention(intervention);
                        setSelectedProject(record.project_id || '1');
                        setFormData(record.data);
                        setFieldComments(record.comments || {});
                        setConclusion(record.conclusion || '');
                        setNonConformites(record.nonConformites || '');
                        setSignature(record.signature || '');
                        setEditingRecordId(record.id);
                        setIsCreating(true);
                      }
                    } else {
                      // Ouvrir la visualisation pour les fiches complètes
                      setViewingRecord(record);
                    }
                  }}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{(() => {
                      const interventionRecords = records.filter(r => r.intervention_id === record.intervention_id);
                      const recordIndex = interventionRecords.findIndex(r => r.id === record.id) + 1;
                      const formattedNumber = recordIndex.toString().padStart(3, '0');
                      return `${record.intervention_name}_ProjetParis_${formattedNumber}`;
                    })()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{record.project_name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(record.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        record.completed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {record.completed ? 'Conforme' : 'À sauvegarder'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateRecord(record);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Dupliquer cette fiche"
                        >
                          <Copy className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRecord(record.id);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer cette fiche"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-audittab-navy mb-2">Aucune fiche créée</h3>
              <p className="text-slate-600 mb-6">Cliquez sur "Ajouter une fiche" pour commencer</p>
            </div>
          )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Modal de création de fiche */}
      {showNewRecordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-audittab-navy mb-6">
              Nouvelle fiche
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3">
                  Sélectionnez une intervention
                </label>
                {interventions.length === 0 ? (
                  <div className="bg-slate-50 rounded-lg p-6 text-center">
                    <p className="text-slate-600">Aucune intervention disponible</p>
                    <p className="text-sm text-slate-500 mt-2">Créez d'abord une intervention dans l'onglet "Mes interventions"</p>
                  </div>
                ) : (
                  <div className="grid gap-3 max-h-96 overflow-y-auto">
                    {interventions.map(intervention => (
                      <button
                        key={intervention.id}
                        onClick={() => {
                          setSelectedIntervention(intervention);
                          setSelectedProject('1'); // ID du projet Paris
                          setFormData({});
                          setFieldComments({});
                          setIsCreating(true);
                          setShowNewRecordModal(false);
                        }}
                        className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 hover:border-audittab-green hover:bg-white transition-all text-left"
                      >
                        <h4 className="font-semibold text-slate-900 mb-1">{intervention.name}</h4>
                        <div className="text-xs text-slate-500">
                          {intervention.operations.length} opération(s)
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowNewRecordModal(false);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation d'une fiche */}
      {viewingRecord && renderRecordViewer()}

      <div className="max-w-7xl mx-auto">
        {isCreating ? renderCreator() : renderInterventionsList()}
      </div>
    </div>
  );
}
