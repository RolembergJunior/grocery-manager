import type { ListItem } from "@/app/type";
import RenderWhen from "@/components/RenderWhen";
import NotebookItem from "./components/NotebookItem";

interface NotebookListProps {
  items: ListItem[];
}

export default function NotebookList({ items }: NotebookListProps) {
  return (
    <div className="max-w-4xl mx-auto mt-2">
      <div>
        <RenderWhen
          isTrue={!!items.length}
          elseElement={
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">Nenhum item nesta lista</p>
              <p className="text-sm mt-2">Adicione itens para começar</p>
            </div>
          }
        >
          {items.map((item) => (
            <NotebookItem key={item.id} item={item} />
          ))}
        </RenderWhen>
      </div>
    </div>
  );
}
