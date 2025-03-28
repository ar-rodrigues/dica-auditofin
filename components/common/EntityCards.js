import React from "react";
import { useAtom } from "jotai";
import { entitiesAtom } from "@/lib/atoms";

const EntityCard = ({ entity, stats, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200"
  >
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        {entity.logo ? (
          <img
            src={entity.logo}
            alt={entity.name}
            className="w-12 h-12 object-contain"
          />
        ) : (
          <span className="text-2xl font-bold text-gray-400">
            {entity.name.charAt(0)}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{entity.name}</h3>
        <p className="text-sm text-gray-500">{entity.description}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-600">Total</p>
        <p className="text-xl font-semibold text-blue-900">{stats.total}</p>
      </div>
      <div className="bg-yellow-50 p-3 rounded-lg">
        <p className="text-sm text-yellow-600">Pending</p>
        <p className="text-xl font-semibold text-yellow-900">{stats.pending}</p>
      </div>
      <div className="bg-green-50 p-3 rounded-lg">
        <p className="text-sm text-green-600">Approved</p>
        <p className="text-xl font-semibold text-green-900">{stats.approved}</p>
      </div>
      <div className="bg-red-50 p-3 rounded-lg">
        <p className="text-sm text-red-600">Missing</p>
        <p className="text-xl font-semibold text-red-900">{stats.missing}</p>
      </div>
    </div>
  </div>
);

const EntityCards = ({ onEntityClick }) => {
  const [entities] = useAtom(entitiesAtom);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entities.map((entity) => (
        <EntityCard
          key={entity.id}
          entity={entity}
          stats={{
            total: entity.requirements?.length || 0,
            pending:
              entity.requirements?.filter((r) => r.status === "pending")
                .length || 0,
            approved:
              entity.requirements?.filter((r) => r.status === "approved")
                .length || 0,
            missing:
              entity.requirements?.filter((r) => r.status === "missing")
                .length || 0,
          }}
          onClick={() => onEntityClick(entity.id)}
        />
      ))}
    </div>
  );
};

export default EntityCards;
