"use client";

import { useState, useEffect, type ReactNode } from "react";

interface ClientOnlyProps {
  children: ReactNode;
}

/**
 * Un componente que garantiza que sus hijos solo se rendericen en el lado del cliente.
 * Esto es útil para evitar errores de hidratación de React cuando el contenido
 * depende de APIs del navegador o puede diferir entre el servidor y el cliente.
 */
const ClientOnly = ({ children }: ClientOnlyProps) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // O un componente de carga (spinner, skeleton, etc.)
  }

  return <>{children}</>;
};

export default ClientOnly;
