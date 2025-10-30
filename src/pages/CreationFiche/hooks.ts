import { useState, useEffect } from 'react';
import { Intervention } from '../../lib/types';
import { v4 as uuidv4 } from 'uuid';
import { MOCK_PROJECTS, RecordData, FieldComments, AuditRecord } from './data';

/**
 * Hook personnalisé pour gérer la logique de création et gestion des fiches d'audit
 */
export function useRecordCreator() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [formData, setFormData] = useState<RecordData>({});
  const [fieldComments, setFieldComments] = useState<FieldComments>({});
  const [isCreating, setIsCreating] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<AuditRecord | null>(null);
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  // États pour le système multi-étapes
  const [currentStep, setCurrentStep] = useState(1);
  const [conclusion, setConclusion] = useState('');
  const [nonConformites, setNonConformites] = useState('');
  const [signature, setSignature] = useState('');

  // Charger les interventions depuis localStorage
  useEffect(() => {
    const storedInterventions = localStorage.getItem('interventions');
    if (storedInterventions) {
      setInterventions(JSON.parse(storedInterventions));
    }

    const storedRecords = localStorage.getItem('auditRecords');
    if (storedRecords) {
      const parsedRecords = JSON.parse(storedRecords);
      // Migration pour ajouter les nouveaux champs aux anciens records
      const migratedRecords = parsedRecords.map((record: any) => ({
        ...record,
        updated_at: record.updated_at || record.created_at,
        completed_at: record.completed_at || (record.completed ? record.created_at : undefined),
      }));
      setRecords(migratedRecords);
    }
  }, []);

  // Annuler la création
  const cancelCreating = () => {
    setSelectedIntervention(null);
    setSelectedProject('');
    setFormData({});
    setFieldComments({});
    setIsCreating(false);
    setEditingRecordId(null);
    setCurrentStep(1);
    setConclusion('');
    setNonConformites('');
    setSignature('');
  };

  // Passer à l'étape suivante
  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  // Revenir à l'étape précédente
  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
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

    if (editingRecordId) {
      // Mettre à jour la fiche existante
      const existingRecord = records.find(r => r.id === editingRecordId);
      const wasCompleted = existingRecord?.completed || false;
      
      const updatedRecords = records.map(record =>
        record.id === editingRecordId
          ? {
              ...record,
              data: formData,
              comments: fieldComments,
              conclusion,
              nonConformites,
              signature,
              updated_at: new Date().toISOString(),
              completed: true, // Toujours marquer comme validé lors de la validation
              completed_at: !wasCompleted ? new Date().toISOString() : record.completed_at,
            }
          : record
      );
      setRecords(updatedRecords);
      localStorage.setItem('auditRecords', JSON.stringify(updatedRecords));
    } else {
      // Créer une nouvelle fiche
      const newRecord: AuditRecord = {
        id: uuidv4(),
        intervention_id: selectedIntervention.id,
        intervention_name: selectedIntervention.name,
        project_id: selectedProject,
        project_name: project?.name,
        created_by: 'mock-user',
        data: formData,
        comments: fieldComments,
        conclusion,
        nonConformites,
        signature,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed: true, // Toujours marquer comme validé lors de la validation
        completed_at: new Date().toISOString(),
      };

      const updatedRecords = [newRecord, ...records];
      setRecords(updatedRecords);
      localStorage.setItem('auditRecords', JSON.stringify(updatedRecords));
    }

    alert('Fiche enregistrée avec succès !');
    cancelCreating();
  };

  // Sauvegarder en brouillon (sans marquer comme complète)
  const saveDraft = () => {
    if (!selectedIntervention) return;
    if (!selectedProject) {
      alert('Veuillez sélectionner un projet');
      return;
    }

    const project = MOCK_PROJECTS.find(p => p.id === selectedProject);

    if (editingRecordId) {
      // Mettre à jour la fiche existante en brouillon
      const existingRecord = records.find(r => r.id === editingRecordId);
      const wasCompleted = existingRecord?.completed || false;
      
      const updatedRecords = records.map(record =>
        record.id === editingRecordId
          ? {
              ...record,
              data: formData,
              comments: fieldComments,
              conclusion,
              nonConformites,
              signature,
              updated_at: new Date().toISOString(),
              completed: false, // Toujours en brouillon
              completed_at: wasCompleted ? record.completed_at : undefined, // Garder la date si elle était déjà complète
            }
          : record
      );
      setRecords(updatedRecords);
      localStorage.setItem('auditRecords', JSON.stringify(updatedRecords));
    } else {
      // Créer une nouvelle fiche en brouillon
      const newRecord: AuditRecord = {
        id: uuidv4(),
        intervention_id: selectedIntervention.id,
        intervention_name: selectedIntervention.name,
        project_id: selectedProject,
        project_name: project?.name,
        created_by: 'mock-user',
        data: formData,
        comments: fieldComments,
        conclusion,
        nonConformites,
        signature,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed: false, // Brouillon
        completed_at: undefined,
      };

      const updatedRecords = [newRecord, ...records];
      setRecords(updatedRecords);
      localStorage.setItem('auditRecords', JSON.stringify(updatedRecords));
    }

    alert('Brouillon sauvegardé avec succès !');
    cancelCreating();
  };

  // Supprimer une fiche
  const deleteRecord = (recordId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette fiche ?')) return;

    const updatedRecords = records.filter(r => r.id !== recordId);
    setRecords(updatedRecords);
    localStorage.setItem('auditRecords', JSON.stringify(updatedRecords));
  };

  // Dupliquer une intervention
  const duplicateIntervention = (intervention: Intervention) => {
    const duplicatedIntervention: Intervention = {
      ...intervention,
      id: uuidv4(),
      name: `${intervention.name} (Copie)`
    };
    const updatedInterventions = [...interventions, duplicatedIntervention];
    setInterventions(updatedInterventions);
    localStorage.setItem('interventions', JSON.stringify(updatedInterventions));
  };

  // Dupliquer une fiche
  const duplicateRecord = (record: AuditRecord) => {
    const duplicatedRecord: AuditRecord = {
      ...record,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      completed: false, // La fiche dupliquée aura le statut "À sauvegarder"
    };
    const updatedRecords = [...records, duplicatedRecord];
    setRecords(updatedRecords);
    localStorage.setItem('auditRecords', JSON.stringify(updatedRecords));
  };

  return {
    // State
    interventions,
    records,
    selectedIntervention,
    selectedProject,
    formData,
    fieldComments,
    isCreating,
    viewingRecord,
    showNewRecordModal,
    editingRecordId,
    currentStep,
    conclusion,
    nonConformites,
    signature,

    // Setters
    setInterventions,
    setRecords,
    setSelectedIntervention,
    setSelectedProject,
    setFormData,
    setFieldComments,
    setIsCreating,
    setViewingRecord,
    setShowNewRecordModal,
    setEditingRecordId,
    setCurrentStep,
    setConclusion,
    setNonConformites,
    setSignature,

    // Methods
    cancelCreating,
    updateFieldValue,
    updateFieldComment,
    saveRecord,
    saveDraft,
    deleteRecord,
    duplicateIntervention,
    duplicateRecord,
    handleNextStep,
    handlePreviousStep,
  };
}