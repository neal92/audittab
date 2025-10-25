import { useState, useEffect } from 'react';
import { CheckSquare, XSquare, Minus, Camera, ArrowLeft, Save, Paperclip, Mic, Star, Plus } from 'lucide-react';
import { Intervention, OperationField, Project } from '../../lib/types';
import { v4 as uuidv4 } from 'uuid';

const MOCK_PROJECTS: Project[] = [
  { id: '1', company_id: 'mock-company', name: 'Projet Paris', description: 'Rénovation bureaux', created_at: new Date().toISOString() },
  { id: '2', company_id: 'mock-company', name: 'Projet Lyon', description: 'Construction usine', created_at: new Date().toISOString() },
  { id: '3', company_id: 'mock-company', name: 'Projet Marseille', description: 'Extension entrepôt', created_at: new Date().toISOString() },
];

interface RecordData {
  [operationId: string]: {
    [fieldId: string]: any;
  };
}

interface FieldComments {
  [operationId: string]: {
    [fieldId: string]: string;
  };
}

interface AuditRecord {
  id: string;
  intervention_id: string;
  intervention_name: string;
  project_id?: string;
  project_name?: string;
  created_by: string;
  data: RecordData;
  comments?: FieldComments; // Commentaires pour les checkpoints
  created_at: string;
  completed: boolean;
}

/**
 * Composant pour créer et remplir des fiches basées sur des interventions
 */
export default function RecordCreator() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [formData, setFormData] = useState<RecordData>({});
  const [fieldComments, setFieldComments] = useState<FieldComments>({});
  const [isCreating, setIsCreating] = useState(false);
  const [pendingIntervention, setPendingIntervention] = useState<Intervention | null>(null);
  const [viewingRecord, setViewingRecord] = useState<AuditRecord | null>(null);
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);
  const [recordTitle, setRecordTitle] = useState<string>('');

  // Charger les interventions depuis localStorage
  useEffect(() => {
    const storedInterventions = localStorage.getItem('interventions');
    if (storedInterventions) {
      setInterventions(JSON.parse(storedInterventions));
    }

    const storedRecords = localStorage.getItem('auditRecords');
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
  }, []);

  // Annuler la création
  const cancelCreating = () => {
    setSelectedIntervention(null);
    setSelectedProject('');
    setFormData({});
    setFieldComments({});
    setIsCreating(false);
  };

  // Mettre à jour une valeur de champ
  const updateFieldValue = (operationId: string, fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [operationId]: {
        ...(prev[operationId] || {}),
        [fieldId]: value
      }
    }));
  };

  // Mettre à jour un commentaire de champ
  const updateFieldComment = (operationId: string, fieldId: string, comment: string) => {
    setFieldComments(prev => ({
      ...prev,
      [operationId]: {
        ...(prev[operationId] || {}),
        [fieldId]: comment
      }
    }));
  };

  // Sauvegarder la fiche
  const saveRecord = () => {
    if (!selectedIntervention) return;
    if (!selectedProject) {
      alert('Veuillez sélectionner un projet');
      return;
    }

    const project = MOCK_PROJECTS.find(p => p.id === selectedProject);
    
    // Vérifier s'il y a des non-conformités
    const hasNonConforme = Object.values(formData).some(operationData => 
      Object.values(operationData).some(value => value === 'non_conforme')
    );
    
    const newRecord: AuditRecord = {
      id: uuidv4(),
      intervention_id: selectedIntervention.id,
      intervention_name: selectedIntervention.name,
      project_id: selectedProject,
      project_name: project?.name,
      created_by: 'mock-user',
      data: formData,
      comments: fieldComments,
      created_at: new Date().toISOString(),
      completed: !hasNonConforme,
    };

    const updatedRecords = [newRecord, ...records];
    setRecords(updatedRecords);
    localStorage.setItem('auditRecords', JSON.stringify(updatedRecords));

    alert('Fiche enregistrée avec succès !');
    cancelCreating();
  };

  // Supprimer une fiche
  const deleteRecord = (recordId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette fiche ?')) return;

    const updatedRecords = records.filter(r => r.id !== recordId);
    setRecords(updatedRecords);
    localStorage.setItem('auditRecords', JSON.stringify(updatedRecords));
  };

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
              <h2 className="text-2xl font-bold text-slate-900">{selectedIntervention.name}</h2>
              <p className="text-sm text-slate-600">
                {selectedIntervention.description} • {MOCK_PROJECTS.find(p => p.id === selectedProject)?.name}
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
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{operation.name}</h3>
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
                <h2 className="text-2xl font-bold text-slate-900">{intervention.name}</h2>
                <p className="text-sm text-slate-600">{intervention.description}</p>
                {viewingRecord.project_name && (
                  <p className="text-sm text-audittab-green font-medium mt-1">
                    📁 {viewingRecord.project_name}
                  </p>
                )}
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
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{operation.name}</h3>
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
                                    <Mic className="h-4 w-4 text-slate-400" title="Commentaire audio disponible" />
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Mes fiches</h2>
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
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Fiches récentes</h3>
          <div className="space-y-3">
                {records.map(record => (
                  <div
                    key={record.id}
                    className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => setViewingRecord(record)}
                    >
                      <div>
                        <h4 className="font-medium text-slate-900">{record.intervention_name}</h4>
                        {record.project_name && (
                          <p className="text-sm text-audittab-green font-medium">📁 {record.project_name}</p>
                        )}
                        <p className="text-sm text-slate-500">
                          {new Date(record.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          record.completed 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {record.completed ? 'Conforme' : 'Non conforme'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRecord(record.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <XSquare className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune fiche créée</h3>
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
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Nouvelle fiche
            </h2>
            
            {/* Étape 1: Titre de la fiche */}
            {!pendingIntervention && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Donnez un titre à votre fiche *
                  </label>
                  <input
                    type="text"
                    value={recordTitle}
                    onChange={(e) => setRecordTitle(e.target.value)}
                    placeholder="Ex: Inspection chantier A - 25/10/2025"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-transparent"
                    autoFocus
                  />
                </div>

                {/* Liste des interventions */}
                {recordTitle.trim() && (
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
                              setPendingIntervention(intervention);
                            }}
                            className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 hover:border-audittab-green hover:bg-white transition-all text-left"
                          >
                            <h4 className="font-semibold text-slate-900 mb-1">{intervention.name}</h4>
                            <p className="text-sm text-slate-600 mb-2">{intervention.description}</p>
                            <div className="text-xs text-slate-500">
                              {intervention.operations.length} opération(s)
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowNewRecordModal(false);
                      setRecordTitle('');
                    }}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Étape 2: Sélection du projet */}
            {pendingIntervention && (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-slate-600">Titre de la fiche :</p>
                  <p className="font-semibold text-slate-900">{recordTitle}</p>
                  <p className="text-sm text-slate-600 mt-2">Intervention :</p>
                  <p className="font-medium text-slate-900">{pendingIntervention.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Projet *
                  </label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-transparent"
                  >
                    <option value="">-- Sélectionner un projet --</option>
                    {MOCK_PROJECTS.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name} - {project.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setPendingIntervention(null);
                      setSelectedProject('');
                    }}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    onClick={() => {
                      if (selectedProject && pendingIntervention) {
                        setSelectedIntervention(pendingIntervention);
                        setFormData({});
                        setFieldComments({});
                        setIsCreating(true);
                        setShowNewRecordModal(false);
                        setRecordTitle('');
                        setPendingIntervention(null);
                      }
                    }}
                    disabled={!selectedProject}
                    className="flex-1 px-4 py-2 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-dark transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    Commencer
                  </button>
                </div>
              </div>
            )}
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
