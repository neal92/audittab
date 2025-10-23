import { useState, useEffect } from 'react';
import { Plus, GripVertical, X, Save, Trash2, Edit, FileText } from 'lucide-react';
import { FormTemplate } from '../lib/types';
import { useMockAuth } from '../contexts/MockAuthContext';
import { v4 as uuidv4 } from 'uuid';

// Interface pour un point de contrôle défini dans le template
interface CheckpointItem {
  id: string;
  label: string;
  description: string;
}

// Interface pour une option dans une liste déroulante
interface OptionItem {
  id: string;
  label: string;
}

// Interface pour un élément de case à cocher
interface CheckboxItem {
  id: string;
  label: string;
}

interface Field {
  id: string;
  type: 'text' | 'number' | 'date' | 'select' | 'duration' | 'checkbox' | 'photo' | 'checkpoints';
  label: string;
  required: boolean;
  options?: OptionItem[]; // Liste des options pour les listes déroulantes
  checkboxes?: CheckboxItem[]; // Liste des éléments à cocher pour les cases à cocher
  checkpoints?: CheckpointItem[]; // Liste des points de contrôle prédéfinis pour ce champ
}

const FIELD_TYPES = [
  { value: 'text', label: 'Texte' },
  { value: 'number', label: 'Nombre' },
  { value: 'date', label: 'Date' },
  { value: 'duration', label: 'Durée' },
  { value: 'select', label: 'Liste déroulante' },
  { value: 'checkbox', label: 'Case à cocher' },
  { value: 'photo', label: 'Photo' },
  { value: 'checkpoints', label: 'Points de contrôle' },
];

// Données mockées pour simuler les templates
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

export default function FormTemplateBuilder() {
  const { profile } = useMockAuth();
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FormTemplate | null>(null);

  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [fields, setFields] = useState<Field[]>([
    { id: '1', type: 'text', label: 'Projet', required: true },
    { id: '2', type: 'text', label: 'Intervention', required: true },
    { id: '3', type: 'text', label: 'Activité', required: true },
    { id: '4', type: 'duration', label: 'Durée', required: false },
    { id: '5', type: 'text', label: 'Opération', required: false },
    { id: '6', type: 'checkpoints', label: 'Points de contrôle', required: false },
  ]);

  const [draggedField, setDraggedField] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [profile]);

  const loadTemplates = () => {
    setLoading(true);
    try {
      // Essayer de charger depuis localStorage d'abord
      const storedTemplates = localStorage.getItem('formTemplates');
      
      if (storedTemplates) {
        setTemplates(JSON.parse(storedTemplates));
      } else {
        // Sinon, utiliser les données mockées
        setTemplates(MOCK_TEMPLATES);
        // Et les sauvegarder dans localStorage
        localStorage.setItem('formTemplates', JSON.stringify(MOCK_TEMPLATES));
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      // En cas d'erreur, utiliser les données mockées
      setTemplates(MOCK_TEMPLATES);
    } finally {
      setLoading(false);
    }
  };

  const addField = () => {
    const newField: Field = {
      id: Date.now().toString(),
      type: 'text',
      label: 'Nouveau champ',
      required: false,
      checkpoints: [] // Initialiser un tableau vide pour les points de contrôle
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleDragStart = (id: string) => {
    setDraggedField(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (!draggedField || draggedField === id) return;

    const draggedIndex = fields.findIndex(f => f.id === draggedField);
    const targetIndex = fields.findIndex(f => f.id === id);

    const newFields = [...fields];
    const [removed] = newFields.splice(draggedIndex, 1);
    newFields.splice(targetIndex, 0, removed);

    setFields(newFields);
  };

  const handleDragEnd = () => {
    setDraggedField(null);
  };

    const saveTemplate = () => {
    if (!templateName) {
      alert('Veuillez saisir un nom pour ce modèle');
      return;
    }

    try {
      let updatedTemplates;

      if (editingTemplate) {
        // Mise à jour d'un template existant
        updatedTemplates = templates.map(t => 
          t.id === editingTemplate.id ? {
            ...t,
            name: templateName,
            description: templateDescription,
            fields: fields,
            updated_at: new Date().toISOString()
          } : t
        );
        setTemplates(updatedTemplates);
      } else {
        // Ajout d'un nouveau template
        const newTemplate: FormTemplate = {
          id: uuidv4(),
          company_id: profile?.company_id || 'mock-company-id',
          name: templateName,
          description: templateDescription,
          fields: fields,
          created_by: profile?.id || 'mock-user-id',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        updatedTemplates = [newTemplate, ...templates];
        setTemplates(updatedTemplates);
      }

      // Sauvegarder dans localStorage pour persistance
      localStorage.setItem('formTemplates', JSON.stringify(updatedTemplates));
      
      // Afficher un message de confirmation
      alert('Structure sauvegardée avec succès !');
      
      resetBuilder();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Erreur lors de la sauvegarde de la structure');
    }
  };

  const editTemplate = (template: FormTemplate) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setFields(template.fields);
    setShowBuilder(true);
  };

  const deleteTemplate = (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette structure ?')) return;

    try {
      // Supprimer le template du state local
      const updatedTemplates = templates.filter(template => template.id !== id);
      setTemplates(updatedTemplates);
      
      // Mettre à jour le localStorage
      localStorage.setItem('formTemplates', JSON.stringify(updatedTemplates));
      
      // Afficher un message de confirmation
      alert('Structure supprimée avec succès !');
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Erreur lors de la suppression de la structure');
    }
  };

  const resetBuilder = () => {
    setShowBuilder(false);
    setEditingTemplate(null);
    setTemplateName('');
    setTemplateDescription('');
    setFields([
      { id: '1', type: 'text', label: 'Projet', required: true },
      { id: '2', type: 'text', label: 'Intervention', required: true },
      { id: '3', type: 'text', label: 'Activité', required: true },
      { id: '4', type: 'duration', label: 'Durée', required: false },
      { id: '5', type: 'text', label: 'Opération', required: false },
      { id: '6', type: 'checkpoints', label: 'Points de contrôle', required: false },
    ]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Chargement...</div>
      </div>
    );
  }

  if (showBuilder) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {editingTemplate ? 'Modifier la structure' : 'Nouvelle structure de fiche'}
            </h1>
            <p className="text-slate-600 mt-1">Glissez-déposez les champs pour les réorganiser</p>
          </div>
          <button
            onClick={resetBuilder}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
            Annuler
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Configuration</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nom de la structure
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="Ex: Audit de chantier"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  rows={3}
                  placeholder="Description de cette structure..."
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-900">Champs</h3>
                <button
                  onClick={addField}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={() => handleDragStart(field.id)}
                    onDragOver={(e) => handleDragOver(e, field.id)}
                    onDragEnd={handleDragEnd}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-4 cursor-move hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical className="h-5 w-5 text-slate-400 mt-1 flex-shrink-0" />

                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                          placeholder="Label du champ"
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={field.type}
                            onChange={(e) => updateField(field.id, { type: e.target.value as Field['type'] })}
                            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                          >
                            {FIELD_TYPES.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>

                          <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              className="rounded"
                            />
                            Obligatoire
                          </label>
                        </div>
                        
                        {/* Éditeur de points de contrôle */}
                        {field.type === 'checkpoints' && (
                          <div className="mt-4 border-t border-slate-200 pt-4">
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Points de contrôle</h4>
                            
                            <div className="space-y-3 mb-3">
                              {(field.checkpoints || []).map((checkpoint, index) => (
                                <div key={checkpoint.id} className="bg-white border border-slate-300 rounded p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-slate-500">Point #{index + 1}</span>
                                    <button
                                      onClick={() => {
                                        const currentCheckpoints = [...(field.checkpoints || [])];
                                        currentCheckpoints.splice(index, 1);
                                        updateField(field.id, { checkpoints: currentCheckpoints });
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                  
                                  <input
                                    type="text"
                                    value={checkpoint.label}
                                    onChange={(e) => {
                                      const currentCheckpoints = [...(field.checkpoints || [])];
                                      currentCheckpoints[index] = {
                                        ...currentCheckpoints[index],
                                        label: e.target.value
                                      };
                                      updateField(field.id, { checkpoints: currentCheckpoints });
                                    }}
                                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm mb-2"
                                    placeholder="Nom du point de contrôle"
                                  />
                                  
                                  <textarea
                                    value={checkpoint.description}
                                    onChange={(e) => {
                                      const currentCheckpoints = [...(field.checkpoints || [])];
                                      currentCheckpoints[index] = {
                                        ...currentCheckpoints[index],
                                        description: e.target.value
                                      };
                                      updateField(field.id, { checkpoints: currentCheckpoints });
                                    }}
                                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"
                                    placeholder="Description du point de contrôle"
                                    rows={2}
                                  />
                                </div>
                              ))}
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => {
                                const newCheckpoint = {
                                  id: uuidv4(),
                                  label: "",
                                  description: ""
                                };
                                updateField(field.id, {
                                  checkpoints: [...(field.checkpoints || []), newCheckpoint]
                                });
                              }}
                              className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-sm"
                            >
                              <Plus className="h-3 w-3" />
                              Ajouter un point de contrôle
                            </button>
                          </div>
                        )}
                        
                        {field.type === 'select' && (
                          <div className="mt-3 space-y-3 border-t border-slate-200 pt-3">
                            <div className="text-sm font-medium text-slate-700">Options de la liste</div>
                            
                            <div className="space-y-2">
                              {(field.options || []).map((option, index) => (
                                <div key={option.id} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={option.label}
                                    onChange={(e) => {
                                      const currentOptions = [...(field.options || [])];
                                      currentOptions[index] = {
                                        ...currentOptions[index],
                                        label: e.target.value
                                      };
                                      updateField(field.id, { options: currentOptions });
                                    }}
                                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-sm"
                                    placeholder="Texte de l'option"
                                  />
                                  <button
                                    onClick={() => {
                                      const currentOptions = [...(field.options || [])];
                                      currentOptions.splice(index, 1);
                                      updateField(field.id, { options: currentOptions });
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => {
                                const newOption = {
                                  id: uuidv4(),
                                  label: ""
                                };
                                updateField(field.id, {
                                  options: [...(field.options || []), newOption]
                                });
                              }}
                              className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-sm"
                            >
                              <Plus className="h-3 w-3" />
                              Ajouter une option
                            </button>
                          </div>
                        )}
                        
                        {field.type === 'checkbox' && (
                          <div className="mt-3 space-y-3 border-t border-slate-200 pt-3">
                            <div className="text-sm font-medium text-slate-700">Éléments à cocher</div>
                            
                            <div className="space-y-2">
                              {(field.checkboxes || []).map((checkbox, index) => (
                                <div key={checkbox.id} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={checkbox.label}
                                    onChange={(e) => {
                                      const currentCheckboxes = [...(field.checkboxes || [])];
                                      currentCheckboxes[index] = {
                                        ...currentCheckboxes[index],
                                        label: e.target.value
                                      };
                                      updateField(field.id, { checkboxes: currentCheckboxes });
                                    }}
                                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-sm"
                                    placeholder="Élément à cocher"
                                  />
                                  <button
                                    onClick={() => {
                                      const currentCheckboxes = [...(field.checkboxes || [])];
                                      currentCheckboxes.splice(index, 1);
                                      updateField(field.id, { checkboxes: currentCheckboxes });
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => {
                                const newCheckbox = {
                                  id: uuidv4(),
                                  label: ""
                                };
                                updateField(field.id, {
                                  checkboxes: [...(field.checkboxes || []), newCheckbox]
                                });
                              }}
                              className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-sm"
                            >
                              <Plus className="h-3 w-3" />
                              Ajouter un élément
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => removeField(field.id)}
                        className="text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={saveTemplate}
              disabled={!templateName}
              className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed font-medium"
            >
              <Save className="h-5 w-5" />
              Enregistrer la structure
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Aperçu</h2>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'text' && (
                    <input
                      type="text"
                      disabled
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                      placeholder={field.label}
                    />
                  )}
                  {field.type === 'number' && (
                    <input
                      type="number"
                      disabled
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                      placeholder={field.label}
                    />
                  )}
                  {field.type === 'date' && (
                    <input
                      type="date"
                      disabled
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                    />
                  )}
                  {field.type === 'duration' && (
                    <input
                      type="text"
                      disabled
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                      placeholder="Ex: 2h30"
                    />
                  )}
                  {field.type === 'select' && (
                    <select disabled className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50">
                      <option>Sélectionner...</option>
                      {field.options && field.options.map((option) => (
                        <option key={option.id}>{option.label || 'Option'}</option>
                      ))}
                    </select>
                  )}
                  {field.type === 'checkbox' && (
                    <div className="space-y-2">
                      {field.checkboxes && field.checkboxes.length > 0 ? (
                        field.checkboxes.map((checkbox) => (
                          <div key={checkbox.id} className="flex items-center gap-2">
                            <input type="checkbox" disabled className="rounded" />
                            <span className="text-sm text-slate-600">{checkbox.label || 'Élément à cocher'}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-2">
                          <input type="checkbox" disabled className="rounded" />
                          <span className="text-sm text-slate-600">Élément à cocher</span>
                        </div>
                      )}
                    </div>
                  )}
                  {field.type === 'photo' && (
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50">
                      <div className="text-slate-400">Zone de dépôt photo</div>
                    </div>
                  )}
                  {field.type === 'checkpoints' && (
                    <div className="border border-slate-300 rounded-lg p-4 bg-slate-50 space-y-4">
                      {(field.checkpoints && field.checkpoints.length > 0) ? (
                        field.checkpoints.map((checkpoint, idx) => (
                          <div key={checkpoint.id} className="border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
                            <div className="font-medium text-sm text-slate-700 mb-1">{checkpoint.label || `Point de contrôle ${idx + 1}`}</div>
                            {checkpoint.description && (
                              <div className="text-xs text-slate-500 mb-2">{checkpoint.description}</div>
                            )}
                            <div className="flex gap-2">
                              <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">Conforme</button>
                              <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">Non conforme</button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>
                          <div className="text-sm text-slate-600 mb-2">Point de contrôle 1</div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">Conforme</button>
                            <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">Non conforme</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Structure des fiches</h1>
          <p className="text-slate-600 mt-1">Créez et gérez vos modèles de fiches d'audit</p>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nouvelle structure
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <FileText className="h-8 w-8 text-slate-600" />
              <div className="flex gap-2">
                <button
                  onClick={() => editTemplate(template)}
                  className="text-slate-600 hover:text-slate-800 transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {template.name}
            </h3>

            {template.description && (
              <p className="text-sm text-slate-600 mb-4">
                {template.description}
              </p>
            )}

            <div className="text-sm text-slate-500">
              {template.fields.length} champ{template.fields.length > 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 mb-4">Aucune structure de fiche créée</p>
          <button
            onClick={() => setShowBuilder(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Créer ma première structure
          </button>
        </div>
      )}
    </div>
  );
}
