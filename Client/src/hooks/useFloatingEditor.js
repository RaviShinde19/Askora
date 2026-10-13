import { useState, useEffect, useCallback } from 'react';

export const useFloatingEditor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [savedNotes, setSavedNotes] = useState([]);

  // Load saved notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('floatingEditorNotes');
    if (saved) {
      setSavedNotes(JSON.parse(saved));
    }
  }, []);

  // Save notes to localStorage
  const saveNote = useCallback((content) => {
    const note = {
      id: Date.now(),
      content,
      createdAt: new Date().toISOString(),
      preview: content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
    };
    
    const updatedNotes = [note, ...savedNotes].slice(0, 50); // Keep only last 50 notes
    setSavedNotes(updatedNotes);
    localStorage.setItem('floatingEditorNotes', JSON.stringify(updatedNotes));
  }, [savedNotes]);

  // Open editor at specific position
  const openEditor = useCallback((x, y) => {
    setPosition({ x, y });
    setIsOpen(true);
  }, []);

  // Close editor
  const closeEditor = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Open editor at mouse position
  const openEditorAtMouse = useCallback((event) => {
    const x = Math.min(event.clientX, window.innerWidth - 400);
    const y = Math.min(event.clientY, window.innerHeight - 300);
    openEditor(x, y);
  }, [openEditor]);

  // Global keyboard shortcut (Ctrl/Cmd + Shift + N)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'N') {
        event.preventDefault();
        const x = Math.random() * (window.innerWidth - 400);
        const y = Math.random() * (window.innerHeight - 300);
        openEditor(x, y);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openEditor]);

  return {
    isOpen,
    position,
    savedNotes,
    openEditor,
    closeEditor,
    openEditorAtMouse,
    saveNote
  };
};
