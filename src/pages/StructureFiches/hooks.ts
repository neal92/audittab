import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormTemplate, Operation, OperationCheckpoint } from '../../lib/types';
import { useMockAuth } from '../../contexts/MockAuthContext';
import { Field, MOCK_TEMPLATES, DEFAULT_FIELDS } from './data';

/**
 * Hook personnalisé pour la gestion des templates de formulaires
 */
export function useFormTemplateBuilder() {
  const { profile } = useMockAuth();
  
  // État des templates
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // État du constructeur
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FormTemplate | null>(null);
  
  // État du formulaire
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateProject, setTemplateProject] = useState('');
  const [templateIntervention, setTemplateIntervention] = useState('');
  const [operations, setOperations] = useState<Operation[]>([]);
  const [fields, setFields] = useState<Field[]>(DEFAULT_FIELDS);
  
  // État du drag & drop
  const [draggedField, setDraggedField] = useState<string | null>(null);

  /**
   * Charge les templates depuis localStorage ou utilise les données mockées
   */
  useEffect(() => {
    loadTemplates();
  }, [profile]);

  const loadTemplates = () => {
    setLoading(true);
    try {
      const storedTemplates = localStorage.getItem('formTemplates');
      
      if (storedTemplates) {
        setTemplates(JSON.parse(storedTemplates));
      } else {
        setTemplates(MOCK_TEMPLATES);
        localStorage.setItem('formTemplates', JSON.stringify(MOCK_TEMPLATES));
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates(MOCK_TEMPLATES);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ajoute un nouveau champ au formulaire
   */
  const addField = () => {
    const newField: Field = {
      id: Date.now().toString(),
      type: 'text',
      label: 'Nouveau champ',
      required: false,
      checkpoints: []
    };
    setFields([...fields, newField]);
  };

  /**
   * Met à jour un champ existant
   */
  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  /**
   * Supprime un champ
   */
  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  /**
   * Gestion du drag & drop
   */
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

  /**
   * Ajoute une nouvelle opération
   */
  const addOperation = () => {
    const newOperation: Operation = {
      id: uuidv4(),
      name: '',
      checkpoints: []
    };
    setOperations([...operations, newOperation]);
  };

  /**
   * Met à jour une opération
   */
  const updateOperation = (id: string, updates: Partial<Operation>) => {
    setOperations(operations.map(op => op.id === id ? { ...op, ...updates } : op));
  };

  /**
   * Supprime une opération
   */
  const removeOperation = (id: string) => {
    setOperations(operations.filter(op => op.id !== id));
  };

  /**
   * Ajoute un point de contrôle à une opération
   */
  const addCheckpointToOperation = (operationId: string) => {
    const newCheckpoint: OperationCheckpoint = {
      id: uuidv4(),
      label: '',
      description: ''
    };
    setOperations(operations.map(op => 
      op.id === operationId 
        ? { ...op, checkpoints: [...op.checkpoints, newCheckpoint] }
        : op
    ));
  };

  /**
   * Supprime un point de contrôle d'une opération
   */
  const removeCheckpointFromOperation = (operationId: string, checkpointId: string) => {
    setOperations(operations.map(op => 
      op.id === operationId 
        ? { ...op, checkpoints: op.checkpoints.filter(cp => cp.id !== checkpointId) }
        : op
    ));
  };

  /**
   * Met à jour un point de contrôle d'une opération
   */
  const updateOperationCheckpoint = (operationId: string, checkpointId: string, updates: Partial<OperationCheckpoint>) => {
    setOperations(operations.map(op => 
      op.id === operationId 
        ? { 
            ...op, 
            checkpoints: op.checkpoints.map(cp => 
              cp.id === checkpointId ? { ...cp, ...updates } : cp
            ) 
          }
        : op
    ));
  };

  /**
   * Sauvegarde le template (création ou mise à jour)
   */
  const saveTemplate = () => {
    if (!templateName) {
      alert('Veuillez saisir un nom pour ce modèle');
      return;
    }

    try {
      let updatedTemplates;

      if (editingTemplate) {
        // Mise à jour
        updatedTemplates = templates.map(t => 
          t.id === editingTemplate.id ? {
            ...t,
            name: templateName,
            description: templateDescription,
            project_id: templateProject || undefined,
            intervention: templateIntervention || undefined,
            operations: operations.length > 0 ? operations : undefined,
            fields: fields,
            updated_at: new Date().toISOString()
          } : t
        );
      } else {
        // Création
        const newTemplate: FormTemplate = {
          id: uuidv4(),
          company_id: profile?.company_id || 'mock-company-id',
          name: templateName,
          description: templateDescription,
          project_id: templateProject || undefined,
          intervention: templateIntervention || undefined,
          operations: operations.length > 0 ? operations : undefined,
          fields: fields,
          created_by: profile?.id || 'mock-user-id',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        updatedTemplates = [newTemplate, ...templates];
      }

      setTemplates(updatedTemplates);
      localStorage.setItem('formTemplates', JSON.stringify(updatedTemplates));
      
      alert('Structure sauvegardée avec succès !');
      resetBuilder();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Erreur lors de la sauvegarde de la structure');
    }
  };

  /**
   * Prépare l'édition d'un template existant
   */
  const editTemplate = (template: FormTemplate) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setTemplateProject(template.project_id || '');
    setTemplateIntervention(template.intervention || '');
    setOperations(template.operations || []);
    setFields(template.fields);
    setShowBuilder(true);
  };

  /**
   * Supprime un template
   */
  const deleteTemplate = (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette structure ?')) return;

    try {
      const updatedTemplates = templates.filter(template => template.id !== id);
      setTemplates(updatedTemplates);
      localStorage.setItem('formTemplates', JSON.stringify(updatedTemplates));
      
      alert('Structure supprimée avec succès !');
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Erreur lors de la suppression de la structure');
    }
  };

  /**
   * Réinitialise le constructeur de formulaire
   */
  const resetBuilder = () => {
    setShowBuilder(false);
    setEditingTemplate(null);
    setTemplateName('');
    setTemplateDescription('');
    setTemplateProject('');
    setTemplateIntervention('');
    setOperations([]);
    setFields(DEFAULT_FIELDS);
  };

  return {
    // État
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
    draggedField,
    profile,
    
    // Setters
    setTemplateName,
    setTemplateDescription,
    setTemplateProject,
    setTemplateIntervention,
    setShowBuilder,
    
    // Actions
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
  };
}
