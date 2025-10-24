import { useState, useEffect } from 'react';
import { FormTemplate, AuditRecord, Project } from '../../lib/types';
import { useMockAuth } from '../../contexts/MockAuthContext';
import { v4 as uuidv4 } from 'uuid';
import { MOCK_TEMPLATES, MOCK_PROJECTS, MOCK_RECORDS } from './data';

/**
 * Hook personnalisé pour gérer la logique de création de fiches d'audit
 */
export function useAuditRecordCreator() {
  const { profile } = useMockAuth();
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [showCreator, setShowCreator] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  
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
  
  // Démarrer la création d'une nouvelle fiche
  const startCreating = (template: FormTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    // Pré-sélectionner le projet si défini dans le template
    if (template.project_id) {
      setSelectedProject(template.project_id);
    } else {
      setSelectedProject('');
    }
    // Pré-remplir l'intervention si définie dans le template
    if (template.intervention) {
      setFormData({ 'Intervention': template.intervention });
    }
    setShowCreator(true);
  };

  // Annuler la création
  const cancelCreating = () => {
    setShowCreator(false);
    setSelectedTemplate(null);
    setSelectedProject('');
    setFormData({});
  };

  // Mettre à jour les données du formulaire
  const updateFormData = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Sauvegarder une fiche d'audit
  const saveRecord = () => {
    if (!selectedTemplate || !selectedProject) return;

    try {
      const newRecord: AuditRecord = {
        id: uuidv4(),
        template_id: selectedTemplate.id,
        project_id: selectedProject,
        created_by: profile?.id || 'mock-user-id',
        data: formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedRecords = [newRecord, ...records];
      setRecords(updatedRecords);
      localStorage.setItem('auditRecords', JSON.stringify(updatedRecords));
      
      cancelCreating();
      alert('Fiche d\'audit enregistrée avec succès !');
    } catch (error) {
      console.error('Error saving record:', error);
      alert('Erreur lors de l\'enregistrement de la fiche');
    }
  };
  
  // Supprimer une fiche d'audit
  const deleteRecord = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette fiche d\'audit ?')) {
      try {
        const updatedRecords = records.filter(record => record.id !== id);
        setRecords(updatedRecords);
        localStorage.setItem('auditRecords', JSON.stringify(updatedRecords));
        alert('Fiche d\'audit supprimée avec succès !');
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Erreur lors de la suppression de la fiche');
      }
    }
  };

  return {
    // State
    templates,
    projects,
    records,
    showCreator,
    selectedTemplate,
    selectedProject,
    formData,
    
    // Actions
    startCreating,
    cancelCreating,
    updateFormData,
    setSelectedProject,
    saveRecord,
    deleteRecord,
    setShowCreator,
  };
}
