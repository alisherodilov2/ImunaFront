// PrintableComponent.tsx

import React from 'react';

interface PrintableComponentProps {
  content: string; // Example content to print
}

const PrintableComponent: React.FC<PrintableComponentProps> = ({ content }) => {
  return (
    <div>
      <h1>Printable Component</h1>
      <p>{content}</p>
    </div>
  );
};

export default PrintableComponent;
