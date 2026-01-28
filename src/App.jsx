import React, { useState, useRef, useCallback } from 'react';
import { 
  Smartphone, Monitor, Tablet, Image as ImageIcon, 
  Download, Loader2, Layout, 
  Facebook, Instagram, Eye, EyeOff
} from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';

const App = () => {
  // State Management
  const [screenshot, setScreenshot] = useState(null);
  const [brandColor, setBrandColor] = useState('#4f46e5');
  const [borderRadius, setBorderRadius] = useState('16');
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [activeLayout, setActiveLayout] = useState('classic');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState('');
  
  // Ref for canvas export
  const canvasRef = useRef(null);
  
  // Advanced Ad Formats Definition
  const formats = [
    { id: 'multi_device', label: 'Multi-Device', ratio: 'aspect-[16/9]', w: 1920, h: 1080, icon: Layout, category: 'Marketing' },
    { id: 'fb_post', label: 'FB Post', ratio: 'aspect-[1.91/1]', w: 1200, h: 630, icon: Facebook, category: 'Social' },
    { id: 'ig_square', label: 'IG Square', ratio: 'aspect-square', w: 1080, h: 1080, icon: Instagram, category: 'Social' },
    { id: 'ig_portrait', label: 'IG Portrait', ratio: 'aspect-[4/5]', w: 1080, h: 1350, icon: Instagram, category: 'Social' },
    { id: 'story', label: 'Story/TikTok', ratio: 'aspect-[9/16]', w: 1080, h: 1920, icon: Smartphone, category: 'Mobile' },
    { id: 'desktop', label: 'Web Banner', ratio: 'aspect-[16/9]', w: 1920, h: 1080, icon: Monitor, category: 'Web' },
  ];

  const [selectedFormat, setSelectedFormat] = useState(formats[0]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => setScreenshot(f.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Export functionality
  const handleExport = useCallback(async () => {
    if (!canvasRef.current) return;
    
    setIsExporting(true);
    setExportProgress('Preparing export...');
    
    try {
      // Temporarily hide safe zone for export
      const wasShowingSafeZone = showSafeZone;
      if (wasShowingSafeZone) setShowSafeZone(false);
      
      // Wait for re-render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setExportProgress('Generating image...');
      
      const dataUrl = await toPng(canvasRef.current, {
        width: selectedFormat.w,
        height: selectedFormat.h,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      });
      
      setExportProgress('Saving file...');
      
      const fileName = `kicks-${selectedFormat.label.toLowerCase().replace(/\//g, '-').replace(/\s/g, '-')}-${Date.now()}.png`;
      saveAs(dataUrl, fileName);
      
      // Restore safe zone if it was showing
      if (wasShowingSafeZone) setShowSafeZone(true);
      
      setExportProgress('Done!');
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress('');
      }, 1000);
      
    } catch (error) {
      console.error('Export failed:', error);
      setExportProgress('Export failed. Try again.');
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress('');
      }, 2000);
    }
  }, [selectedFormat, showSafeZone]);

  // Multi-device preview component
  const MultiDevicePreview = () => (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <div className="relative flex items-end justify-center perspective-1000 transform scale-90 sm:scale-100">
        
        {/* Laptop / PC */}
        <div className="relative z-10 transition-transform duration-500 hover:scale-[1.01] flex flex-col items-center">
          <div className="w-[420px] md:w-[500px] aspect-[16/10] bg-slate-900 rounded-t-xl border-[12px] border-slate-900 shadow-2xl overflow-hidden relative ring-1 ring-slate-800">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-800 rounded-full mt-1 z-20"></div>
            {screenshot ? (
              <img src={screenshot} className="w-full h-full object-cover object-top" alt="Laptop Screen" />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <Monitor className="text-slate-600 w-16 h-16 opacity-50" />
              </div>
            )}
          </div>
          <div className="w-[460px] md:w-[550px] h-4 bg-gradient-to-b from-slate-700 to-slate-800 rounded-b-lg shadow-xl relative z-20 flex justify-center">
            <div className="w-16 h-1 bg-slate-600 rounded-full mt-1.5 opacity-50"></div>
          </div>
          <div className="w-[400px] h-10 bg-black/20 blur-xl rounded-full mt-2 absolute -bottom-8"></div>
        </div>

        {/* Tablet */}
        <div className="absolute z-20 bottom-2 -left-4 md:-left-12 transition-all duration-500 hover:translate-y-[-5px]">
          <div className="w-32 md:w-40 aspect-[3/4] bg-slate-900 rounded-xl border-[8px] border-slate-900 shadow-xl overflow-hidden relative ring-1 ring-slate-700">
            {screenshot ? (
              <img src={screenshot} className="w-full h-full object-cover object-top" alt="Tablet Screen" />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <Tablet className="text-slate-600 w-10 h-10 opacity-50" />
              </div>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="absolute z-30 bottom-0 -right-2 md:-right-8 transition-all duration-500 hover:translate-y-[-5px]">
          <div className="w-20 md:w-24 aspect-[9/19] bg-slate-900 rounded-[20px] border-[6px] border-slate-900 shadow-2xl overflow-hidden relative ring-1 ring-slate-700">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-4 bg-slate-900 rounded-b-lg z-20 flex justify-center">
              <div className="w-6 h-1 bg-slate-800 rounded-full mt-1"></div>
            </div>
            {screenshot ? (
              <img src={screenshot} className="w-full h-full object-cover object-top" alt="Phone Screen" />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <Smartphone className="text-slate-600 w-8 h-8 opacity-50" />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <nav className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Layout className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">KICKS <span className="text-indigo-600">ProBuilder</span></h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button 
              onClick={() => setShowSafeZone(!showSafeZone)}
              className={`p-1.5 rounded-md transition-all ${showSafeZone ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
              title="Toggle Safe Zones"
            >
              {showSafeZone ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95 disabled:active:scale-100"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{exportProgress}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Export Assets
              </>
            )}
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto p-5 space-y-8 no-scrollbar z-10 shadow-lg flex-shrink-0">
          
          {/* Section 1: Content Assets */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">1. Content Assets</label>
            <div className="space-y-3">
              <label className="group relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all overflow-hidden bg-slate-50">
                {screenshot ? (
                  <>
                    <img src={screenshot} className="w-full h-full object-cover opacity-50 blur-sm" alt="Preview" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-indigo-600 mb-1" />
                      <span className="text-[10px] text-indigo-600 font-bold bg-white/80 px-2 py-1 rounded-full">Change Image</span>
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-indigo-500 mb-2" />
                    <span className="text-[11px] text-slate-500 font-bold">Upload Web Screenshot</span>
                  </>
                )}
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
              </label>
            </div>
          </div>

          {/* Section 2: Pro Ad Formats */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">2. Pro Ad Formats</label>
            <div className="grid grid-cols-2 gap-2">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormat(f)}
                  className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left group ${selectedFormat.id === f.id ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600 shadow-sm' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between w-full items-start mb-2">
                    <f.icon className={`w-4 h-4 ${selectedFormat.id === f.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-[9px] font-mono text-slate-400 group-hover:text-slate-600">{f.w}x{f.h}</span>
                  </div>
                  <span className={`text-[11px] font-bold ${selectedFormat.id === f.id ? 'text-indigo-900' : 'text-slate-600'}`}>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Layout Presets */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">3. Layout Presets</label>
            <div className="space-y-2">
              {[
                { id: 'classic', label: 'Classic Center', desc: 'Standard centered layout' },
                { id: 'split', label: 'Modern Split', desc: 'Text and image side by side' },
                { id: 'overlay', label: 'Bold Overlay', desc: 'Text overlay on background' }
              ].map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => setActiveLayout(layout.id)}
                  disabled={selectedFormat.id === 'multi_device' && layout.id === 'split'}
                  className={`w-full p-3 rounded-xl border text-left transition-all 
                    ${activeLayout === layout.id ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'border-slate-100 hover:bg-slate-50'}
                    ${selectedFormat.id === 'multi_device' && layout.id === 'split' ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold">{layout.label}</p>
                    {activeLayout === layout.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </div>
                  <p className={`text-[10px] mt-1 ${activeLayout === layout.id ? 'text-indigo-100' : 'text-slate-400'}`}>{layout.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Brand Kit */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">4. Brand Styling</label>
            <div className="p-4 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Brand Color</span>
                <div className="relative flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border-2 border-slate-200 shadow-sm overflow-hidden">
                    <input 
                      type="color" 
                      value={brandColor} 
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-10 h-10 -m-2 cursor-pointer"
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-500">{brandColor}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-500">Border Radius</span>
                  <span className="text-indigo-600">{borderRadius}px</span>
                </div>
                <input 
                  type="range" min="0" max="48" value={borderRadius}
                  onChange={(e) => setBorderRadius(e.target.value)}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 bg-slate-100 p-8 md:p-12 overflow-y-auto flex items-center justify-center no-scrollbar relative">
          
          {/* Ad Container Wrapper */}
          <div className="relative group perspective-1000 transition-all duration-500">
            {/* Resolution Badge */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-200 flex items-center gap-2 z-50">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{selectedFormat.label}</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
              <span className="text-[10px] font-mono font-bold text-indigo-600">{selectedFormat.w} x {selectedFormat.h} px</span>
            </div>

            {/* Main Canvas - This is what gets exported */}
            <div 
              ref={canvasRef}
              style={{ 
                borderRadius: `${borderRadius}px`,
                backgroundColor: 'white',
                boxShadow: '0 40px 100px -20px rgba(0,0,0,0.15)'
              }}
              className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden relative border border-slate-100
                ${selectedFormat.ratio} h-[65vh] max-w-[95vw] shadow-2xl
              `}
            >
              {/* Safe Zone Grid */}
              {showSafeZone && (
                <div className="absolute inset-0 z-50 pointer-events-none">
                  <div className="w-full h-full border-[32px] border-red-500/10 relative">
                    <div className="w-full h-full border border-dashed border-red-500/30 grid grid-cols-2 grid-rows-2">
                      <div className="border-[0.5px] border-dashed border-red-500/20"></div>
                      <div className="border-[0.5px] border-dashed border-red-500/20"></div>
                      <div className="border-[0.5px] border-dashed border-red-500/20"></div>
                      <div className="border-[0.5px] border-dashed border-red-500/20"></div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[9px] px-2 py-0.5 rounded font-bold">SAFE ZONE ON</div>
                </div>
              )}

              {/* Ad Content Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-indigo-50/30 to-slate-100"></div>
              
              {/* Dynamic Content Layouts */}
              <div className={`relative z-10 w-full h-full p-8 md:p-12 flex transition-all duration-500
                ${activeLayout === 'split' && selectedFormat.id !== 'multi_device' ? 'flex-row items-center gap-12 text-left' : 'flex-col items-center text-center'}
                ${activeLayout === 'overlay' ? 'justify-end' : 'justify-between'}
              `}>
                
                {/* Branding / Text Section */}
                <div className={`transition-all duration-500
                  ${activeLayout === 'split' && selectedFormat.id !== 'multi_device' ? 'w-[40%] order-1' : 'w-full mb-6'} 
                  ${activeLayout === 'overlay' ? 'absolute inset-0 flex flex-col justify-center items-center z-20 pointer-events-none p-12' : ''}
                `}>
                  
                  {activeLayout === 'overlay' ? (
                    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/60 transform -rotate-1 max-w-md">
                      <h2 className="text-3xl font-black italic tracking-tighter mb-2" style={{ color: brandColor }}>KICKS</h2>
                      <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-3">Season Finale</p>
                      <p className="text-slate-900 font-black text-5xl leading-[0.9] mb-6">50%<br/>OFF</p>
                      <div className="flex justify-center w-full pointer-events-auto">
                        <button style={{ backgroundColor: brandColor }} className="px-8 py-3 text-white text-sm font-black rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform">SHOP NOW</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full justify-center">
                      <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-2 transition-colors" style={{ color: brandColor }}>KICKS</h2>
                      {activeLayout === 'split' && (
                        <>
                          <p className="text-slate-900 font-black text-4xl mb-4 leading-tight mt-4">STEP UP<br/>YOUR GAME.</p>
                          <p className="text-slate-500 text-sm mb-6 leading-relaxed">Discover our latest collection that blends technology and comfort.</p>
                          <div>
                            <button style={{ backgroundColor: brandColor }} className="px-8 py-3 text-white text-sm font-black rounded-full shadow-lg hover:brightness-110">EXPLORE</button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Visual / Image Section */}
                <div className={`relative transition-all duration-500 flex items-center justify-center
                  ${activeLayout === 'split' && selectedFormat.id !== 'multi_device' ? 'w-[60%] h-full order-2' : 'w-full flex-1'}
                  ${activeLayout === 'overlay' ? 'absolute inset-0 w-full h-full' : ''}
                `}>
                  
                  {selectedFormat.id === 'multi_device' ? (
                    <div className={`w-full h-full ${activeLayout === 'overlay' ? 'opacity-80 scale-110' : ''}`}>
                      <MultiDevicePreview />
                    </div>
                  ) : (
                    <div 
                      style={{ borderRadius: `${borderRadius}px` }}
                      className={`bg-slate-800 shadow-2xl overflow-hidden border-4 border-white transition-all transform group-hover:scale-[1.02]
                        ${activeLayout === 'overlay' ? 'w-full h-full border-none rounded-none' : 'w-[80%] aspect-[4/3] rotate-1 hover:rotate-0'}
                      `}
                    >
                      {screenshot ? (
                        <img src={screenshot} className="w-full h-full object-cover object-top" alt="Screenshot" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900">
                          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <ImageIcon className="w-8 h-8 opacity-20" />
                          </div>
                          <span className="text-[10px] tracking-[0.3em] uppercase font-bold opacity-30">No Image Selected</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Call to Action (Classic Layout Only) */}
                {activeLayout === 'classic' && (
                  <div className="mt-8 z-10 relative">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Limited Time Offer</p>
                    <p className="text-slate-900 font-black text-xl md:text-2xl mb-5 leading-tight">TAKE THE NEXT STEP IN STYLE</p>
                    <button 
                      style={{ backgroundColor: brandColor }}
                      className="px-10 py-3 text-white text-xs font-black rounded-full shadow-xl hover:brightness-110 active:scale-95 transition-all transform hover:-translate-y-1"
                    >
                      SHOP THE COLLECTION
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="h-10 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-xs text-slate-400">
        <span>© 2026 KICKS ProBuilder</span>
        <span>Made with ❤️ for marketers</span>
      </footer>
    </div>
  );
};

export default App;
