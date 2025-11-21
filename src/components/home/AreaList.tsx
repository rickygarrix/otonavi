'use client'

export default function AreaList({
  areas,
  selectedArea,
  onSelect,
}: {
  areas: any[]
  selectedArea: string | null
  onSelect: (name: string) => void
}) {
  return (
    <>
      <h3 className="text-base font-bold text-gray-900">東京23区</h3>

      <div className="grid grid-cols-3 gap-4 mt-3">
        {areas
          .filter((a) => a.category === '23区')
          .map((area) => (
            <button
              key={area.id}
              onClick={() => onSelect(area.name)}
              className={`px-4 py-2 rounded-full border text-sm
                ${selectedArea === area.name
                  ? 'border-blue-500 text-blue-500 bg-blue-50'
                  : 'border-gray-300 text-gray-600 bg-white'
                }
              `}
            >
              {area.name}
            </button>
          ))}
      </div>

      <h3 className="text-base font-bold text-gray-900 mt-6">
        東京23区以外
      </h3>

      <div className="grid grid-cols-3 gap-4 mt-3">
        {areas
          .filter((a) => a.category === 'outside23')
          .map((area) => (
            <button
              key={area.id}
              onClick={() => onSelect(area.name)}
              className={`px-4 py-2 rounded-full border text-sm
                ${selectedArea === area.name
                  ? 'border-blue-500 text-blue-500 bg-blue-50'
                  : 'border-gray-300 text-gray-600 bg-white'
                }
              `}
            >
              {area.name}
            </button>
          ))}
      </div>
    </>
  )
}