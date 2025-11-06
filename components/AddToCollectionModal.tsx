import React, { useState, useEffect } from 'react';
import { Collection, DailyWord } from '../types';
import Icon from './Icon';

interface AddToCollectionModalProps {
  word: DailyWord;
  collections: Collection[];
  onClose: () => void;
  onSave: (wordId: string, selectedCollectionIds: string[], newCollectionName?: string) => void;
  content: any;
}

const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({ word, collections, onClose, onSave, content }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    // Pre-select collections that already contain this word
    const initialSelected = collections
      .filter(c => c.wordIds.includes(word.word))
      .map(c => c.id);
    setSelectedIds(initialSelected);
  }, [collections, word]);

  const handleToggleSelection = (collectionId: string) => {
    setSelectedIds(prev =>
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleSave = () => {
    const finalNewCollectionName = isCreatingNew ? newCollectionName.trim() : undefined;
    if (isCreatingNew && !finalNewCollectionName) return;
    onSave(word.word, selectedIds, finalNewCollectionName);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{content.collection_modal_title}</h2>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">{content.collection_modal_word}: <span className="font-semibold text-blue-500">{word.word}</span></p>

        <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
          {collections.map(collection => (
            <label key={collection.id} className="flex items-center p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.includes(collection.id)}
                onChange={() => handleToggleSelection(collection.id)}
                className="w-5 h-5 rounded text-blue-500 bg-gray-200 dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-800 dark:text-zinc-200">{collection.name}</span>
            </label>
          ))}
        </div>

        {isCreatingNew ? (
          <div className="mt-4">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder={content.collection_modal_new_placeholder}
              className="w-full p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg border-2 border-blue-500 focus:outline-none"
              autoFocus
            />
          </div>
        ) : (
          <button onClick={() => setIsCreatingNew(true)} className="w-full text-left mt-4 flex items-center p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
            <Icon name="plus" className="w-5 h-5 text-blue-500 mr-3" />
            <span className="text-blue-500 font-semibold">{content.collection_modal_new}</span>
          </button>
        )}

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 px-4 bg-gray-200 dark:bg-zinc-700 font-semibold rounded-xl transition-colors hover:bg-gray-300 dark:hover:bg-zinc-600">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-3 px-4 bg-blue-500 text-white font-semibold rounded-xl transition-colors hover:bg-blue-600">{content.collection_modal_save}</button>
        </div>
      </div>
    </div>
  );
};

export default AddToCollectionModal;
