import React from 'react';

// Interfaz para las propiedades del componente
interface DroppableTableHeadersProps {
  children: React.ReactNode;
}

// Componente que actuará como contenedor para las cabeceras de tabla con drag and drop
const DroppableTableHeaders: React.FC<DroppableTableHeadersProps> = ({ children }) => {
  return (
    <thead className="text-[10px] sm:text-xs md:text-sm uppercase sticky top-0 z-30">
      {children}
    </thead>
  );
};

export default DroppableTableHeaders;
