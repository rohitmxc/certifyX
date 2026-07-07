import { DraggableTemplateBuilder } from "@/components/DraggableTemplateBuilder";

export default function NewTemplatePage() {
  return (
    <div className="min-h-screen bg-neutral-50/50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create Template</h1>
            <p className="text-neutral-500">Design your certificate layout. Use {"{{Variable}}"} syntax for dynamic CSV fields.</p>
          </div>
        </div>
        
        <DraggableTemplateBuilder />
      </div>
    </div>
  );
}
