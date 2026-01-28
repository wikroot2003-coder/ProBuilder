/* eslint-disable react/prop-types */
import React, { useState, useRef, useCallback } from 'react';
import {
  Smartphone, Monitor, Image as ImageIcon,
  Download, Loader2, Layout,
  Share2, Grid3X3, Eye, EyeOff,
  Type, Trash2, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Plus, X,
  Palette, PlusCircle, Square, Circle, RectangleHorizontal, Hexagon, MessageSquare,
  Move, Tablet
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import MultiDevicePreview, { DEVICE_FRAMES } from './MultiDevicePreview';

const HeaderBar = ({ showSafeZone, setShowSafeZone, isExporting, exportProgress, handleExport }) => (
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
);

const SidebarControls = ({
  screenshot,
  handleFileUpload,
  formats,
  selectedFormat,
  setSelectedFormat,
  activeLayout,
  setActiveLayout,
  brandColor,
  setBrandColor,
  borderRadius,
  setBorderRadius,
  textElements,
  selectedTextId,
  onAddText,
  onSelectText,
  onDeleteText,
  deviceSettings,
  setDeviceSettings,
  onShowImagePanel,
}) => (
  <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto p-5 space-y-8 no-scrollbar z-10 shadow-lg flex-shrink-0">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">1. Content Assets</p>
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
              <span className="text-[11px] text-slate-500 font-bold">Upload Image Only</span>
              <span className="text-[9px] text-slate-400 mt-1">PNG, JPG, WEBP</span>
            </>
          )}
          <input type="file" className="hidden" onChange={handleFileUpload} accept="image/png,image/jpeg,image/jpg,image/webp,image/gif" />
        </label>
        {screenshot && (
          <button
            onClick={onShowImagePanel}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all text-xs font-bold border border-indigo-200"
          >
            <ImageIcon className="w-4 h-4" />
            Edit Image Settings
          </button>
        )}
      </div>
    </div>

    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">2. Pro Ad Formats</p>
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

    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">3. Layout Presets</p>
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

    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">4. Text Elements</p>
      <div className="space-y-2">
        <button
          onClick={onAddText}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-slate-500 hover:text-indigo-600"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs font-bold">Add Text</span>
        </button>
        {textElements.length > 0 && (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {textElements.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectText(t.id)}
                className={`w-full flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                  selectedTextId === t.id ? 'bg-indigo-100 border border-indigo-300' : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Type className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span className="text-[11px] font-medium text-slate-600 truncate">{t.content}</span>
                </div>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); onDeleteText(t.id); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onDeleteText(t.id); } }}
                  className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>

    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">5. Brand Styling</p>
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

    {/* Multi-Device Settings - Only show when Multi-Device format is selected */}
    {selectedFormat.id === 'multi_device' && (
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">6. Device Frames</p>
        <div className="p-4 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
          {/* PC Frame Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-600">PC / Laptop</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={deviceSettings?.pc?.visible !== false}
                  onChange={(e) => setDeviceSettings(prev => ({
                    ...prev,
                    pc: { ...prev.pc, visible: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <select
              value={deviceSettings?.pc?.frame || 'macbook'}
              onChange={(e) => setDeviceSettings(prev => ({
                ...prev,
                pc: { ...prev.pc, frame: e.target.value }
              }))}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(DEVICE_FRAMES.pc).map(([key, frame]) => (
                <option key={key} value={key}>{frame.name}</option>
              ))}
            </select>
          </div>

          {/* Tablet Frame Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tablet className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-600">Tablet</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={deviceSettings?.tablet?.visible !== false}
                  onChange={(e) => setDeviceSettings(prev => ({
                    ...prev,
                    tablet: { ...prev.tablet, visible: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <select
              value={deviceSettings?.tablet?.frame || 'ipad'}
              onChange={(e) => setDeviceSettings(prev => ({
                ...prev,
                tablet: { ...prev.tablet, frame: e.target.value }
              }))}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(DEVICE_FRAMES.tablet).map(([key, frame]) => (
                <option key={key} value={key}>{frame.name}</option>
              ))}
            </select>
          </div>

          {/* Smartphone Frame Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-600">Smartphone</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={deviceSettings?.smartphone?.visible !== false}
                  onChange={(e) => setDeviceSettings(prev => ({
                    ...prev,
                    smartphone: { ...prev.smartphone, visible: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <select
              value={deviceSettings?.smartphone?.frame || 'iphone'}
              onChange={(e) => setDeviceSettings(prev => ({
                ...prev,
                smartphone: { ...prev.smartphone, frame: e.target.value }
              }))}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(DEVICE_FRAMES.smartphone).map(([key, frame]) => (
                <option key={key} value={key}>{frame.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    )}
  </aside>
);

// Image Settings Panel - shows when image is selected
const ImageSettingsPanel = ({ imageSettings, setImageSettings, onClose }) => (
  <div className="w-72 bg-white border-l border-slate-200 p-4 space-y-4 overflow-y-auto flex-shrink-0 shadow-lg">
    <div className="flex items-center justify-between">
      <p className="text-xs font-black text-slate-600 uppercase tracking-wider">Image Settings</p>
      <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
        <X className="w-4 h-4 text-slate-400" />
      </button>
    </div>

    <div className="p-4 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold">
            <span className="text-slate-500">Position X</span>
            <span className="text-indigo-600">{imageSettings.x}%</span>
          </div>
          <input
            type="range" min="0" max="100" value={imageSettings.x}
            onChange={(e) => setImageSettings(prev => ({ ...prev, x: Number(e.target.value) }))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold">
            <span className="text-slate-500">Position Y</span>
            <span className="text-indigo-600">{imageSettings.y}%</span>
          </div>
          <input
            type="range" min="0" max="100" value={imageSettings.y}
            onChange={(e) => setImageSettings(prev => ({ ...prev, y: Number(e.target.value) }))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold">
            <span className="text-slate-500">Width</span>
            <span className="text-indigo-600">{imageSettings.width}%</span>
          </div>
          <input
            type="range" min="10" max="100" value={imageSettings.width}
            onChange={(e) => setImageSettings(prev => ({ ...prev, width: Number(e.target.value) }))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold">
            <span className="text-slate-500">Height</span>
            <span className="text-indigo-600">{imageSettings.height}%</span>
          </div>
          <input
            type="range" min="10" max="100" value={imageSettings.height}
            onChange={(e) => setImageSettings(prev => ({ ...prev, height: Number(e.target.value) }))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-bold">
          <span className="text-slate-500">Border Radius</span>
          <span className="text-indigo-600">{imageSettings.borderRadius}px</span>
        </div>
        <input
          type="range" min="0" max="48" value={imageSettings.borderRadius}
          onChange={(e) => setImageSettings(prev => ({ ...prev, borderRadius: Number(e.target.value) }))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>
    </div>

    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
      <div className="flex items-center gap-2 text-indigo-600">
        <Move className="w-4 h-4" />
        <span className="text-xs font-bold">Drag & Resize</span>
      </div>
      <p className="text-[10px] text-indigo-500 mt-1">
        Click and drag the image to reposition. Use the handles to resize.
      </p>
    </div>
  </div>
);

// CanvasTextSection removed - text elements are now fully editable placeholders

const CanvasImageSection = ({ 
  activeLayout, 
  selectedFormat, 
  screenshot, 
  imageSettings,
  isSelected,
  isDragging,
  isResizing,
  onMouseDown,
  onResizeMouseDown,
  deviceSettings,
  onDeviceSettingsChange,
}) => {
  // For multi_device format, render without wrapper to allow individual device interaction
  if (selectedFormat.id === 'multi_device') {
    return (
      <div className={`absolute inset-0 w-full h-full ${activeLayout === 'overlay' ? 'opacity-80 scale-110' : ''}`}>
        <MultiDevicePreview 
          screenshot={screenshot} 
          deviceSettings={deviceSettings}
          onDeviceSettingsChange={onDeviceSettingsChange}
        />
      </div>
    );
  }

  return (
  <div
    role="button"
    tabIndex={0}
    onMouseDown={onMouseDown}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onMouseDown?.(e); }}
    className={`absolute flex items-center justify-center select-none
      ${activeLayout === 'overlay' ? 'inset-0 w-full h-full pointer-events-none' : 'cursor-move'}
      ${isDragging || isResizing ? '' : 'transition-all duration-300'}
      ${isSelected && activeLayout !== 'overlay' ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
      ${!isSelected && activeLayout !== 'overlay' ? 'hover:ring-2 hover:ring-indigo-300' : ''}
    `}
    style={activeLayout !== 'overlay' ? {
      left: `${imageSettings.x}%`,
      top: `${imageSettings.y}%`,
      transform: 'translate(-50%, -50%)',
      width: `${imageSettings.width}%`,
      height: `${imageSettings.height}%`,
      zIndex: isDragging || isResizing ? 35 : 30,
    } : undefined}
  >
    {/* Resize Handles - only show when selected and not in overlay mode */}
    {isSelected && activeLayout !== 'overlay' && (
      <>
        {/* Corner handles */}
        <div
          onMouseDown={(e) => onResizeMouseDown?.(e, 'nw')}
          className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full cursor-nw-resize z-50 hover:bg-indigo-100 transition-colors"
        />
        <div
          onMouseDown={(e) => onResizeMouseDown?.(e, 'ne')}
          className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full cursor-ne-resize z-50 hover:bg-indigo-100 transition-colors"
        />
        <div
          onMouseDown={(e) => onResizeMouseDown?.(e, 'sw')}
          className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full cursor-sw-resize z-50 hover:bg-indigo-100 transition-colors"
        />
        <div
          onMouseDown={(e) => onResizeMouseDown?.(e, 'se')}
          className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full cursor-se-resize z-50 hover:bg-indigo-100 transition-colors"
        />
        {/* Edge handles */}
        <div
          onMouseDown={(e) => onResizeMouseDown?.(e, 'n')}
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white border-2 border-indigo-500 rounded-full cursor-n-resize z-50 hover:bg-indigo-100 transition-colors"
        />
        <div
          onMouseDown={(e) => onResizeMouseDown?.(e, 's')}
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white border-2 border-indigo-500 rounded-full cursor-s-resize z-50 hover:bg-indigo-100 transition-colors"
        />
        <div
          onMouseDown={(e) => onResizeMouseDown?.(e, 'w')}
          className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-8 bg-white border-2 border-indigo-500 rounded-full cursor-w-resize z-50 hover:bg-indigo-100 transition-colors"
        />
        <div
          onMouseDown={(e) => onResizeMouseDown?.(e, 'e')}
          className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-8 bg-white border-2 border-indigo-500 rounded-full cursor-e-resize z-50 hover:bg-indigo-100 transition-colors"
        />
        {/* Move indicator */}
        <div className="absolute top-2 left-2 bg-indigo-500 text-white p-1.5 rounded-md z-50 pointer-events-none">
          <Move className="w-3 h-3" />
        </div>
      </>
    )}
    
    <div
      style={{ borderRadius: `${imageSettings.borderRadius}px` }}
      className={`bg-slate-800 shadow-xl overflow-hidden border-2 border-white transform w-full h-full pointer-events-none
        ${activeLayout === 'overlay' ? 'border-none rounded-none' : ''}
      `}
    >
      {screenshot ? (
        <img src={screenshot} className="w-full h-full object-cover object-top" alt="Screenshot" draggable={false} />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900">
          <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center mb-2">
            <ImageIcon className="w-4 h-4 opacity-20" />
          </div>
          <span className="text-[8px] tracking-[0.2em] uppercase font-bold opacity-30">No Image</span>
        </div>
      )}
    </div>
  </div>
  );
};

// CanvasFooterCta removed - text elements are now fully editable placeholders

const CanvasArea = ({
  selectedFormat,
  activeLayout,
  borderRadius,
  showSafeZone,
  screenshot,
  canvasRef,
  textElements,
  selectedTextId,
  onSelectText,
  onUpdateText,
  onTextMouseDown,
  draggingId,
  formatChangeKey,
  imageSettings,
  isImageSelected,
  isImageDragging,
  isImageResizing,
  onImageMouseDown,
  onImageResizeMouseDown,
  onCanvasClick,
  deviceSettings,
  onDeviceSettingsChange,
}) => {
  // Calculate scale factor for preview display
  const getPreviewScale = () => {
    const maxHeight = window.innerHeight * 0.75; // 75vh max - increased for better visibility
    const maxWidth = window.innerWidth * 0.55; // 55vw max - increased for better visibility

    const scaleByWidth = maxWidth / selectedFormat.w;
    const scaleByHeight = maxHeight / selectedFormat.h;

    return Math.min(scaleByWidth, scaleByHeight, 1); // Never scale up, only down
  };

  const previewScale = getPreviewScale();

  return (
  <main 
    className="flex-1 bg-slate-100 p-8 md:p-12 overflow-y-auto flex items-center justify-center no-scrollbar relative"
    onClick={onCanvasClick}
  >
    <div className="relative group perspective-1000 transition-all duration-500">
      {/* Format indicator badge with animation */}
      <div
        key={formatChangeKey}
        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-200 flex items-center gap-2 z-50 animate-pulse"
        style={{ animationDuration: '0.5s', animationIterationCount: 1 }}
      >
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{selectedFormat.label}</span>
        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
        <span className="text-[10px] font-mono font-bold text-indigo-600">{selectedFormat.w} x {selectedFormat.h} px</span>
      </div>

      {/* Preview container - scales the canvas down for display */}
      <div style={{
        width: `${selectedFormat.w * previewScale}px`,
        height: `${selectedFormat.h * previewScale}px`,
        overflow: 'hidden',
        borderRadius: `${borderRadius * previewScale}px`,
        boxShadow: '0 40px 100px -20px rgba(0,0,0,0.15)',
      }}>
        <div
          ref={canvasRef}
          style={{
            borderRadius: `${borderRadius}px`,
            backgroundColor: 'white',
            width: `${selectedFormat.w}px`,
            height: `${selectedFormat.h}px`,
            transform: `scale(${previewScale})`,
            transformOrigin: 'top left',
          }}
          className="overflow-hidden relative border border-slate-100"
        >
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

        <div className={`relative z-10 w-full h-full p-4 md:p-6 flex transition-all duration-500
          ${activeLayout === 'split' && selectedFormat.id !== 'multi_device' ? 'flex-row items-center gap-4 text-left' : 'flex-col items-center text-center'}
          ${activeLayout === 'overlay' ? 'justify-end' : 'justify-center'}
        `}>
          <CanvasImageSection
            activeLayout={activeLayout}
            selectedFormat={selectedFormat}
            screenshot={screenshot}
            imageSettings={imageSettings}
            isSelected={isImageSelected}
            isDragging={isImageDragging}
            isResizing={isImageResizing}
            onMouseDown={onImageMouseDown}
            onResizeMouseDown={onImageResizeMouseDown}
            deviceSettings={deviceSettings}
            onDeviceSettingsChange={onDeviceSettingsChange}
          />
        </div>
        
        {/* Custom Text Elements */}
        {textElements.map((t) => {
          // Use actual font size - CSS transform handles preview scaling
          const segments = t.segments || [{ text: t.content, color: t.color }];

          // Card shape styles
          const getCardStyles = () => {
            if (!t.cardEnabled) return {};

            const shadowMap = {
              none: 'none',
              sm: '0 1px 2px rgba(0,0,0,0.05)',
              md: '0 4px 6px -1px rgba(0,0,0,0.1)',
              lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
              xl: '0 20px 25px -5px rgba(0,0,0,0.1)',
            };

            const borderRadiusMap = {
              rectangle: '4px',
              rounded: '12px',
              pill: '9999px',
              circle: '50%',
              hexagon: '12px',
              bubble: '16px 16px 16px 4px',
            };

            return {
              backgroundColor: t.cardBgColor || '#ffffff',
              border: `${t.cardBorderWidth || 1}px solid ${t.cardBorderColor || '#e2e8f0'}`,
              borderRadius: borderRadiusMap[t.cardShape] || '4px',
              boxShadow: shadowMap[t.cardShadow] || shadowMap.md,
              opacity: (t.cardOpacity || 100) / 100,
              padding: `${t.cardPadding || 16}px`,
            };
          };

          // Hexagon clip path
          const getClipPath = () => {
            if (t.cardEnabled && t.cardShape === 'hexagon') {
              return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
            }
            return 'none';
          };

          return (
          <div
            key={t.id}
            role="button"
            tabIndex={0}
            onMouseDown={(e) => onTextMouseDown(e, t.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectText(t.id); }}
            className={`absolute cursor-move select-none ${
              draggingId === t.id ? '' : 'transition-all'
            } ${
              selectedTextId === t.id ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:ring-2 hover:ring-indigo-300'
            }`}
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${t.fontSize}px`,
              fontWeight: t.fontWeight,
              fontStyle: t.fontStyle,
              textAlign: t.textAlign,
              fontFamily: t.fontFamily,
              padding: t.cardEnabled ? undefined : '4px 8px',
              borderRadius: t.cardEnabled ? undefined : '4px',
              zIndex: draggingId === t.id ? 50 : 40,
              whiteSpace: 'pre-wrap',
              maxWidth: '80%',
              userSelect: 'none',
              clipPath: getClipPath(),
              ...getCardStyles(),
            }}
          >
            {segments.map((seg, idx) => (
              <span key={`${t.id}-seg-${idx}-${seg.text.substring(0, 10)}`} style={{ color: seg.color }}>{seg.text}</span>
            ))}
          </div>
        )})}
        </div>
      </div>
    </div>
  </main>
  );
};

const App = () => {
  const [screenshot, setScreenshot] = useState(null);
  const [brandColor, setBrandColor] = useState('#4f46e5');
  const [borderRadius, setBorderRadius] = useState('16');
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [activeLayout, setActiveLayout] = useState('classic');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState('');

  // Text elements state - initialized with default placeholder texts
  // Font sizes are in pixels relative to 1920x1080 export canvas
  const [textElements, setTextElements] = useState([
    {
      id: 1,
      content: 'KICKS',
      segments: [{ text: 'KICKS', color: '#4f46e5' }],
      x: 50,
      y: 8,
      fontSize: 72,
      fontWeight: 'bold',
      fontStyle: 'italic',
      color: '#4f46e5',
      textAlign: 'center',
      fontFamily: "'Inter', sans-serif",
      cardEnabled: false,
      cardShape: 'rectangle',
      cardBgColor: '#ffffff',
      cardBorderColor: '#e2e8f0',
      cardBorderWidth: 1,
      cardPadding: 16,
      cardShadow: 'md',
      cardOpacity: 100,
      isPlaceholder: true,
    },
    {
      id: 2,
      content: 'STEP UP\nYOUR GAME.',
      segments: [{ text: 'STEP UP\nYOUR GAME.', color: '#0f172a' }],
      x: 50,
      y: 78,
      fontSize: 56,
      fontWeight: 'bold',
      fontStyle: 'normal',
      color: '#0f172a',
      textAlign: 'center',
      fontFamily: "'Inter', sans-serif",
      cardEnabled: false,
      cardShape: 'rectangle',
      cardBgColor: '#ffffff',
      cardBorderColor: '#e2e8f0',
      cardBorderWidth: 1,
      cardPadding: 16,
      cardShadow: 'md',
      cardOpacity: 100,
      isPlaceholder: true,
    },
    {
      id: 3,
      content: 'Discover our latest collection.',
      segments: [{ text: 'Discover our latest collection.', color: '#64748b' }],
      x: 50,
      y: 88,
      fontSize: 24,
      fontWeight: 'normal',
      fontStyle: 'normal',
      color: '#64748b',
      textAlign: 'center',
      fontFamily: "'Inter', sans-serif",
      cardEnabled: false,
      cardShape: 'rectangle',
      cardBgColor: '#ffffff',
      cardBorderColor: '#e2e8f0',
      cardBorderWidth: 1,
      cardPadding: 16,
      cardShadow: 'md',
      cardOpacity: 100,
      isPlaceholder: true,
    },
    {
      id: 4,
      content: 'EXPLORE',
      segments: [{ text: 'EXPLORE', color: '#ffffff' }],
      x: 50,
      y: 95,
      fontSize: 20,
      fontWeight: 'bold',
      fontStyle: 'normal',
      color: '#ffffff',
      textAlign: 'center',
      fontFamily: "'Inter', sans-serif",
      cardEnabled: true,
      cardShape: 'pill',
      cardBgColor: '#4f46e5',
      cardBorderColor: '#4f46e5',
      cardBorderWidth: 0,
      cardPadding: 24,
      cardShadow: 'lg',
      cardOpacity: 100,
      isPlaceholder: true,
    },
  ]);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [showTextPanel, setShowTextPanel] = useState(false);
  const [showImagePanel, setShowImagePanel] = useState(false);
  const [draggingId, setDraggingId] = useState(null);
  const [formatChangeKey, setFormatChangeKey] = useState(0);

  // Image container settings
  const [imageSettings, setImageSettings] = useState({
    x: 50,        // Center X position (%)
    y: 45,        // Center Y position (%)
    width: 85,    // Width (%)
    height: 60,   // Height (%)
    borderRadius: 12, // Border radius (px)
  });

  // Multi-device settings
  const [deviceSettings, setDeviceSettings] = useState({
    pc: { x: 50, y: 50, scale: 100, visible: true },
    tablet: { x: 15, y: 55, scale: 100, visible: true },
    smartphone: { x: 85, y: 60, scale: 100, visible: true },
  });

  // Image container interaction state
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isImageDragging, setIsImageDragging] = useState(false);
  const [isImageResizing, setIsImageResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);

  const canvasRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const imageStartRef = useRef({ x: 50, y: 45, width: 85, height: 60 });
  const textElementsRef = useRef(textElements);

  // Keep ref in sync with state
  React.useEffect(() => {
    textElementsRef.current = textElements;
  }, [textElements]);
  
  const addTextElement = () => {
    // Use timestamp to ensure unique IDs that don't conflict with initial placeholders
    const newText = {
      id: Date.now() + Math.random(),
      content: 'New Text',
      segments: [{ text: 'New Text', color: '#000000' }],
      x: 50,
      y: 50,
      fontSize: 48, // Larger default for 1920x1080 canvas
      fontWeight: 'bold',
      fontStyle: 'normal',
      color: '#000000',
      textAlign: 'center',
      fontFamily: "'Inter', sans-serif",
      // Card background properties
      cardEnabled: false,
      cardShape: 'rectangle', // rectangle, rounded, pill, circle, hexagon, bubble
      cardBgColor: '#ffffff',
      cardBorderColor: '#e2e8f0',
      cardBorderWidth: 1,
      cardPadding: 16,
      cardShadow: 'md', // none, sm, md, lg, xl
      cardOpacity: 100,
    };
    setTextElements([...textElements, newText]);
    setSelectedTextId(newText.id);
    setShowTextPanel(true);
  };

  const updateTextElement = (id, updates) => {
    setTextElements(textElements.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTextElement = (id) => {
    setTextElements(textElements.filter(t => t.id !== id));
    if (selectedTextId === id) {
      setSelectedTextId(null);
      setShowTextPanel(false);
    }
  };

  const handleTextMouseDown = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    if (!canvasRef.current) return;

    setDraggingId(id);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setSelectedTextId(id);
    setShowTextPanel(true);
    setIsImageSelected(false); // Deselect image when selecting text
  };

  React.useEffect(() => {
    if (!draggingId) return;

    const handleMouseMove = (e) => {
      if (!canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      const deltaXPercent = (deltaX / canvasRect.width) * 100;
      const deltaYPercent = (deltaY / canvasRect.height) * 100;

      setTextElements(prev => prev.map(t => {
        if (t.id === draggingId) {
          return {
            ...t,
            x: Math.max(0, Math.min(100, t.x + deltaXPercent)),
            y: Math.max(0, Math.min(100, t.y + deltaYPercent))
          };
        }
        return t;
      }));

      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setDraggingId(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId]);

  // Image container mouse handlers
  const handleImageMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!canvasRef.current) return;

    setIsImageSelected(true);
    setIsImageDragging(true);
    setSelectedTextId(null); // Deselect text when selecting image
    setShowTextPanel(false);
    setShowImagePanel(true); // Show image settings panel
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    imageStartRef.current = { ...imageSettings };
  };

  const handleImageResizeMouseDown = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    if (!canvasRef.current) return;

    setIsImageSelected(true);
    setIsImageResizing(true);
    setResizeDirection(direction);
    setSelectedTextId(null);
    setShowTextPanel(false);
    setShowImagePanel(true); // Show image settings panel
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    imageStartRef.current = { ...imageSettings };
  };

  const handleCanvasClick = (e) => {
    // Only deselect if clicking on the canvas background, not on elements
    if (e.target === e.currentTarget) {
      setIsImageSelected(false);
      setSelectedTextId(null);
      setShowTextPanel(false);
      setShowImagePanel(false);
    }
  };

  // Image dragging/resizing effect
  React.useEffect(() => {
    if (!isImageDragging && !isImageResizing) return;

    const handleMouseMove = (e) => {
      if (!canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      const deltaXPercent = (deltaX / canvasRect.width) * 100;
      const deltaYPercent = (deltaY / canvasRect.height) * 100;

      if (isImageDragging) {
        // Move the image
        setImageSettings(prev => ({
          ...prev,
          x: Math.max(10, Math.min(90, imageStartRef.current.x + deltaXPercent)),
          y: Math.max(10, Math.min(90, imageStartRef.current.y + deltaYPercent)),
        }));
      } else if (isImageResizing && resizeDirection) {
        // Resize the image based on direction
        let newWidth = imageStartRef.current.width;
        let newHeight = imageStartRef.current.height;
        let newX = imageStartRef.current.x;
        let newY = imageStartRef.current.y;

        // Handle horizontal resizing
        if (resizeDirection.includes('e')) {
          newWidth = Math.max(10, Math.min(100, imageStartRef.current.width + deltaXPercent * 2));
        }
        if (resizeDirection.includes('w')) {
          newWidth = Math.max(10, Math.min(100, imageStartRef.current.width - deltaXPercent * 2));
        }

        // Handle vertical resizing
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(10, Math.min(100, imageStartRef.current.height + deltaYPercent * 2));
        }
        if (resizeDirection.includes('n')) {
          newHeight = Math.max(10, Math.min(100, imageStartRef.current.height - deltaYPercent * 2));
        }

        setImageSettings(prev => ({
          ...prev,
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        }));
      }
    };

    const handleMouseUp = () => {
      setIsImageDragging(false);
      setIsImageResizing(false);
      setResizeDirection(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isImageDragging, isImageResizing, resizeDirection]);
  
  const selectedText = textElements.find(t => t.id === selectedTextId);
  
  const formats = [
    { id: 'multi_device', label: 'Multi-Device', ratio: 'aspect-[16/9]', w: 1920, h: 1080, icon: Layout, category: 'Marketing' },
    { id: 'fb_post', label: 'FB Post', ratio: 'aspect-[1.91/1]', w: 1200, h: 630, icon: Share2, category: 'Social' },
    { id: 'ig_square', label: 'IG Square', ratio: 'aspect-square', w: 1080, h: 1080, icon: Grid3X3, category: 'Social' },
    { id: 'ig_portrait', label: 'IG Portrait', ratio: 'aspect-[4/5]', w: 1080, h: 1350, icon: Grid3X3, category: 'Social' },
    { id: 'story', label: 'Story/TikTok', ratio: 'aspect-[9/16]', w: 1080, h: 1920, icon: Smartphone, category: 'Mobile' },
    { id: 'desktop', label: 'Web Banner', ratio: 'aspect-[16/9]', w: 1920, h: 1080, icon: Monitor, category: 'Web' },
  ];

  const [selectedFormat, setSelectedFormat] = useState(formats[0]);

  // Handle format change with visual feedback
  const handleFormatChange = useCallback((format) => {
    setSelectedFormat(format);
    setFormatChangeKey(prev => prev + 1);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => setScreenshot(f.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleExport = useCallback(async () => {
    if (!canvasRef.current) return;

    setIsExporting(true);
    setExportProgress('Preparing export...');

    try {
      const wasShowingSafeZone = showSafeZone;
      if (wasShowingSafeZone) setShowSafeZone(false);

      await new Promise(resolve => setTimeout(resolve, 150));

      setExportProgress('Generating image...');

      // Canvas is already at export size, just capture it
      const dataUrl = await toPng(canvasRef.current, {
        width: selectedFormat.w,
        height: selectedFormat.h,
        pixelRatio: 1, // Canvas is already at correct size
        backgroundColor: '#ffffff',
        style: {
          transform: 'none', // Remove preview scale transform for export
        }
      });

      setExportProgress('Saving file...');

      const fileName = `kicks-${selectedFormat.label.toLowerCase().replaceAll('/', '-').replaceAll(' ', '-')}-${Date.now()}.png`;
      saveAs(dataUrl, fileName);

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

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans flex flex-col">
      <HeaderBar
        showSafeZone={showSafeZone}
        setShowSafeZone={setShowSafeZone}
        isExporting={isExporting}
        exportProgress={exportProgress}
        handleExport={handleExport}
      />

      <div className="flex-1 flex overflow-hidden">
        <SidebarControls
          screenshot={screenshot}
          handleFileUpload={handleFileUpload}
          formats={formats}
          selectedFormat={selectedFormat}
          setSelectedFormat={handleFormatChange}
          activeLayout={activeLayout}
          setActiveLayout={setActiveLayout}
          brandColor={brandColor}
          setBrandColor={setBrandColor}
          borderRadius={borderRadius}
          setBorderRadius={setBorderRadius}
          textElements={textElements}
          selectedTextId={selectedTextId}
          onAddText={addTextElement}
          onSelectText={(id) => { setSelectedTextId(id); setShowTextPanel(true); setShowImagePanel(false); }}
          onDeleteText={deleteTextElement}
          deviceSettings={deviceSettings}
          setDeviceSettings={setDeviceSettings}
          onShowImagePanel={() => { setShowImagePanel(true); setShowTextPanel(false); }}
        />

        <CanvasArea
          selectedFormat={selectedFormat}
          activeLayout={activeLayout}
          borderRadius={borderRadius}
          showSafeZone={showSafeZone}
          screenshot={screenshot}
          canvasRef={canvasRef}
          textElements={textElements}
          selectedTextId={selectedTextId}
          onSelectText={(id) => { setSelectedTextId(id); setShowTextPanel(true); setIsImageSelected(false); setShowImagePanel(false); }}
          onUpdateText={updateTextElement}
          onTextMouseDown={handleTextMouseDown}
          draggingId={draggingId}
          formatChangeKey={formatChangeKey}
          imageSettings={imageSettings}
          isImageSelected={isImageSelected}
          isImageDragging={isImageDragging}
          isImageResizing={isImageResizing}
          onImageMouseDown={handleImageMouseDown}
          onImageResizeMouseDown={handleImageResizeMouseDown}
          onCanvasClick={handleCanvasClick}
          deviceSettings={deviceSettings}
          onDeviceSettingsChange={setDeviceSettings}
        />
        
        {/* Text Editor Panel */}
        {showTextPanel && selectedText && (
          <div className="w-72 bg-white border-l border-slate-200 p-4 space-y-4 overflow-y-auto flex-shrink-0 shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-slate-600 uppercase tracking-wider">Edit Text</p>
              <button onClick={() => setShowTextPanel(false)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Text Segments</label>
                <button
                  onClick={() => {
                    const segments = selectedText.segments || [{ text: selectedText.content, color: selectedText.color }];
                    updateTextElement(selectedTextId, {
                      segments: [...segments, { text: 'New', color: '#000000' }]
                    });
                  }}
                  className="flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-700 font-bold"
                >
                  <PlusCircle className="w-3 h-3" /> Add Segment
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(selectedText.segments || [{ text: selectedText.content, color: selectedText.color }]).map((seg, idx) => (
                  <div key={`segment-editor-${idx}-${seg.text.substring(0, 5)}`} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <input
                      type="text"
                      value={seg.text}
                      onChange={(e) => {
                        const segments = [...(selectedText.segments || [{ text: selectedText.content, color: selectedText.color }])];
                        segments[idx] = { ...segments[idx], text: e.target.value };
                        const newContent = segments.map(s => s.text).join('');
                        updateTextElement(selectedTextId, { segments, content: newContent });
                      }}
                      className="flex-1 p-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Text"
                    />
                    <input
                      type="color"
                      value={seg.color}
                      onChange={(e) => {
                        const segments = [...(selectedText.segments || [{ text: selectedText.content, color: selectedText.color }])];
                        segments[idx] = { ...segments[idx], color: e.target.value };
                        updateTextElement(selectedTextId, { segments });
                      }}
                      className="w-7 h-7 rounded cursor-pointer border border-slate-200"
                    />
                    {(selectedText.segments || []).length > 1 && (
                      <button
                        onClick={() => {
                          const segments = [...(selectedText.segments || [])];
                          segments.splice(idx, 1);
                          const newContent = segments.map(s => s.text).join('');
                          updateTextElement(selectedTextId, { segments, content: newContent });
                        }}
                        className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-slate-400 mt-1 flex items-center gap-1">
                <Palette className="w-3 h-3" /> Each segment can have a different color
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Font Size</label>
                <input
                  type="number"
                  value={selectedText.fontSize}
                  onChange={(e) => updateTextElement(selectedTextId, { fontSize: Number.parseInt(e.target.value) || 16 })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Default Color</label>
                <div className="flex items-center gap-1 p-1 border border-slate-200 rounded-lg">
                  <input
                    type="color"
                    value={selectedText.color}
                    onChange={(e) => updateTextElement(selectedTextId, { color: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-slate-500">{selectedText.color}</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Font Family</label>
              <select
                value={selectedText.fontFamily}
                onChange={(e) => updateTextElement(selectedTextId, { fontFamily: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                style={{ fontFamily: selectedText.fontFamily }}
              >
                <optgroup label="Sans Serif">
                  <option value="'Inter', sans-serif" style={{ fontFamily: "'Inter', sans-serif" }}>Inter</option>
                  <option value="'Roboto', sans-serif" style={{ fontFamily: "'Roboto', sans-serif" }}>Roboto</option>
                  <option value="'Poppins', sans-serif" style={{ fontFamily: "'Poppins', sans-serif" }}>Poppins</option>
                  <option value="'Montserrat', sans-serif" style={{ fontFamily: "'Montserrat', sans-serif" }}>Montserrat</option>
                  <option value="'Oswald', sans-serif" style={{ fontFamily: "'Oswald', sans-serif" }}>Oswald</option>
                  <option value="'Lato', sans-serif" style={{ fontFamily: "'Lato', sans-serif" }}>Lato</option>
                  <option value="'Open Sans', sans-serif" style={{ fontFamily: "'Open Sans', sans-serif" }}>Open Sans</option>
                  <option value="'Raleway', sans-serif" style={{ fontFamily: "'Raleway', sans-serif" }}>Raleway</option>
                </optgroup>
                <optgroup label="Display">
                  <option value="'Bebas Neue', sans-serif" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Bebas Neue</option>
                  <option value="'Playfair Display', serif" style={{ fontFamily: "'Playfair Display', serif" }}>Playfair Display</option>
                </optgroup>
                <optgroup label="Thai Fonts">
                  <option value="'Kanit', sans-serif" style={{ fontFamily: "'Kanit', sans-serif" }}>Kanit</option>
                  <option value="'Prompt', sans-serif" style={{ fontFamily: "'Prompt', sans-serif" }}>Prompt</option>
                  <option value="'Sarabun', sans-serif" style={{ fontFamily: "'Sarabun', sans-serif" }}>Sarabun</option>
                  <option value="'Noto Sans Thai', sans-serif" style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}>Noto Sans Thai</option>
                </optgroup>
                <optgroup label="System Fonts">
                  <option value="sans-serif">Sans Serif (System)</option>
                  <option value="serif">Serif (System)</option>
                  <option value="monospace">Monospace (System)</option>
                </optgroup>
              </select>
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Style</label>
              <div className="flex gap-1">
                <button
                  onClick={() => updateTextElement(selectedTextId, { fontWeight: selectedText.fontWeight === 'bold' ? 'normal' : 'bold' })}
                  className={`flex-1 p-2 rounded-lg border transition-all ${
                    selectedText.fontWeight === 'bold' ? 'bg-indigo-100 border-indigo-300 text-indigo-600' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Bold className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => updateTextElement(selectedTextId, { fontStyle: selectedText.fontStyle === 'italic' ? 'normal' : 'italic' })}
                  className={`flex-1 p-2 rounded-lg border transition-all ${
                    selectedText.fontStyle === 'italic' ? 'bg-indigo-100 border-indigo-300 text-indigo-600' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Italic className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Alignment</label>
              <div className="flex gap-1">
                <button
                  onClick={() => updateTextElement(selectedTextId, { textAlign: 'left' })}
                  className={`flex-1 p-2 rounded-lg border transition-all ${
                    selectedText.textAlign === 'left' ? 'bg-indigo-100 border-indigo-300 text-indigo-600' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <AlignLeft className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => updateTextElement(selectedTextId, { textAlign: 'center' })}
                  className={`flex-1 p-2 rounded-lg border transition-all ${
                    selectedText.textAlign === 'center' ? 'bg-indigo-100 border-indigo-300 text-indigo-600' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <AlignCenter className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => updateTextElement(selectedTextId, { textAlign: 'right' })}
                  className={`flex-1 p-2 rounded-lg border transition-all ${
                    selectedText.textAlign === 'right' ? 'bg-indigo-100 border-indigo-300 text-indigo-600' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <AlignRight className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Position X (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedText.x}
                  onChange={(e) => updateTextElement(selectedTextId, { x: Number.parseInt(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Position Y (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedText.y}
                  onChange={(e) => updateTextElement(selectedTextId, { y: Number.parseInt(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            {/* Card Background Section */}
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Square className="w-3 h-3" /> Card Background
                </label>
                <button
                  onClick={() => updateTextElement(selectedTextId, { cardEnabled: !selectedText.cardEnabled })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    selectedText.cardEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    selectedText.cardEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {selectedText.cardEnabled && (
                <div className="space-y-3">
                  {/* Card Shape */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Shape</label>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { id: 'rectangle', icon: Square, label: 'Rect' },
                        { id: 'rounded', icon: RectangleHorizontal, label: 'Rounded' },
                        { id: 'pill', icon: RectangleHorizontal, label: 'Pill' },
                        { id: 'circle', icon: Circle, label: 'Circle' },
                        { id: 'hexagon', icon: Hexagon, label: 'Hexagon' },
                        { id: 'bubble', icon: MessageSquare, label: 'Bubble' },
                      ].map((shape) => (
                        <button
                          key={shape.id}
                          onClick={() => updateTextElement(selectedTextId, { cardShape: shape.id })}
                          className={`p-2 rounded-lg border text-[9px] font-bold flex flex-col items-center gap-1 transition-all ${
                            selectedText.cardShape === shape.id
                              ? 'bg-indigo-100 border-indigo-300 text-indigo-600'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                          }`}
                        >
                          <shape.icon className="w-4 h-4" />
                          {shape.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card Colors */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Fill Color</label>
                      <div className="flex items-center gap-1 p-1 border border-slate-200 rounded-lg">
                        <input
                          type="color"
                          value={selectedText.cardBgColor || '#ffffff'}
                          onChange={(e) => updateTextElement(selectedTextId, { cardBgColor: e.target.value })}
                          className="w-6 h-6 rounded cursor-pointer"
                        />
                        <span className="text-[9px] font-mono text-slate-500">{selectedText.cardBgColor || '#ffffff'}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Border Color</label>
                      <div className="flex items-center gap-1 p-1 border border-slate-200 rounded-lg">
                        <input
                          type="color"
                          value={selectedText.cardBorderColor || '#e2e8f0'}
                          onChange={(e) => updateTextElement(selectedTextId, { cardBorderColor: e.target.value })}
                          className="w-6 h-6 rounded cursor-pointer"
                        />
                        <span className="text-[9px] font-mono text-slate-500">{selectedText.cardBorderColor || '#e2e8f0'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Border & Padding */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Border Width</label>
                      <input
                        type="range"
                        min="0"
                        max="8"
                        value={selectedText.cardBorderWidth || 1}
                        onChange={(e) => updateTextElement(selectedTextId, { cardBorderWidth: Number.parseInt(e.target.value) })}
                        className="w-full accent-indigo-600"
                      />
                      <span className="text-[9px] text-slate-400">{selectedText.cardBorderWidth || 1}px</span>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Padding</label>
                      <input
                        type="range"
                        min="4"
                        max="48"
                        value={selectedText.cardPadding || 16}
                        onChange={(e) => updateTextElement(selectedTextId, { cardPadding: Number.parseInt(e.target.value) })}
                        className="w-full accent-indigo-600"
                      />
                      <span className="text-[9px] text-slate-400">{selectedText.cardPadding || 16}px</span>
                    </div>
                  </div>

                  {/* Card Shadow */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Shadow</label>
                    <div className="flex gap-1">
                      {['none', 'sm', 'md', 'lg', 'xl'].map((shadow) => (
                        <button
                          key={shadow}
                          onClick={() => updateTextElement(selectedTextId, { cardShadow: shadow })}
                          className={`flex-1 p-1.5 rounded border text-[9px] font-bold transition-all ${
                            (selectedText.cardShadow || 'md') === shadow
                              ? 'bg-indigo-100 border-indigo-300 text-indigo-600'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                          }`}
                        >
                          {shadow.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card Opacity */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Opacity</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={selectedText.cardOpacity || 100}
                      onChange={(e) => updateTextElement(selectedTextId, { cardOpacity: Number.parseInt(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                    <span className="text-[9px] text-slate-400">{selectedText.cardOpacity || 100}%</span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => deleteTextElement(selectedTextId)}
              className="w-full p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2 text-xs font-bold"
            >
              <Trash2 className="w-4 h-4" />
              Delete Text
            </button>
          </div>
        )}

        {/* Image Settings Panel */}
        {(isImageSelected || showImagePanel) && (
          <ImageSettingsPanel
            imageSettings={imageSettings}
            setImageSettings={setImageSettings}
            onClose={() => { setIsImageSelected(false); setShowImagePanel(false); }}
          />
        )}
      </div>

      <footer className="h-10 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-xs text-slate-400">
        <span>© 2026 KICKS ProBuilder</span>
        <span>Made with ❤️ for marketers</span>
      </footer>
    </div>
  );
};

export default App;
