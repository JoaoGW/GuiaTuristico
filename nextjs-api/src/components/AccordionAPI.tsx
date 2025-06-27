import { AccordionItem } from "@heroui/react";

interface AccordionAPIProps {
  index: number;
  code: number;
  typeOfApi: "GET" | "POST";
  title: string;
  description: string;
}

export default function AccordionAPI({ index, code, typeOfApi, title, description }: AccordionAPIProps) {
  return (
    <AccordionItem
      key={ index }
      aria-label="Accordion"
      title={ title }
      className="border border-gray-200 rounded-lg mb-2 shadow-sm bg-white"
    >
      <div className="flex items-center gap-3 mb-2">
        <span
          className={`px-2 py-1 rounded text-xs font-bold text-white ${
            typeOfApi === "GET"
              ? "bg-green-600 border border-green-700"
              : "bg-blue-600 border border-blue-700"
          }`}
        >
          { typeOfApi }
        </span>
        <span className="font-semibold text-base text-gray-800">{ title }</span>
      </div>
      <div className="flex flex-row gap-5 items-center p-4 bg-gray-50 rounded-b-lg">
        <span className="text-gray-500 font-mono text-sm">{ code }: </span>
        <span className="text-gray-700 text-sm">{ description }</span>
      </div>
    </AccordionItem>
  );
}