// PrintButton.tsx

import React from 'react';

interface PrintButtonProps {
  onClick: () => void;
}

const PrintButton: React.FC<PrintButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      Print Component
    </button>
  );
};

export default PrintButton;
