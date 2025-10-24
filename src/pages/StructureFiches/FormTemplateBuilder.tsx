import { Plus, GripVertical, X, Save, Trash2, Edit, FileText } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useFormTemplateBuilder } from './hooks';
import { FIELD_TYPES, Field } from './data';
import { MOCK_PROJECTS } from '../CreationFiche/data';

/**
 * Composant principal pour la construction de templates de formulaires
 * Utilise le hook useFormTemplateBuilder pour la logique métier
 */
export default function FormTemplateBuilder() {
  const {
    templates,
    loading,
    showBuilder,
    editingTemplate,
    templateName,
    templateDescription,
    templateProject,
    templateIntervention,
    operations,
    fields,
    setTemplateName,
    setTemplateDescription,
    setTemplateProject,
    setTemplateIntervention,
    setShowBuilder,
    addField,
    updateField,
    removeField,
    addOperation,
    updateOperation,
    removeOperation,
    addCheckpointToOperation,
    removeCheckpointFromOperation,
    updateOperationCheckpoint,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    saveTemplate,
    editTemplate,
    deleteTemplate,
    resetBuilder,
  } = useFormTemplateBuilder();

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

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Section 1: Informations de base */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Informations de base</h2>

              <div className="space-y-4">
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
            </div>

            {/* Section 2: Configuration (Projet, Intervention) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Configuration</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Projet (optionnel)
                  </label>
                  <select
                    value={templateProject}
                    onChange={(e) => setTemplateProject(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un projet...</option>
                    {MOCK_PROJECTS.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Si vous sélectionnez un projet, il sera pré-sélectionné lors de la création d'une fiche
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Intervention (optionnel)
                  </label>
                  <input
                    type="text"
                    value={templateIntervention}
                    onChange={(e) => setTemplateIntervention(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="Ex: Visite de chantier"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Si vous renseignez une intervention, elle sera pré-remplie lors de la création d'une fiche
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Opérations */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Opérations</h2>
                  <p className="text-xs text-slate-500 mt-1">Définissez les opérations et leurs points de contrôle spécifiques</p>
                </div>
                <button
                  onClick={addOperation}
                  className="flex items-center gap-2 px-3 py-1.5 bg-audittab-green-100 text-audittab-green-700 rounded-lg hover:bg-audittab-green-200 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une opération
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {operations.map((operation) => (
                  <div key={operation.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={operation.name}
                          onChange={(e) => updateOperation(operation.id, { name: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium"
                          placeholder="Nom de l'opération (ex: Imprimante, Ordinateur...)"
                        />
                      </div>
                      <button
                        onClick={() => removeOperation(operation.id)}
                        className="text-red-600 hover:text-red-800 transition-colors flex-shrink-0 mt-2"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="ml-4 space-y-2">
                      <label className="block text-xs font-medium text-slate-600 mb-2">
                        Points de contrôle pour cette opération
                      </label>
                      {operation.checkpoints.map((checkpoint) => (
                        <div key={checkpoint.id} className="bg-white p-3 rounded border border-slate-200 mb-2">
                          <div className="flex gap-2 items-start mb-2">
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={checkpoint.label}
                                onChange={(e) => updateOperationCheckpoint(operation.id, checkpoint.id, { label: e.target.value })}
                                className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                                placeholder="Nom du point de contrôle (ex: Fonctionnelle)"
                              />
                              <input
                                type="text"
                                value={checkpoint.description || ''}
                                onChange={(e) => updateOperationCheckpoint(operation.id, checkpoint.id, { description: e.target.value })}
                                className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                                placeholder="Description (optionnel)"
                              />
                            </div>
                            <button
                              onClick={() => removeCheckpointFromOperation(operation.id, checkpoint.id)}
                              className="text-red-500 hover:text-red-700 flex-shrink-0 mt-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="border-t border-slate-200 pt-2">
                            <label className="block text-xs font-medium text-slate-600 mb-1">Type de champ</label>
                            <select
                              value={checkpoint.type || 'conforme'}
                              onChange={(e) => updateOperationCheckpoint(operation.id, checkpoint.id, { 
                                type: e.target.value as any,
                                options: e.target.value === 'select' ? (checkpoint.options || []) : undefined
                              })}
                              className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                            >
                              <option value="conforme">Conforme / Non conforme</option>
                              <option value="text">Texte</option>
                              <option value="number">Nombre</option>
                              <option value="select">Liste déroulante</option>
                              <option value="checkbox">Case à cocher</option>
                            </select>
                            
                            {/* Options pour les champs select */}
                            {checkpoint.type === 'select' && (
                              <div className="mt-2 space-y-1">
                                <label className="block text-xs font-medium text-slate-600">Options</label>
                                {(checkpoint.options || []).map((option, optIndex) => (
                                  <div key={option.id} className="flex gap-1">
                                    <input
                                      type="text"
                                      value={option.label}
                                      onChange={(e) => {
                                        const newOptions = [...(checkpoint.options || [])];
                                        newOptions[optIndex] = { ...newOptions[optIndex], label: e.target.value };
                                        updateOperationCheckpoint(operation.id, checkpoint.id, { options: newOptions });
                                      }}
                                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs"
                                      placeholder="Option"
                                    />
                                    <button
                                      onClick={() => {
                                        const newOptions = [...(checkpoint.options || [])];
                                        newOptions.splice(optIndex, 1);
                                        updateOperationCheckpoint(operation.id, checkpoint.id, { options: newOptions });
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => {
                                    const newOptions = [...(checkpoint.options || []), { id: uuidv4(), label: '' }];
                                    updateOperationCheckpoint(operation.id, checkpoint.id, { options: newOptions });
                                  }}
                                  className="w-full px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs hover:bg-slate-200"
                                >
                                  + Ajouter une option
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addCheckpointToOperation(operation.id)}
                        className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-white border border-slate-300 text-slate-600 rounded hover:bg-slate-50 text-xs"
                      >
                        <Plus className="h-3 w-3" />
                        Ajouter un point de contrôle
                      </button>
                    </div>
                  </div>
                ))}
                {operations.length === 0 && (
                  <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <p className="text-slate-500 text-sm">Aucune opération définie</p>
                    <p className="text-slate-400 text-xs mt-1">Les opérations permettent de définir des points de contrôle spécifiques</p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Champs */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Informations supplémentaires</h2>
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
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed font-medium"
            >
              <Save className="h-5 w-5" />
              Enregistrer la structure
            </button>
          </div>

          {/* Colonne de droite - Aperçu */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Aperçu</h2>
            
            {/* En-tête simplifié - seulement projet et intervention sans titre */}
            {(templateProject || templateIntervention) && (
              <div className="mb-4 pb-4 border-b border-slate-200">
                <div className="space-y-1 text-sm">
                  {templateProject && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">📁</span>
                      <span className="text-slate-900">
                        {MOCK_PROJECTS.find(p => p.id === templateProject)?.name || templateProject}
                      </span>
                    </div>
                  )}
                  {templateIntervention && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">🔧</span>
                      <span className="text-slate-900">{templateIntervention}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Opérations - affichées comme des sections dans le corps */}
            {operations.length > 0 && (
              <div className="mb-6 space-y-4">
                <h3 className="font-semibold text-slate-900">Opérations</h3>
                {operations.map((operation) => (
                  <div key={operation.id} className="border border-audittab-green-200 rounded-lg p-4 bg-audittab-green-50">
                    <h4 className="font-semibold text-audittab-navy mb-3">
                      {operation.name || 'Opération sans nom'}
                    </h4>
                    {operation.checkpoints.length > 0 ? (
                      <div className="space-y-3">
                        {operation.checkpoints.map((checkpoint) => {
                          const fieldType = checkpoint.type || 'conforme';
                          return (
                            <div key={checkpoint.id} className="bg-white rounded-lg p-3 border border-audittab-green-100">
                              <div className="mb-2">
                                <div className="font-medium text-sm text-slate-800">{checkpoint.label}</div>
                                {checkpoint.description && (
                                  <div className="text-xs text-slate-500 mt-1">{checkpoint.description}</div>
                                )}
                              </div>
                              
                              {/* Affichage selon le type de champ */}
                              {fieldType === 'conforme' && (
                                <div className="flex gap-2">
                                  <button className="flex-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                    ✓ Conforme
                                  </button>
                                  <button className="flex-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                                    ✗ Non conforme
                                  </button>
                                </div>
                              )}
                              
                              {fieldType === 'text' && (
                                <input
                                  type="text"
                                  disabled
                                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                                  placeholder="Texte..."
                                />
                              )}
                              
                              {fieldType === 'number' && (
                                <input
                                  type="number"
                                  disabled
                                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                                  placeholder="0"
                                />
                              )}
                              
                              {fieldType === 'select' && (
                                <select disabled className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 text-sm">
                                  <option>Sélectionner...</option>
                                  {checkpoint.options && checkpoint.options.map((option) => (
                                    <option key={option.id}>{option.label || 'Option'}</option>
                                  ))}
                                </select>
                              )}
                              
                              {fieldType === 'checkbox' && (
                                <div className="flex items-center gap-2">
                                  <input type="checkbox" disabled className="rounded" />
                                  <span className="text-sm text-slate-600">Cocher si applicable</span>
                                </div>
                              )}
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
            )}

            {/* Champs du formulaire */}
            <div className="space-y-4">
              {fields.length > 0 && (
                <h3 className="font-semibold text-slate-900 mb-2">Informations Supplémentaires</h3>
              )}
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
          <h1 className="text-3xl font-bold text-audittab-navy">Structure des fiches</h1>
          <p className="text-slate-600 mt-1">Créez et gérez vos modèles de fiches d'audits</p>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="flex items-center gap-2 px-4 py-2 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-700 transition-colors"
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
              {(() => {
                const fieldsCount = template.fields.length;
                const checkpointsCount = template.operations?.reduce((total, op) => 
                  total + (op.checkpoints?.length || 0), 0
                ) || 0;
                const totalCount = fieldsCount + checkpointsCount;
                
                return `${totalCount} champ${totalCount > 1 ? 's' : ''}${
                  template.operations && template.operations.length > 0 
                    ? ` (${template.operations.length} opération${template.operations.length > 1 ? 's' : ''})` 
                    : ''
                }`;
              })()}
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Créer ma première structure
          </button>
        </div>
      )}
    </div>
  );
}
