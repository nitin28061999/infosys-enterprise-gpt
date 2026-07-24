interface DataGridProps {
  title: string;
  value: string;
}

interface GridProps {
  items: DataGridProps[];
}

export default function DataGrid({
  items,
}: GridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-xl bg-white p-6 shadow"
        >
          <h3 className="text-gray-500">
            {item.title}
          </h3>

          <p className="mt-3 text-3xl font-bold">
            {item.value}
          </p>
        </div>
      ))}

    </div>
  );
}