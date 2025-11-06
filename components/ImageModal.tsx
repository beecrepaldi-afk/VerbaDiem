import React from 'react';

interface ImageModalProps {
  imageUrl: string;
  word: string;
  translation: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, word, translation, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-2xl p-4 w-full max-w-md m-4 flex flex-col items-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={`Mnemonic for ${word}`}
          className="rounded-lg w-full aspect-square object-cover"
        />
        <div className="text-center mt-4">
          <p className="text-2xl font-bold text-blue-400">{word}</p>
          <p className="text-lg text-zinc-300">{translation}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
