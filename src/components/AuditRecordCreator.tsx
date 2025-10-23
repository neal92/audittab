import { useState, useEffect } from 'react';
import { CheckSquare, XSquare, Plus, Trash2, X, Clock } from 'lucide-react';
import { FormTemplate, AuditRecord, Project } from '../lib/types';
import { useMockAuth } from '../contexts/MockAuthContext';
import { v4 as uuidv4 } from 'uuid';

// Interface pour les données de points de contrôle
interface CheckpointData {
  id: string;
  label: string;
  description?: string;
  status: 'conforme' | 'non_conforme' | null;
  notes?: string;
}

// Mock data
const MOCK_TEMPLATES: FormTemplate[] = [
  {
    id: '1',
    company_id: 'mock-company-id',
    name: 'Fiche d\'audit standard',
    description: 'Template standard pour les audits quotidiens',
    fields: [
      { id: '1', type: 'text', label: 'Projet', required: true },
      { id: '2', type: 'text', label: 'Intervention', required: true },
      { id: '3', type: 'text', label: 'Activité', required: true },
      { id: '4', type: 'duration', label: 'Durée', required: false },
      { id: '5', type: 'text', label: 'Opération', required: false },
    ],
    created_by: 'mock-user-id',
    created_at: new Date(2025, 9, 1).toISOString(),
    updated_at: new Date(2025, 9, 1).toISOString(),
  },
  {
    id: '2',
    company_id: 'mock-company-id',
    name: 'Contrôle de sécurité',
    description: 'Template pour les vérifications de sécurité',
    fields: [
      { id: '1', type: 'text', label: 'Site', required: true },
      { id: '2', type: 'checkbox', label: 'EPI présents', required: true },
      { id: '3', type: 'checkpoints', label: 'Points de contrôle', required: true },
    ],
    created_by: 'mock-user-id',
    created_at: new Date(2025, 9, 5).toISOString(),
    updated_at: new Date(2025, 9, 5).toISOString(),
  }
];

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    company_id: 'mock-company-id',
    name: 'Projet Paris',
    description: 'Rénovation bureaux',
    created_at: new Date(2025, 9, 1).toISOString(),
  },
  {
    id: '2',
    company_id: 'mock-company-id',
    name: 'Projet Lyon',
    description: 'Construction usine',
    created_at: new Date(2025, 9, 5).toISOString(),
  }
];

const MOCK_RECORDS: AuditRecord[] = [
  {
    id: '1',
    template_id: '1',
    project_id: '1',
    created_by: 'mock-user-id',
    data: { 
      'Projet': 'Projet Paris',
      'Intervention': 'Visite de site',
      'Activité': 'Contrôle qualité'
    },
    created_at: new Date(2025, 9, 10).toISOString(),
    updated_at: new Date(2025, 9, 10).toISOString()
  }
];

// Composant pour la popup d'alerte des jours d'essai
function TrialReminderPopup({ daysLeft, onClose }: { daysLeft: number, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Période d'essai en cours</h2>
        </div>
        
        <p className="text-gray-600 mb-4">
          Il vous reste <span className="font-semibold text-blue-600">{daysLeft} jours</span> dans votre période d'essai gratuite.
        </p>
        
        {daysLeft <= 5 && (
          <p className="text-red-600 mb-4">
            Votre période d'essai se termine bientôt ! Pour continuer à utiliser toutes les fonctionnalités, passez à un forfait payant.
          </p>
        )}
        
        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800"
          >
            Fermer
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
            onClick={() => {
              alert('Redirection vers la page d\'abonnement');
              onClose();
            }}
          >
            Voir les forfaits
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuditRecordCreator() {
  const { profile, company } = useMockAuth();
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [showCreator, setShowCreator] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showTrialReminder, setShowTrialReminder] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  
  // Vérifier les jours d'essai restants et afficher la popup
  useEffect(() => {
    if (company && company.trial_end_date) {
      const trialEndDate = new Date(company.trial_end_date);
      const today = new Date();
      const differenceInTime = trialEndDate.getTime() - today.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      
      setTrialDaysLeft(differenceInDays);
      
      // Vérifier si on a déjà montré la popup aujourd'hui
      const lastShownDate = localStorage.getItem('trialReminderLastShown');
      const today_str = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
      
      if (!lastShownDate || lastShownDate !== today_str) {
        // N'afficher la popup que si nous n'avons pas déjà affiché aujourd'hui
        setShowTrialReminder(true);
        // Enregistrer la date d'aujourd'hui
        localStorage.setItem('trialReminderLastShown', today_str);
      }
    }
  }, [company]);
  
  // Charger les templates et les records depuis localStorage
  useEffect(() => {
    // Charger les templates
    try {
      const storedTemplates = localStorage.getItem('formTemplates');
      if (storedTemplates) {
        setTemplates(JSON.parse(storedTemplates));
      } else {
        setTemplates(MOCK_TEMPLATES);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates(MOCK_TEMPLATES);
    }
    
    // Charger les records
    try {
      const storedRecords = localStorage.getItem('auditRecords');
      if (storedRecords) {
        setRecords(JSON.parse(storedRecords));
      } else {
        setRecords(MOCK_RECORDS);
        localStorage.setItem('auditRecords', JSON.stringify(MOCK_RECORDS));
      }
    } catch (error) {
      console.error('Error loading records:', error);
      setRecords(MOCK_RECORDS);
    }
  }, []);
  
  const startCreating = (template: FormTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    setShowCreator(true);
  };

  const cancelCreating = () => {
    setShowCreator(false);
    setSelectedTemplate(null);
    setSelectedProject('');
    setFormData({});
  };

  const updateFormData = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const saveRecord = () => {
    if (!selectedTemplate || !selectedProject) return;

    try {
      // Create a new record with mock data
      const newRecord: AuditRecord = {
        id: uuidv4(),
        template_id: selectedTemplate.id,
        project_id: selectedProject,
        created_by: profile?.id || 'mock-user-id',
        data: formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add the new record to our records state
      const updatedRecords = [newRecord, ...records];
      setRecords(updatedRecords);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('auditRecords', JSON.stringify(updatedRecords));
      
      // Reset the form
      cancelCreating();
      
      alert('Fiche d\'audit enregistrée avec succès !');
    } catch (error) {
      console.error('Error saving record:', error);
      alert('Erreur lors de l\'enregistrement de la fiche');
    }
  };
  
  const deleteRecord = (id: string) => {
    // Demander confirmation avant de supprimer
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette fiche d\'audit ?')) {
      try {
        // Filtrer la fiche à supprimer
        const updatedRecords = records.filter(record => record.id !== id);
        
        // Mettre à jour l'état
        setRecords(updatedRecords);
        
        // Sauvegarder dans localStorage
        localStorage.setItem('auditRecords', JSON.stringify(updatedRecords));
        
        alert('Fiche d\'audit supprimée avec succès !');
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Erreur lors de la suppression de la fiche');
      }
    }
  };

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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Projet
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="">Sélectionner un projet</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

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
        
        return (
          <div key={record.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {template?.name || 'Structure inconnue'}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {project?.name || 'Projet inconnu'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-slate-500">
                  {new Date(record.created_at).toLocaleDateString()}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRecord(record.id);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Supprimer cette fiche"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100">
              {Object.entries(record.data).map(([key, value]) => (
                <div key={key} className="mb-3">
                  <span className="font-medium text-slate-700">{key}:</span>
                  
                  {/* Vérifier si la valeur est un tableau de points de contrôle */}
                  {Array.isArray(value) && value.length > 0 && value[0]?.status !== undefined ? (
                    <div className="mt-2 space-y-2 pl-4">
                      {value.map((checkpoint: CheckpointData) => (
                        <div key={checkpoint.id} className="border-l-2 pl-3 py-1">
                          <div className="flex items-center gap-2">
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              checkpoint.status === 'conforme' ? 'bg-green-500' : 
                              checkpoint.status === 'non_conforme' ? 'bg-red-500' : 'bg-gray-300'
                            }`}></span>
                            <span className="font-medium">{checkpoint.label}</span>
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded ${
                              checkpoint.status === 'conforme' ? 'bg-green-100 text-green-800' : 
                              checkpoint.status === 'non_conforme' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {checkpoint.status === 'conforme' ? 'Conforme' : 
                               checkpoint.status === 'non_conforme' ? 'Non conforme' : 'Non vérifié'}
                            </span>
                          </div>
                          {checkpoint.notes && (
                            <p className="text-slate-600 text-sm mt-1">{checkpoint.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-600 ml-2">{String(value)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      {/* Popup de rappel d'essai */}
      {showTrialReminder && (
        <TrialReminderPopup 
          daysLeft={trialDaysLeft} 
          onClose={() => setShowTrialReminder(false)} 
        />
      )}
    
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Fiches d'audit</h1>
        {!showCreator && (
          <button 
            onClick={() => setShowCreator(true)} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nouvelle fiche
          </button>
        )}
      </div>

      {showCreator ? (
        selectedTemplate ? renderCreator() : renderTemplateList()
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Fiches récentes</h2>
            {records.length > 0 ? renderRecordsList() : (
              <div className="bg-slate-50 rounded-xl p-10 text-center">
                <p className="text-slate-600">Aucune fiche d'audit n'a été créée</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}