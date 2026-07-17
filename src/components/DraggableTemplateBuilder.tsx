"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

// The elements that can be dragged onto the certificate
type ElementType = 'text' | 'image' | 'qr';

interface TemplateElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  content: string; // for text this is the string (can contain {{Variable}}), for image it's a URL
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  fontFamily?: string;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export const DraggableTemplateBuilder = () => {
  const [elements, setElements] = useState<TemplateElement[]>([
    { id: '1', type: 'text', x: 50, y: 50, content: 'CERTIFICATE OF COMPLETION', fontSize: 32, color: '#000000', fontWeight: 'bold', fontFamily: 'var(--font-playfair)' },
    { id: '2', type: 'text', x: 50, y: 120, content: 'Awarded to', fontSize: 16, color: '#4c4546', fontWeight: 'normal', fontFamily: 'var(--font-hanken)' },
    { id: '3', type: 'text', x: 50, y: 160, content: '{{Student Name}}', fontSize: 64, color: '#ff0000', fontWeight: 'normal', fontFamily: 'var(--font-great-vibes)' },
    { id: '4', type: 'qr', x: 650, y: 400, content: 'QR Code' }
  ]);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const addElement = (type: ElementType) => {
    const newElement: TemplateElement = {
      id: Date.now().toString(),
      type,
      x: 350,
      y: 250,
      content: type === 'text' ? 'New Text' : 'Image URL',
      fontSize: 24,
      color: theme === 'dark' ? '#ffffff' : '#000000',
      fontWeight: 'normal',
      fontFamily: 'var(--font-hanken)',
      fontStyle: 'normal',
      textAlign: 'left'
    };
    setElements([...elements, newElement]);
  };

  const updateElement = (id: string, updates: Partial<TemplateElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const selectedElement = elements.find(el => el.id === selectedId);

  const [templateName, setTemplateName] = useState('My Custom Template');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          designJson: JSON.stringify(elements),
          theme,
          customFields: elements.filter(el => el.type === 'text' && el.content.includes('{{')).map(el => {
            const match = el.content.match(/\{\{([^}]+)\}\}/);
            return match ? match[1] : null;
          }).filter(Boolean)
        })
      });
      if (res.ok) {
        alert('Template saved successfully!');
      } else {
        alert('Failed to save template.');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving template.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 min-h-[700px] p-8 bg-surface-bright items-start">
      
      {/* LEFT: Toolbar & Properties */}
      <div className="w-full xl:w-80 bg-pure-white border border-primary rounded-none p-5 flex flex-col technical-border shrink-0">
        <h3 className="font-dot text-[16px] uppercase mb-4 text-primary">TEMPLATE EDITOR</h3>
        
        <div className="mb-4">
          <label className="font-mono-label text-[10px] text-outline uppercase mb-2 block">TEMPLATE NAME</label>
          <input 
            type="text" 
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
            className="w-full border border-primary bg-surface-bright rounded-none px-3 py-2 text-sm focus:outline-none focus:border-secondary font-hanken text-primary transition-colors"
            placeholder="e.g., Stellar Certificate"
          />
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => addElement('text')} className="flex-1 bg-surface-bright border border-primary py-2 rounded-none font-mono-label text-[12px] uppercase hover:bg-primary hover:text-pure-white transition-colors">+ TEXT</button>
          <button onClick={() => addElement('image')} className="flex-1 bg-surface-bright border border-primary py-2 rounded-none font-mono-label text-[12px] uppercase hover:bg-primary hover:text-pure-white transition-colors">+ IMAGE</button>
        </div>

        <div className="mb-6">
          <label className="font-mono-label text-[10px] text-outline uppercase mb-2 block">THEME (BACKGROUND)</label>
          <div className="flex gap-2">
            <button 
              onClick={() => setTheme('dark')} 
              className={`flex-1 py-1.5 rounded-none font-mono-label text-[12px] uppercase border border-primary transition-colors ${theme === 'dark' ? 'bg-primary text-pure-white' : 'bg-surface-bright text-primary hover:bg-surface-container'}`}
            >DARK</button>
            <button 
              onClick={() => setTheme('light')} 
              className={`flex-1 py-1.5 rounded-none font-mono-label text-[12px] uppercase border border-primary transition-colors ${theme === 'light' ? 'bg-primary text-pure-white' : 'bg-surface-bright text-primary hover:bg-surface-container'}`}
            >LIGHT</button>
          </div>
        </div>

        {selectedElement && selectedElement.type === 'text' && (
          <div className="space-y-4 border-t border-primary pt-4 flex-1 overflow-y-auto pr-2">
            <p className="font-mono-label text-[10px] text-primary uppercase font-bold">EDIT ELEMENT</p>
            
            <div>
              <label className="font-mono-label text-[10px] text-outline uppercase block mb-1">CONTENT (USE {"{{VAR}}"} FOR CSV)</label>
              <textarea 
                value={selectedElement.content}
                onChange={e => updateElement(selectedElement.id, { content: e.target.value })}
                className="w-full border border-primary bg-surface-bright rounded-none px-2 py-1.5 text-sm focus:outline-none focus:border-secondary font-hanken text-primary transition-colors min-h-[60px]"
              />
            </div>

            <div>
              <label className="font-mono-label text-[10px] text-outline uppercase block mb-1">FONT FAMILY</label>
              <select 
                value={selectedElement.fontFamily || 'var(--font-hanken)'}
                onChange={e => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                className="w-full border border-primary bg-surface-bright rounded-none px-2 py-1.5 text-sm focus:outline-none focus:border-secondary font-mono-label text-primary"
              >
                <option value="var(--font-hanken)">Hanken (Sans)</option>
                <option value="var(--font-playfair)">Playfair (Serif)</option>
                <option value="var(--font-great-vibes)">Great Vibes (Script)</option>
                <option value="var(--font-ndot)">NDOT (Display)</option>
                <option value="var(--font-jetbrains)">JetBrains (Mono)</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="font-mono-label text-[10px] text-outline uppercase block mb-1">SIZE (PX)</label>
                <input 
                  type="number" 
                  value={selectedElement.fontSize}
                  onChange={e => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                  className="w-full border border-primary bg-surface-bright rounded-none px-2 py-1.5 text-sm focus:outline-none focus:border-secondary font-hanken text-primary"
                />
              </div>
              <div className="flex-1">
                <label className="font-mono-label text-[10px] text-outline uppercase block mb-1">COLOR</label>
                <input 
                  type="color" 
                  value={selectedElement.color}
                  onChange={e => updateElement(selectedElement.id, { color: e.target.value })}
                  className="w-full h-[32px] border border-primary rounded-none p-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="font-mono-label text-[10px] text-outline uppercase block mb-1">WEIGHT</label>
                <select 
                  value={selectedElement.fontWeight || 'normal'}
                  onChange={e => updateElement(selectedElement.id, { fontWeight: e.target.value })}
                  className="w-full border border-primary bg-surface-bright rounded-none px-2 py-1.5 text-sm focus:outline-none focus:border-secondary font-mono-label text-primary"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="font-mono-label text-[10px] text-outline uppercase block mb-1">STYLE</label>
                <select 
                  value={selectedElement.fontStyle || 'normal'}
                  onChange={e => updateElement(selectedElement.id, { fontStyle: e.target.value })}
                  className="w-full border border-primary bg-surface-bright rounded-none px-2 py-1.5 text-sm focus:outline-none focus:border-secondary font-mono-label text-primary"
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-mono-label text-[10px] text-outline uppercase block mb-1">ALIGNMENT</label>
              <div className="flex gap-2">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    onClick={() => updateElement(selectedElement.id, { textAlign: align as 'left'|'center'|'right' })}
                    className={`flex-1 py-1 rounded-none font-mono-label text-[10px] uppercase border border-primary ${selectedElement.textAlign === align ? 'bg-primary text-pure-white' : 'bg-surface-bright text-primary hover:bg-surface-container'}`}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-primary shrink-0">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-primary text-pure-white font-dot text-[14px] uppercase py-3 rounded-none hover:bg-inverse-surface transition-colors disabled:opacity-50 active:scale-95 duration-200"
          >
            {isSaving ? "SAVING..." : "SAVE TEMPLATE"}
          </button>
        </div>
      </div>

      {/* RIGHT: Canvas Area */}
      <div className="flex-1 bg-surface-container border border-outline-variant rounded-none overflow-hidden flex items-center justify-center p-8 relative min-w-[800px] overflow-auto">
        <div className="absolute top-4 left-4 z-10">
            <span className="font-mono-label text-[10px] text-primary uppercase">DRAG & DROP EDITOR</span>
        </div>
        <div 
          ref={containerRef}
          className={`w-[1000px] h-[700px] relative transition-colors duration-300 technical-border shadow-lg ${
            theme === 'dark' ? 'bg-primary' : 'bg-pure-white'
          }`}
          onClick={() => setSelectedId(null)}
          style={{
            backgroundImage: theme === 'light' ? 'radial-gradient(circle, #b3b3b3 1.5px, transparent 1.5px)' : 'none',
            backgroundSize: '160px 160px'
          }}
        >
          {/* Inner border to simulate CertificateTemplate */}
          <div className="absolute inset-4 border border-primary pointer-events-none"></div>

          {elements.map(el => (
            <motion.div
              key={el.id}
              drag
              dragMomentum={false}
              dragConstraints={containerRef}
              initial={{ x: el.x, y: el.y }}
              onDragEnd={(e, info) => {
                // Approximate new position relative to container
                updateElement(el.id, { x: el.x + info.offset.x, y: el.y + info.offset.y });
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(el.id);
              }}
              className={`absolute cursor-move px-2 py-1 border ${
                selectedId === el.id ? 'border-signal-red bg-signal-red/5 z-50' : 'border-transparent hover:border-outline/50 z-10'
              }`}
              style={{
                fontSize: el.fontSize ? `${el.fontSize}px` : '16px',
                color: el.color,
                fontWeight: el.fontWeight,
                fontFamily: el.fontFamily || 'var(--font-hanken)',
                fontStyle: el.fontStyle || 'normal',
                textAlign: el.textAlign || 'left',
                left: 0,
                top: 0,
                whiteSpace: 'pre-wrap',
                minWidth: '50px'
              }}
            >
              {el.type === 'text' ? (
                <div style={{ lineHeight: 1.1 }}>{el.content}</div>
              ) : el.type === 'qr' ? (
                <div className="w-24 h-24 bg-pure-white p-2 border border-primary flex items-center justify-center">
                  <div className="font-mono-label text-[10px] text-primary text-center">AUTO QR</div>
                </div>
              ) : (
                <div className="w-32 h-32 bg-surface-container border border-primary flex items-center justify-center font-mono-label text-[10px] text-primary">
                  IMG
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};
