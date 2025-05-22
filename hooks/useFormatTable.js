import { useMemo } from "react";

/**
 * Hook para procesar datos de valores de formato y convertirlos en columnas y datos de origen
 * para el componente Table de Ant Design
 *
 * @param {Array} values - Array de valores del formato con cell_ref y header_id
 * @param {Array} headers - Array de encabezados del formato
 * @returns {Object} { columns, dataSource } - Columnas y datos listos para usar en Table
 */
export function useFormatTable(values, headers) {
  console.log(values);
  return useMemo(() => {
    if (!values || !headers || values.length === 0 || headers.length === 0) {
      return { columns: [], dataSource: [] };
    }

    // Crear un mapa para agrupar valores por fila usando cell_ref
    const rowsMap = new Map();

    // Extraer el número de fila de cell_ref (ejemplo: 'A2' -> '2')
    values.forEach((value) => {
      if (value.cell_ref) {
        const rowMatch = value.cell_ref.match(/[A-Z]+(\d+)/);
        if (rowMatch && rowMatch[1]) {
          const rowNumber = rowMatch[1];

          if (!rowsMap.has(rowNumber)) {
            rowsMap.set(rowNumber, {});
          }

          // Usar el nombre del encabezado como clave
          const headerName = value.header_id.header;
          rowsMap.get(rowNumber)[headerName] = value.value;
        }
      }
    });

    // Convertir el mapa a un array para dataSource, ordenado por número de fila
    const dataSource = Array.from(rowsMap.entries())
      .sort(([rowNumA], [rowNumB]) => parseInt(rowNumA) - parseInt(rowNumB))
      .map(([rowNumber, rowData], index) => ({
        ...rowData,
        key: index, // Añadir key para React
      }));

    // Crear columnas para la tabla
    const columns = headers
      .sort((a, b) => a.order - b.order) // Ordenar por la propiedad order
      .map((header) => ({
        title: header.header,
        dataIndex: header.header,
        key: header.id,
        align: header.type === "number" ? "right" : "left",
      }));

    return { columns, dataSource };
  }, [values, headers]);
}
