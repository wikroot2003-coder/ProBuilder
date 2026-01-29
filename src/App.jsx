/* eslint-disable react/prop-types */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Smartphone, Monitor, Image as ImageIcon,
  Download, Loader2, Layout,
  Share2, Grid3X3, Eye, EyeOff,
  Type, Trash2, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Plus, X,
  Palette, PlusCircle, Square, Circle, RectangleHorizontal, Hexagon, MessageSquare,
  Move, Tablet, Menu, ChevronLeft, FileImage, FileText
} from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import MultiDevicePreview, { DEVICE_FRAMES } from './MultiDevicePreview';

const HeaderBar = ({ showSafeZone, setShowSafeZone, isExporting, exportProgress, onExportClick, onMenuClick, isMobile }) => (
  <nav className="h-14 sm:h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-50">
    <div className="flex items-center gap-2 sm:gap-3">
      {isMobile && (
        <button
          onClick={onMenuClick}
          className="p-2 -ml-1 rounded-lg hover:bg-slate-100 transition-colors touch-target-sm"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
      )}
      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
        <Layout className="text-white w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <h1 className="font-bold text-lg sm:text-xl tracking-tight">
        <span className="hidden sm:inline">KICKS </span>
        <span className="text-indigo-600">ProBuilder</span>
      </h1>
    </div>

    <div className="flex items-center gap-2 sm:gap-4">
      <div className="hidden sm:flex bg-slate-100 p-1 rounded-lg border border-slate-200">
        <button 
          onClick={() => setShowSafeZone(!showSafeZone)}
          className={`p-1.5 rounded-md transition-all touch-target-sm ${showSafeZone ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
          title="Toggle Safe Zones"
        >
          {showSafeZone ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>
      <button 
        onClick={onExportClick}
        disabled={isExporting}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-3 sm:px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95 disabled:active:scale-100"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="hidden sm:inline">{exportProgress}</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Assets</span>
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
  deviceScreenshots,
  onDeviceFileUpload,
  onClearDeviceScreenshot,
  canvasBg,
  setCanvasBg,
  onShowImagePanel,
  isOpen,
  onClose,
}) => (
  <>
    {/* Mobile overlay - only render when open */}
    {isOpen && (
      <button 
        type="button"
        className="fixed inset-0 bg-black/50 z-40 md:hidden border-0 p-0"
        onClick={onClose}
        aria-label="Close sidebar"
      />
    )}
    
    <aside className={`w-72 sm:w-80 bg-white border-r border-slate-200 overflow-y-auto p-4 sm:p-5 space-y-6 sm:space-y-8 sidebar-scrollbar shadow-lg flex-shrink-0
      md:static md:h-full md:translate-x-0 md:z-auto
      fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Mobile close button */}
      <div className="flex items-center justify-between md:hidden mb-4">
        <h2 className="font-bold text-lg text-slate-700">Controls</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close sidebar"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
      </div>
      
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">1. Content Assets</p>
      <div className="space-y-3">
        <label className="group relative flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all overflow-hidden bg-slate-50">
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
              <div
                key={t.id}
                className={`w-full flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                  selectedTextId === t.id ? 'bg-indigo-100 border border-indigo-300' : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectText(t.id)}
                  className="flex items-center gap-2 flex-1 min-w-0 bg-transparent border-0 p-0 text-left cursor-pointer"
                >
                  <Type className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span className="text-[11px] font-medium text-slate-600 truncate">{t.content}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onDeleteText(t.id); }}
                  className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-500 transition-colors"
                  aria-label="Delete text element"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
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

    {/* Background Settings - Available for all formats */}
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">6. Background</p>
      <div className="p-4 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
        {/* Background Type Selector */}
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => setCanvasBg(prev => ({ ...prev, type: 'solid' }))}
            className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${
              canvasBg?.type === 'solid'
                ? 'bg-indigo-100 border-indigo-300 text-indigo-600'
                : 'border-slate-200 hover:bg-slate-50 text-slate-500'
            }`}
          >
            Solid
          </button>
          <button
            onClick={() => setCanvasBg(prev => ({ ...prev, type: 'transparent' }))}
            className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${
              canvasBg?.type === 'transparent'
                ? 'bg-indigo-100 border-indigo-300 text-indigo-600'
                : 'border-slate-200 hover:bg-slate-50 text-slate-500'
            }`}
          >
            None
          </button>
          <button
            onClick={() => setCanvasBg(prev => ({ ...prev, type: 'image' }))}
            className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${
              canvasBg?.type === 'image'
                ? 'bg-indigo-100 border-indigo-300 text-indigo-600'
                : 'border-slate-200 hover:bg-slate-50 text-slate-500'
            }`}
          >
            Image
          </button>
        </div>

        {/* Solid Color Picker */}
        {canvasBg?.type === 'solid' && (
          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-slate-600">Color</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border-2 border-slate-200 shadow-sm overflow-hidden">
                <input 
                  type="color" 
                  value={canvasBg?.color || '#ffffff'} 
                  onChange={(e) => setCanvasBg(prev => ({ ...prev, color: e.target.value }))}
                  className="w-10 h-10 -m-2 cursor-pointer"
                />
              </div>
              <span className="text-xs font-mono text-slate-500">{canvasBg?.color || '#ffffff'}</span>
            </div>
          </div>
        )}

        {/* Transparent Info */}
        {canvasBg?.type === 'transparent' && (
          <div className="p-3 bg-white rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-6 h-6 rounded bg-[repeating-conic-gradient(#ccc_0_25%,#fff_0_50%)] bg-[length:8px_8px]" />
              <span className="text-xs font-bold">Transparent Background</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Export will have transparent background (PNG only)
            </p>
          </div>
        )}

        {/* Image Upload */}
        {canvasBg?.type === 'image' && (
          <div className="space-y-2">
            <label className="group relative flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all overflow-hidden bg-white">
              {canvasBg?.image ? (
                <>
                  <img src={canvasBg.image} className="w-full h-full object-cover opacity-70" alt="Background" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                    <ImageIcon className="w-5 h-5 text-white mb-1" />
                    <span className="text-[10px] text-white font-bold">Change Image</span>
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 mb-1" />
                  <span className="text-[10px] text-slate-500 font-bold">Upload Background</span>
                  <span className="text-[9px] text-slate-400">PNG, JPG, WEBP</span>
                </>
              )}
              <input 
                type="file" 
                className="hidden" 
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (f) => setCanvasBg(prev => ({ ...prev, image: f.target.result }));
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
            {canvasBg?.image && (
              <>
                {/* Image Fit Options */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-600 block">Image Fit</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCanvasBg(prev => ({ ...prev, imageFit: 'cover' }))}
                      className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${
                        canvasBg?.imageFit === 'cover'
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      Cover
                    </button>
                    <button
                      onClick={() => setCanvasBg(prev => ({ ...prev, imageFit: 'contain' }))}
                      className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${
                        canvasBg?.imageFit === 'contain'
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      Contain
                    </button>
                    <button
                      onClick={() => setCanvasBg(prev => ({ ...prev, imageFit: 'fill' }))}
                      className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${
                        canvasBg?.imageFit === 'fill'
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      Fill
                    </button>
                    <button
                      onClick={() => setCanvasBg(prev => ({ ...prev, imageFit: 'tile' }))}
                      className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${
                        canvasBg?.imageFit === 'tile'
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      Tile
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setCanvasBg(prev => ({ ...prev, image: null }))}
                  className="w-full p-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                >
                  Remove Background
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Multi-Device Settings - Only show when Multi-Device format is selected */}
    {selectedFormat.id === 'multi_device' && (
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">7. Device Frames</p>
        <div className="p-4 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
          {/* PC Frame Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-600">PC / Laptop</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <span className="sr-only">Toggle PC Frame visibility</span>
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
            {/* PC Device Image Upload */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500">Device Image</span>
                {deviceScreenshots?.pc && (
                  <button
                    onClick={() => onClearDeviceScreenshot('pc')}
                    className="text-[9px] text-red-500 hover:text-red-600"
                  >
                    Clear
                  </button>
                )}
              </div>
              <label className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                {deviceScreenshots?.pc ? (
                  <>
                    <img src={deviceScreenshots.pc} className="w-8 h-8 object-cover rounded" alt="" />
                    <span className="text-[10px] text-slate-600 truncate flex-1">Custom image</span>
                  </>
                ) : (
                  <>
                    <FileImage className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] text-slate-500">Use shared image</span>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  onChange={(e) => onDeviceFileUpload(e, 'pc')}
                />
              </label>
            </div>
          </div>

          {/* Tablet Frame Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tablet className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-600">Tablet</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <span className="sr-only">Toggle Tablet Frame visibility</span>
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
            {/* Tablet Device Image Upload */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500">Device Image</span>
                {deviceScreenshots?.tablet && (
                  <button
                    onClick={() => onClearDeviceScreenshot('tablet')}
                    className="text-[9px] text-red-500 hover:text-red-600"
                  >
                    Clear
                  </button>
                )}
              </div>
              <label className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                {deviceScreenshots?.tablet ? (
                  <>
                    <img src={deviceScreenshots.tablet} className="w-8 h-8 object-cover rounded" alt="" />
                    <span className="text-[10px] text-slate-600 truncate flex-1">Custom image</span>
                  </>
                ) : (
                  <>
                    <FileImage className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] text-slate-500">Use shared image</span>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  onChange={(e) => onDeviceFileUpload(e, 'tablet')}
                />
              </label>
            </div>
          </div>

          {/* Smartphone Frame Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-600">Smartphone</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <span className="sr-only">Toggle Smartphone Frame visibility</span>
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
            {/* Smartphone Device Image Upload */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500">Device Image</span>
                {deviceScreenshots?.smartphone && (
                  <button
                    onClick={() => onClearDeviceScreenshot('smartphone')}
                    className="text-[9px] text-red-500 hover:text-red-600"
                  >
                    Clear
                  </button>
                )}
              </div>
              <label className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                {deviceScreenshots?.smartphone ? (
                  <>
                    <img src={deviceScreenshots.smartphone} className="w-8 h-8 object-cover rounded" alt="" />
                    <span className="text-[10px] text-slate-600 truncate flex-1">Custom image</span>
                  </>
                ) : (
                  <>
                    <FileImage className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] text-slate-500">Use shared image</span>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  onChange={(e) => onDeviceFileUpload(e, 'smartphone')}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    )}
  </aside>
  </>
);

// Image Settings Panel - shows when image is selected
const ImageSettingsPanel = ({ imageSettings, setImageSettings, onClose }) => (
  <div className="w-64 sm:w-72 bg-white border-l border-slate-200 p-3 sm:p-4 space-y-4 overflow-y-auto flex-shrink-0 shadow-lg
    fixed md:relative right-0 top-0 h-full md:h-auto z-50 md:z-10
    animate-slide-up md:animate-none
  ">
    <div className="flex items-center justify-between">
      <p className="text-xs font-black text-slate-600 uppercase tracking-wider">Image Settings</p>
      <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
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

// Export Format Modal
const ExportModal = ({ isOpen, onClose, onExport, selectedFormat, isExporting, exportProgress }) => {
  const [selectedExportFormat, setSelectedExportFormat] = useState('png');
  const [jpgQuality, setJpgQuality] = useState(90);
  const [pixelRatio, setPixelRatio] = useState(2);

  const qualityOptions = [
    { value: 1, label: '1x Standard', desc: 'Smaller file' },
    { value: 2, label: '2x Retina', desc: 'Recommended' },
    { value: 3, label: '3x High DPI', desc: 'Maximum quality' },
  ];

  const MAX_PIXELS = 50_000_000; // ~50MP limit to prevent crashes

  // Calculate if a pixelRatio option would exceed memory limit
  const getPixelCount = (ratio) => selectedFormat.w * ratio * selectedFormat.h * ratio;
  const isOptionDisabled = (ratio) => getPixelCount(ratio) > MAX_PIXELS;

  if (!isOpen) return null;

  const exportFormats = [
    { id: 'png', label: 'PNG', desc: 'Lossless, transparent background support', icon: FileImage, recommended: true },
    { id: 'jpg', label: 'JPG', desc: 'Smaller file size, best for photos', icon: FileImage },
    { id: 'pdf', label: 'PDF', desc: 'Print-ready document format', icon: FileText },
  ];

  return (
    <>
      {/* Backdrop */}
      <button 
        type="button"
        className="fixed inset-0 bg-black/50 z-[100] animate-fade-in border-0 p-0 cursor-default"
        onClick={onClose}
        aria-label="Close export modal"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto animate-scale-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200">
            <div>
              <h2 id="export-modal-title" className="text-lg font-bold text-slate-800">Export Assets</h2>
              <p className="text-xs text-slate-500 mt-0.5">{selectedFormat.label} • {selectedFormat.w} x {selectedFormat.h}px</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              disabled={isExporting}
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Select Format</p>
              <div className="space-y-2">
                {exportFormats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedExportFormat(format.id)}
                    disabled={isExporting}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                      selectedExportFormat === format.id 
                        ? 'border-indigo-600 bg-indigo-50' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedExportFormat === format.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <format.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${selectedExportFormat === format.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                          {format.label}
                        </span>
                        {format.recommended && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded-full">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{format.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedExportFormat === format.id 
                        ? 'border-indigo-600 bg-indigo-600' 
                        : 'border-slate-300'
                    }`}>
                      {selectedExportFormat === format.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* JPG Quality Slider */}
            {selectedExportFormat === 'jpg' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-600">Quality</span>
                  <span className="text-indigo-600">{jpgQuality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={jpgQuality}
                  onChange={(e) => setJpgQuality(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  disabled={isExporting}
                />
                <p className="text-[10px] text-slate-400 mt-2">
                  Higher quality = larger file size
                </p>
              </div>
            )}

            {/* Export Resolution/Quality Selector */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex justify-between text-xs font-bold mb-3">
                <span className="text-slate-600">Export Resolution</span>
                <span className="text-indigo-600">{selectedFormat.w * pixelRatio} x {selectedFormat.h * pixelRatio}px</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {qualityOptions.map((option) => {
                  const disabled = isOptionDisabled(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => !disabled && setPixelRatio(option.value)}
                      disabled={isExporting || disabled}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        pixelRatio === option.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : disabled
                            ? 'border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed'
                            : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className={`text-xs font-bold block ${pixelRatio === option.value ? 'text-indigo-700' : 'text-slate-700'}`}>
                        {option.label}
                      </span>
                      <span className="text-[9px] text-slate-400">{option.desc}</span>
                      {disabled && <span className="text-[8px] text-red-500 block">Too large</span>}
                    </button>
                  );
                })}
              </div>
              {getPixelCount(pixelRatio) > 20_000_000 && !isOptionDisabled(pixelRatio) && (
                <p className="text-[10px] text-amber-600 mt-2">
                  Large export - may take longer on some devices
                </p>
              )}
            </div>

            {/* Export Progress */}
            {isExporting && (
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                  <span className="text-sm font-medium text-indigo-700">{exportProgress}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-slate-200 flex gap-3">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onExport(selectedExportFormat, jpgQuality, pixelRatio)}
              disabled={isExporting}
              className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:bg-indigo-400"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export {selectedExportFormat.toUpperCase()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

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
  deviceScreenshots,
  canvasBg,
}) => {
  // For multi_device format, render without wrapper to allow individual device interaction
  if (selectedFormat.id === 'multi_device') {
    return (
      <div className={`absolute inset-0 w-full h-full ${activeLayout === 'overlay' ? 'opacity-80 scale-110' : ''}`}>
        <MultiDevicePreview
          screenshot={screenshot}
          deviceScreenshots={deviceScreenshots}
          deviceSettings={deviceSettings}
          onDeviceSettingsChange={onDeviceSettingsChange}
          backgroundSettings={canvasBg}
        />
      </div>
    );
  }

  return (
  <button
    type="button"
    onMouseDown={onMouseDown}
    onTouchStart={onMouseDown}
    onClick={(e) => e.stopPropagation()}
    className={`absolute flex items-center justify-center select-none p-0 bg-transparent border-0
      ${activeLayout === 'overlay' ? 'inset-0 w-full h-full pointer-events-none' : 'cursor-move'}
      ${isDragging || isResizing ? '' : 'transition-all duration-300'}
      ${isSelected && activeLayout !== 'overlay' ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
      ${isSelected || activeLayout === 'overlay' ? '' : 'hover:ring-2 hover:ring-indigo-300'}
    `}
    style={activeLayout === 'overlay' ? undefined : {
      left: `${imageSettings.x}%`,
      top: `${imageSettings.y}%`,
      transform: 'translate(-50%, -50%)',
      width: `${imageSettings.width}%`,
      height: `${imageSettings.height}%`,
      zIndex: isDragging || isResizing ? 35 : 30,
    }}
    aria-label="Drag to move image"
  >
    {/* Resize Handles - only show when selected and not in overlay mode */}
    {isSelected && activeLayout !== 'overlay' && (
      <>
        {/* Corner handles */}
        <button
          type="button"
          onMouseDown={(e) => onResizeMouseDown?.(e, 'nw')}
          onClick={(e) => e.stopPropagation()}
          aria-label="Resize from top-left corner"
          className="absolute -top-2 -left-2 w-4 h-4 p-0 bg-white border-2 border-indigo-500 rounded-full cursor-nw-resize z-50 hover:bg-indigo-100 transition-colors"
        />
        <button
          type="button"
          onMouseDown={(e) => onResizeMouseDown?.(e, 'ne')}
          onClick={(e) => e.stopPropagation()}
          aria-label="Resize from top-right corner"
          className="absolute -top-2 -right-2 w-4 h-4 p-0 bg-white border-2 border-indigo-500 rounded-full cursor-ne-resize z-50 hover:bg-indigo-100 transition-colors"
        />
        <button
          type="button"
          onMouseDown={(e) => onResizeMouseDown?.(e, 'sw')}
          onClick={(e) => e.stopPropagation()}
          aria-label="Resize from bottom-left corner"
          className="absolute -bottom-2 -left-2 w-4 h-4 p-0 bg-white border-2 border-indigo-500 rounded-full cursor-sw-resize z-50 hover:bg-indigo-100 transition-colors"
        />
        <button
          type="button"
          onMouseDown={(e) => onResizeMouseDown?.(e, 'se')}
          onClick={(e) => e.stopPropagation()}
          aria-label="Resize from bottom-right corner"
          className="absolute -bottom-2 -right-2 w-4 h-4 p-0 bg-white border-2 border-indigo-500 rounded-full cursor-se-resize z-50 hover:bg-indigo-100 transition-colors"
        />
        {/* Edge handles */}
        <button
          type="button"
          onMouseDown={(e) => onResizeMouseDown?.(e, 'n')}
          onClick={(e) => e.stopPropagation()}
          aria-label="Resize from top edge"
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-3 p-0 bg-white border-2 border-indigo-500 rounded-full cursor-n-resize z-50 hover:bg-indigo-100 transition-colors"
        />
        <button
          type="button"
          onMouseDown={(e) => onResizeMouseDown?.(e, 's')}
          onClick={(e) => e.stopPropagation()}
          aria-label="Resize from bottom edge"
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-3 p-0 bg-white border-2 border-indigo-500 rounded-full cursor-s-resize z-50 hover:bg-indigo-100 transition-colors"
        />
        <button
          type="button"
          onMouseDown={(e) => onResizeMouseDown?.(e, 'w')}
          onClick={(e) => e.stopPropagation()}
          aria-label="Resize from left edge"
          className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-8 p-0 bg-white border-2 border-indigo-500 rounded-full cursor-w-resize z-50 hover:bg-indigo-100 transition-colors"
        />
        <button
          type="button"
          onMouseDown={(e) => onResizeMouseDown?.(e, 'e')}
          onClick={(e) => e.stopPropagation()}
          aria-label="Resize from right edge"
          className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-8 p-0 bg-white border-2 border-indigo-500 rounded-full cursor-e-resize z-50 hover:bg-indigo-100 transition-colors"
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
  </button>
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
  deviceScreenshots,
  canvasBg,
}) => {
  // Calculate scale factor for preview display - responsive for all devices
  const getPreviewScale = () => {
    const isMobile = globalThis.innerWidth < 768;
    const isTablet = globalThis.innerWidth >= 768 && globalThis.innerWidth < 1024;
    
    // Adjust max dimensions based on device type
    let maxHeight = globalThis.innerHeight * 0.75;  // 75vh for desktop (default)
    if (isMobile) {
      maxHeight = globalThis.innerHeight * 0.5;  // 50vh for mobile
    } else if (isTablet) {
      maxHeight = globalThis.innerHeight * 0.6;  // 60vh for tablet
    }
        
    let maxWidth = globalThis.innerWidth * 0.55;  // 55vw for desktop (default)
    if (isMobile) {
      maxWidth = globalThis.innerWidth * 0.9;  // 90vw for mobile
    } else if (isTablet) {
      maxWidth = globalThis.innerWidth * 0.7;  // 70vw for tablet
    }

    const scaleByWidth = maxWidth / selectedFormat.w;
    const scaleByHeight = maxHeight / selectedFormat.h;

    return Math.min(scaleByWidth, scaleByHeight, 1); // Never scale up, only down
  };

  const previewScale = getPreviewScale();

  // Generate background style based on canvasBg settings
  const getCanvasBackgroundStyle = () => {
    if (!canvasBg) return { backgroundColor: 'white' };
    
    if (canvasBg.type === 'transparent') {
      return {
        backgroundColor: 'transparent',
        backgroundImage: 'repeating-conic-gradient(#e2e8f0 0% 25%, transparent 0% 50%)',
        backgroundSize: '20px 20px',
      };
    }
    if (canvasBg.type === 'image' && canvasBg.image) {
      const imageFit = canvasBg.imageFit || 'cover';
      
      if (imageFit === 'tile') {
        return {
          backgroundImage: `url(${canvasBg.image})`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          backgroundPosition: 'top left',
        };
      }
      
      // For cover, contain, fill
      const sizeMap = {
        cover: 'cover',
        contain: 'contain',
        fill: '100% 100%',
      };
      
      return {
        backgroundImage: `url(${canvasBg.image})`,
        backgroundSize: sizeMap[imageFit] || 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    return { backgroundColor: canvasBg.color || '#ffffff' };
  };

  return (
  <main 
    className="flex-1 bg-slate-100 p-2 sm:p-4 md:p-8 lg:p-12 overflow-auto flex items-center justify-center canvas-scrollbar relative"
    aria-label="Canvas preview area"
  >
    <div className="relative group perspective-1000 transition-all duration-500 z-10">
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
          onMouseDown={onCanvasClick}
          style={{
            borderRadius: `${borderRadius}px`,
            ...getCanvasBackgroundStyle(),
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

        <div 
          className={`relative z-10 w-full h-full p-4 md:p-6 flex transition-all duration-500
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
            deviceScreenshots={deviceScreenshots}
            canvasBg={canvasBg}
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
          <button
            key={t.id}
            type="button"
            onMouseDown={(e) => onTextMouseDown(e, t.id)}
            onTouchStart={(e) => onTextMouseDown(e, t.id)}
            onClick={(e) => e.stopPropagation()}
            className={`absolute cursor-move select-none border-0 bg-transparent ${
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
          </button>
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
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(globalThis.innerWidth < 768);
    };
    
    checkMobile();
    globalThis.addEventListener('resize', checkMobile);
    
    return () => globalThis.removeEventListener('resize', checkMobile);
  }, []);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setIsSidebarOpen(false);
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMobile, isSidebarOpen]);

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

  // Device-specific screenshots (per-device images)
  const [deviceScreenshots, setDeviceScreenshots] = useState({
    pc: null,
    tablet: null,
    smartphone: null,
  });

  // Canvas background settings (for all formats)
  const [canvasBg, setCanvasBg] = useState({
    type: 'solid', // 'solid', 'transparent', 'image'
    color: '#ffffff',
    image: null,
    imageFit: 'cover', // 'cover', 'contain', 'fill', 'tile'
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

  // Helper function to update text position during drag
  const updateTextPosition = (id, deltaXPercent, deltaYPercent) => {
    setTextElements(prev => prev.map(t => 
      t.id === id 
        ? { ...t, x: Math.max(0, Math.min(100, t.x + deltaXPercent)), y: Math.max(0, Math.min(100, t.y + deltaYPercent)) }
        : t
    ));
  };

  const deleteTextElement = (id) => {
    setTextElements(textElements.filter(t => t.id !== id));
    if (selectedTextId === id) {
      setSelectedTextId(null);
      setShowTextPanel(false);
    }
  };

  // Handle both mouse and touch events for text dragging
  const handleTextMouseDown = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    if (!canvasRef.current) return;

    // Get position from touch or mouse event
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setDraggingId(id);
    dragStartRef.current = { x: clientX, y: clientY };
    setSelectedTextId(id);
    setShowTextPanel(true);
    setIsImageSelected(false); // Deselect image when selecting text
  };

  React.useEffect(() => {
    if (!draggingId) return;

    const handleMouseMove = (e) => {
      if (!canvasRef.current) return;

      // Get position from touch or mouse event
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const deltaX = clientX - dragStartRef.current.x;
      const deltaY = clientY - dragStartRef.current.y;

      const deltaXPercent = (deltaX / canvasRect.width) * 100;
      const deltaYPercent = (deltaY / canvasRect.height) * 100;

      updateTextPosition(draggingId, deltaXPercent, deltaYPercent);

      dragStartRef.current = { x: clientX, y: clientY };
    };

    const handleMouseUp = () => {
      setDraggingId(null);
    };

    // Add both mouse and touch event listeners
    globalThis.addEventListener('mousemove', handleMouseMove);
    globalThis.addEventListener('mouseup', handleMouseUp);
    globalThis.addEventListener('touchmove', handleMouseMove, { passive: false });
    globalThis.addEventListener('touchend', handleMouseUp);

    return () => {
      globalThis.removeEventListener('mousemove', handleMouseMove);
      globalThis.removeEventListener('mouseup', handleMouseUp);
      globalThis.removeEventListener('touchmove', handleMouseMove);
      globalThis.removeEventListener('touchend', handleMouseUp);
    };
  }, [draggingId]);

  // Image container mouse handlers
  // Handle both mouse and touch events for image dragging
  const handleImageMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!canvasRef.current) return;

    // Get position from touch or mouse event
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setIsImageSelected(true);
    setIsImageDragging(true);
    setSelectedTextId(null); // Deselect text when selecting image
    setShowTextPanel(false);
    setShowImagePanel(true); // Show image settings panel
    dragStartRef.current = { x: clientX, y: clientY };
    imageStartRef.current = { ...imageSettings };
  };

  const handleImageResizeMouseDown = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    if (!canvasRef.current) return;

    // Get position from touch or mouse event
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setIsImageSelected(true);
    setIsImageResizing(true);
    setResizeDirection(direction);
    setSelectedTextId(null);
    setShowTextPanel(false);
    setShowImagePanel(true); // Show image settings panel
    dragStartRef.current = { x: clientX, y: clientY };
    imageStartRef.current = { ...imageSettings };
  };

  const handleCanvasClick = (e) => {
    // Deselect all elements when clicking on canvas background
    // Elements that should remain selected will call stopPropagation
    setIsImageSelected(false);
    setSelectedTextId(null);
    setShowTextPanel(false);
    setShowImagePanel(false);
  };

  // Image dragging/resizing effect
  React.useEffect(() => {
    if (!isImageDragging && !isImageResizing) return;

    const handleMouseMove = (e) => {
      if (!canvasRef.current) return;

      // Get position from touch or mouse event
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const deltaX = clientX - dragStartRef.current.x;
      const deltaY = clientY - dragStartRef.current.y;

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
          // Resize from right edge - expand right
          newWidth = Math.max(10, Math.min(100, imageStartRef.current.width + deltaXPercent));
        }
        if (resizeDirection.includes('w')) {
          // Resize from left edge - expand left, move center left
          newWidth = Math.max(10, Math.min(100, imageStartRef.current.width - deltaXPercent));
          newX = imageStartRef.current.x + deltaXPercent / 2;
        }

        // Handle vertical resizing
        if (resizeDirection.includes('s')) {
          // Resize from bottom edge - expand down
          newHeight = Math.max(10, Math.min(100, imageStartRef.current.height + deltaYPercent));
        }
        if (resizeDirection.includes('n')) {
          // Resize from top edge - expand up, move center up
          newHeight = Math.max(10, Math.min(100, imageStartRef.current.height - deltaYPercent));
          newY = imageStartRef.current.y + deltaYPercent / 2;
        }

        // Clamp position values
        newX = Math.max(5, Math.min(95, newX));
        newY = Math.max(5, Math.min(95, newY));

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

    // Add both mouse and touch event listeners
    globalThis.addEventListener('mousemove', handleMouseMove);
    globalThis.addEventListener('mouseup', handleMouseUp);
    globalThis.addEventListener('touchmove', handleMouseMove, { passive: false });
    globalThis.addEventListener('touchend', handleMouseUp);

    return () => {
      globalThis.removeEventListener('mousemove', handleMouseMove);
      globalThis.removeEventListener('mouseup', handleMouseUp);
      globalThis.removeEventListener('touchmove', handleMouseMove);
      globalThis.removeEventListener('touchend', handleMouseUp);
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

  // Handle device-specific image upload
  const handleDeviceFileUpload = (e, deviceType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => {
        setDeviceScreenshots(prev => ({
          ...prev,
          [deviceType]: f.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear device-specific screenshot
  const clearDeviceScreenshot = (deviceType) => {
    setDeviceScreenshots(prev => ({
      ...prev,
      [deviceType]: null
    }));
  };

  // Utility: Wait for fonts and images to be ready before export
  const waitForResources = async (element, timeout = 3000) => {
    // Wait for fonts
    if (document.fonts?.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise(r => setTimeout(r, timeout))
      ]);
    }
    // Wait for images within the element
    const images = element.querySelectorAll('img');
    await Promise.all(Array.from(images).map(img =>
      img.complete ? Promise.resolve() : new Promise(r => {
        const timeoutId = setTimeout(r, timeout);
        img.onload = () => { clearTimeout(timeoutId); r(); };
        img.onerror = () => { clearTimeout(timeoutId); r(); };
      })
    ));
    // Brief settle time for CSS transitions
    await new Promise(r => setTimeout(r, 100));
  };

  const handleExport = useCallback(async (exportFormat = 'png', jpgQuality = 90, pixelRatioValue = 2) => {
    if (!canvasRef.current) return;

    setIsExporting(true);
    setExportProgress('Preparing export...');

    try {
      const wasShowingSafeZone = showSafeZone;
      if (wasShowingSafeZone) setShowSafeZone(false);

      // Wait for React state update
      await new Promise(resolve => setTimeout(resolve, 50));

      // Wait for fonts and images to load
      setExportProgress('Loading resources...');
      await waitForResources(canvasRef.current);

      setExportProgress('Generating image...');

      // Determine background color based on format and user settings
      const getExportBackgroundColor = () => {
        // JPG doesn't support transparency - always use solid color
        if (exportFormat === 'jpg') {
          return canvasBg?.color || '#ffffff';
        }
        // PNG/PDF: respect transparent setting
        if (canvasBg?.type === 'transparent') {
          return undefined; // html-to-image preserves transparency
        }
        // Solid color
        if (canvasBg?.type === 'solid') {
          return canvasBg?.color || '#ffffff';
        }
        // Image background - transparent so image shows through
        if (canvasBg?.type === 'image') {
          return undefined;
        }
        return '#ffffff';
      };

      const exportOptions = {
        width: selectedFormat.w,
        height: selectedFormat.h,
        pixelRatio: pixelRatioValue,
        backgroundColor: getExportBackgroundColor(),
        cacheBust: true,
        style: {
          transform: 'none',
        }
      };

      let dataUrl;
      let fileExtension;

      if (exportFormat === 'jpg') {
        dataUrl = await toJpeg(canvasRef.current, {
          ...exportOptions,
          quality: jpgQuality / 100,
        });
        fileExtension = 'jpg';
      } else if (exportFormat === 'pdf') {
        // Generate PNG first, then convert to PDF
        dataUrl = await toPng(canvasRef.current, exportOptions);
        
        setExportProgress('Creating PDF...');
        
        // Determine orientation based on dimensions
        const orientation = selectedFormat.w > selectedFormat.h ? 'landscape' : 'portrait';
        const pdf = new jsPDF({
          orientation,
          unit: 'px',
          format: [selectedFormat.w, selectedFormat.h],
        });
        
        pdf.addImage(dataUrl, 'PNG', 0, 0, selectedFormat.w, selectedFormat.h);
        
        const fileName = `kicks-${selectedFormat.label.toLowerCase().replaceAll('/', '-').replaceAll(' ', '-')}-${Date.now()}.pdf`;
        pdf.save(fileName);
        
        if (wasShowingSafeZone) setShowSafeZone(true);
        
        setExportProgress('Done!');
        setTimeout(() => {
          setIsExporting(false);
          setExportProgress('');
          setShowExportModal(false);
        }, 1000);
        return;
      } else {
        dataUrl = await toPng(canvasRef.current, exportOptions);
        fileExtension = 'png';
      }

      setExportProgress('Saving file...');

      const fileName = `kicks-${selectedFormat.label.toLowerCase().replaceAll('/', '-').replaceAll(' ', '-')}-${Date.now()}.${fileExtension}`;
      saveAs(dataUrl, fileName);

      if (wasShowingSafeZone) setShowSafeZone(true);

      setExportProgress('Done!');
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress('');
        setShowExportModal(false);
      }, 1000);

    } catch (error) {
      console.error('Export failed:', error);

      // Provide specific error messages
      let errorMsg = 'Export failed. ';
      if (error.message?.includes('memory') || error.message?.includes('size') || error.message?.includes('allocation')) {
        errorMsg += 'Image too large. Try lower resolution.';
      } else if (error.message?.includes('canvas') || error.message?.includes('taint')) {
        errorMsg += 'Rendering error. Try a different format.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMsg += 'Failed to load resources. Check connection.';
      } else {
        errorMsg += 'Please try again.';
      }

      setExportProgress(errorMsg);
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress('');
      }, 3000);
    }
  }, [selectedFormat, showSafeZone, canvasBg]);

  return (
    <div className="h-screen h-[100dvh] bg-[#f1f5f9] text-slate-900 font-sans flex flex-col overflow-hidden">
      <HeaderBar
        showSafeZone={showSafeZone}
        setShowSafeZone={setShowSafeZone}
        isExporting={isExporting}
        exportProgress={exportProgress}
        onExportClick={() => setShowExportModal(true)}
        onMenuClick={() => setIsSidebarOpen(true)}
        isMobile={isMobile}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        selectedFormat={selectedFormat}
        isExporting={isExporting}
        exportProgress={exportProgress}
      />

      <div className="flex-1 flex overflow-hidden relative">
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
          onSelectText={(id) => { setSelectedTextId(id); setShowTextPanel(true); setShowImagePanel(false); setIsSidebarOpen(false); }}
          onDeleteText={deleteTextElement}
          deviceSettings={deviceSettings}
          setDeviceSettings={setDeviceSettings}
          deviceScreenshots={deviceScreenshots}
          onDeviceFileUpload={handleDeviceFileUpload}
          onClearDeviceScreenshot={clearDeviceScreenshot}
          canvasBg={canvasBg}
          setCanvasBg={setCanvasBg}
          onShowImagePanel={() => { setShowImagePanel(true); setShowTextPanel(false); setIsSidebarOpen(false); }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
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
          deviceScreenshots={deviceScreenshots}
          canvasBg={canvasBg}
        />

        {/* Text Editor Panel */}
        {showTextPanel && selectedText && (
          <div className="w-64 sm:w-72 bg-white border-l border-slate-200 p-3 sm:p-4 space-y-4 overflow-y-auto flex-shrink-0 shadow-lg
            fixed md:relative right-0 top-0 h-full md:h-auto z-50 md:z-10
            animate-slide-up md:animate-none
          ">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-slate-600 uppercase tracking-wider">Edit Text</p>
              <button onClick={() => setShowTextPanel(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Text Segments</span>
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
                <label htmlFor="text-font-size" className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Font Size</label>
                <input
                  id="text-font-size"
                  type="number"
                  value={selectedText.fontSize}
                  onChange={(e) => updateTextElement(selectedTextId, { fontSize: Number.parseInt(e.target.value) || 16 })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="text-default-color" className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Default Color</label>
                <div className="flex items-center gap-1 p-1 border border-slate-200 rounded-lg">
                  <input
                    id="text-default-color"
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
              <label htmlFor="text-font-family" className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Font Family</label>
              <select
                id="text-font-family"
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
            
            <fieldset>
              <legend className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Style</legend>
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
            </fieldset>
            
            <fieldset>
              <legend className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Alignment</legend>
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
            </fieldset>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="text-position-x" className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Position X (%)</label>
                <input
                  id="text-position-x"
                  type="range"
                  min="0"
                  max="100"
                  value={selectedText.x}
                  onChange={(e) => updateTextElement(selectedTextId, { x: Number.parseInt(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
              </div>
              <div>
                <label htmlFor="text-position-y" className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Position Y (%)</label>
                <input
                  id="text-position-y"
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
                  type="button"
                  onClick={() => updateTextElement(selectedTextId, { cardEnabled: !selectedText.cardEnabled })}
                  className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors ${
                    selectedText.cardEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                  role="switch"
                  aria-checked={selectedText.cardEnabled}
                  aria-label="Toggle card background"
                >
                  <span className={`inline-block w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform ${
                    selectedText.cardEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {selectedText.cardEnabled && (
                <div className="space-y-3">
                  {/* Card Shape */}
                  <fieldset>
                    <legend className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Shape</legend>
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
                  </fieldset>

                  {/* Card Colors */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="card-fill-color" className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Fill Color</label>
                      <div className="flex items-center gap-1 p-1 border border-slate-200 rounded-lg">
                        <input
                          id="card-fill-color"
                          type="color"
                          value={selectedText.cardBgColor || '#ffffff'}
                          onChange={(e) => updateTextElement(selectedTextId, { cardBgColor: e.target.value })}
                          className="w-6 h-6 rounded cursor-pointer"
                        />
                        <span className="text-[9px] font-mono text-slate-500">{selectedText.cardBgColor || '#ffffff'}</span>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="card-border-color" className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Border Color</label>
                      <div className="flex items-center gap-1 p-1 border border-slate-200 rounded-lg">
                        <input
                          id="card-border-color"
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
                      <label htmlFor="card-border-width" className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Border Width</label>
                      <input
                        id="card-border-width"
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
                      <label htmlFor="card-padding" className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Padding</label>
                      <input
                        id="card-padding"
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
                  <fieldset>
                    <legend className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Shadow</legend>
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
                  </fieldset>

                  {/* Card Opacity */}
                  <div>
                    <label htmlFor="card-opacity" className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Opacity</label>
                    <input
                      id="card-opacity"
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
