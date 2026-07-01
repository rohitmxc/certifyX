const fs = require('fs');

const file = '/Users/bapi/stellar-extra-practice/certifyx-workspace/web/src/components/CertificateTemplate.tsx';
let content = fs.readFileSync(file, 'utf8');

// The regex will look for className="... text-gray-500 ..." and move it to a style tag.
// Actually, it's easier to just replace the tailwind classes with inline styles manually in a script.

// Let's replace classes directly in className with nothing, and add the inline style.
// Since React elements can already have style={}, we should be careful.

const replacements = [
  { class: 'bg-white/90', style: 'backgroundColor: "rgba(255, 255, 255, 0.9)"' },
  { class: 'bg-white', style: 'backgroundColor: "#ffffff"' },
  { class: 'bg-gray-50/80', style: 'backgroundColor: "rgba(249, 250, 251, 0.8)"' },
  { class: 'hover:bg-gray-50', style: '' }, // Just remove it, no hover needed in PDF
  
  { class: 'text-gray-400', style: 'color: "#9ca3af"' },
  { class: 'text-gray-500', style: 'color: "#6b7280"' },
  { class: 'text-gray-600', style: 'color: "#4b5563"' },
  { class: 'text-gray-700', style: 'color: "#374151"' },
  
  { class: 'text-green-600', style: 'color: "#16a34a"' },
  { class: 'text-blue-600', style: 'color: "#2563eb"' },
  
  { class: 'border-gray-200', style: 'borderColor: "#e5e7eb"' },
  { class: 'border-gray-300', style: 'borderColor: "#d1d5db"' },
  { class: 'border-gray-400', style: 'borderColor: "#9ca3af"' },
  
  { class: 'text-[\\#0B2046]', style: 'color: "#0B2046"' },
  { class: 'text-[\\#D4AF37]', style: 'color: "#D4AF37"' },
  { class: 'bg-[\\#0B2046]', style: 'backgroundColor: "#0B2046"' },
  { class: 'bg-[\\#D4AF37]', style: 'backgroundColor: "#D4AF37"' },
  { class: 'border-[\\#0B2046]', style: 'borderColor: "#0B2046"' },
  { class: 'border-[\\#D4AF37]', style: 'borderColor: "#D4AF37"' },
  
  { class: 'border-t-[\\#0B2046]', style: 'borderTopColor: "#0B2046"' },
  { class: 'border-r-[\\#0B2046]', style: 'borderRightColor: "#0B2046"' },
  { class: 'border-l-[\\#0B2046]', style: 'borderLeftColor: "#0B2046"' },
  { class: 'border-t-transparent', style: 'borderTopColor: "transparent"' },
  { class: 'border-b-transparent', style: 'borderBottomColor: "transparent"' },
  { class: 'border-r-transparent', style: 'borderRightColor: "transparent"' },
];

let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  // Find className="..."
  const classNameMatch = line.match(/className="([^"]+)"/);
  if (classNameMatch) {
    let classes = classNameMatch[1].split(' ');
    let newClasses = [];
    let stylesToAdd = [];
    
    for (let c of classes) {
      let replaced = false;
      for (let r of replacements) {
        if (c === r.class) {
          if (r.style) stylesToAdd.push(r.style);
          replaced = true;
          break;
        }
      }
      if (!replaced) newClasses.push(c);
    }
    
    if (stylesToAdd.length > 0) {
      line = line.replace(classNameMatch[0], `className="${newClasses.join(' ')}"`);
      
      // Check if line already has style={...}
      if (line.includes('style={{')) {
        line = line.replace('style={{', `style={{ ${stylesToAdd.join(', ')}, `);
      } else {
        // Add style prop before className
        line = line.replace(`className=`, `style={{ ${stylesToAdd.join(', ')} }} className=`);
      }
    }
    lines[i] = line;
  }
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed colors in CertificateTemplate.tsx');
