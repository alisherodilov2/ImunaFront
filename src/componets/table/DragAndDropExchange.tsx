import React, { useState } from 'react';

function DragAndDropExchange() {
  const [rows, setRows] = useState([
    { id: 1, content: 'Row 1' },
    { id: 2, content: 'Row 2' },
    { id: 3, content: 'Row 3' },
    // Add more rows as needed
  ]);

  const handleDragStart = (e:any, id:any) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e:any) => {
    e.preventDefault();
  };

  const handleDrop = (e:any, id:any) => {
    e.preventDefault();
    const dragId = e.dataTransfer.getData('text');
    const dragIndex = rows.findIndex(row => row.id === Number(dragId));
    const dropIndex = rows.findIndex(row => row.id === Number(id));
    const newRows = [...rows];
    const [draggedRow] = newRows.splice(dragIndex, 1);
    newRows.splice(dropIndex, 0, draggedRow);
    setRows(newRows);
  };

  return (
    <div>
      <h2>Drag and Drop Table Example</h2>
      <table style={{ borderCollapse: 'collapse', width: '300px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, row.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, row.id)}
              style={{ cursor: 'move' }}
            >
              <td>{row.id}</td>
              <td>{row.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DragAndDropExchange;
