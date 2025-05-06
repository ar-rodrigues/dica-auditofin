import React, { useState } from "react";
import { Empty } from "antd";
import EntityCard from "./EntityCard";
import EntityHeader from "./EntityHeader";

const EntityCardList = ({ entities, onEntitySelect }) => {
  const [searchText, setSearchText] = useState("");

  const filteredEntities = React.useMemo(() => {
    if (!searchText) return entities;

    const lowerSearch = searchText.toLowerCase();
    return entities.filter(
      (entity) =>
        (entity.entity_name &&
          entity.entity_name.toLowerCase().includes(lowerSearch)) ||
        (entity.description &&
          entity.description.toLowerCase().includes(lowerSearch))
    );
  }, [entities, searchText]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center">
          <div className="bg-gray-100 w-10 h-10 flex items-center justify-center rounded-lg mr-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-700"
            >
              <path
                d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H18C18.55 5 19 5.45 19 6V18C19 18.55 18.55 19 18 19Z"
                fill="currentColor"
              />
              <path d="M12 15H8V17H12V15Z" fill="currentColor" />
              <path d="M16 11H8V13H16V11Z" fill="currentColor" />
              <path d="M16 7H8V9H16V7Z" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800 m-0">
              Entidades Asignadas
            </h1>
            <p className="text-sm text-gray-500 m-0">
              Selecciona una entidad para ver sus requerimientos de auditoría
            </p>
          </div>
        </div>

        <EntityHeader onSearch={handleSearch} />
      </div>

      {filteredEntities.length > 0 ? (
        <div className="space-y-5 transition-all duration-300">
          {filteredEntities.map((entity) => (
            <div
              key={entity.id}
              className="transition-all duration-300 transform hover:translate-y-[-2px]"
            >
              <EntityCard
                entity={entity}
                onClick={() => onEntitySelect(entity)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 px-4 bg-gray-50 rounded-lg text-center">
          <Empty
            description={
              searchText
                ? "No se encontraron entidades que coincidan con la búsqueda"
                : "No hay entidades disponibles"
            }
            className="my-4"
          />
        </div>
      )}
    </div>
  );
};

export default EntityCardList;
