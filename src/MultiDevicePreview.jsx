import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Monitor, Tablet, Smartphone, Move } from 'lucide-react';

// Device frame templates
const DEVICE_FRAMES = {
  pc: {
    macbook: {
      id: 'macbook',
      name: 'MacBook Pro',
      width: 500,
      aspectRatio: '16/10',
      bezelColor: 'bg-slate-800',
      bezelWidth: 12,
      screenRadius: 'rounded-t-xl',
      baseStyle: 'macbook',
      frameColor: 'border-slate-800',
    },
    imac: {
      id: 'imac',
      name: 'iMac',
      width: 480,
      aspectRatio: '16/9',
      bezelColor: 'bg-gray-200',
      bezelWidth: 16,
      screenRadius: 'rounded-lg',
      baseStyle: 'imac',
      frameColor: 'border-gray-200',
    },
    windows: {
      id: 'windows',
      name: 'Windows Laptop',
      width: 500,
      aspectRatio: '16/9',
      bezelColor: 'bg-gray-900',
      bezelWidth: 10,
      screenRadius: 'rounded-t-md',
      baseStyle: 'windows',
      frameColor: 'border-gray-900',
    },
    monitor: {
      id: 'monitor',
      name: 'Desktop Monitor',
      width: 520,
      aspectRatio: '16/9',
      bezelColor: 'bg-black',
      bezelWidth: 8,
      screenRadius: 'rounded-sm',
      baseStyle: 'monitor',
      frameColor: 'border-black',
    },
  },
  tablet: {
    ipad: {
      id: 'ipad',
      name: 'iPad Pro',
      width: 160,
      aspectRatio: '3/4',
      bezelColor: 'bg-slate-900',
      bezelWidth: 8,
      screenRadius: 'rounded-xl',
      frameColor: 'border-slate-900',
    },
    ipadMini: {
      id: 'ipadMini',
      name: 'iPad Mini',
      width: 130,
      aspectRatio: '3/4',
      bezelColor: 'bg-slate-800',
      bezelWidth: 10,
      screenRadius: 'rounded-2xl',
      frameColor: 'border-slate-800',
    },
    android: {
      id: 'android',
      name: 'Android Tablet',
      width: 170,
      aspectRatio: '16/10',
      bezelColor: 'bg-gray-900',
      bezelWidth: 6,
      screenRadius: 'rounded-lg',
      frameColor: 'border-gray-900',
    },
    surface: {
      id: 'surface',
      name: 'Surface Pro',
      width: 180,
      aspectRatio: '3/2',
      bezelColor: 'bg-zinc-800',
      bezelWidth: 8,
      screenRadius: 'rounded-md',
      frameColor: 'border-zinc-800',
    },
  },
  smartphone: {
    iphone: {
      id: 'iphone',
      name: 'iPhone 15 Pro',
      width: 96,
      aspectRatio: '9/19',
      bezelColor: 'bg-slate-900',
      bezelWidth: 6,
      screenRadius: 'rounded-[20px]',
      notch: 'dynamic-island',
      frameColor: 'border-slate-900',
    },
    iphoneSE: {
      id: 'iphoneSE',
      name: 'iPhone SE',
      width: 90,
      aspectRatio: '9/16',
      bezelColor: 'bg-slate-900',
      bezelWidth: 10,
      screenRadius: 'rounded-2xl',
      notch: 'none',
      homeButton: true,
      frameColor: 'border-slate-900',
    },
    samsung: {
      id: 'samsung',
      name: 'Samsung Galaxy',
      width: 100,
      aspectRatio: '9/20',
      bezelColor: 'bg-gray-900',
      bezelWidth: 4,
      screenRadius: 'rounded-3xl',
      notch: 'punch-hole',
      frameColor: 'border-gray-900',
    },
    pixel: {
      id: 'pixel',
      name: 'Google Pixel',
      width: 95,
      aspectRatio: '9/19',
      bezelColor: 'bg-zinc-900',
      bezelWidth: 5,
      screenRadius: 'rounded-[24px]',
      notch: 'punch-hole-left',
      frameColor: 'border-zinc-900',
    },
  },
};

const MultiDevicePreview = ({ screenshot, deviceSettings, onDeviceSettingsChange }) => {
  // Default device settings if not provided
  const defaultSettings = {
    pc: { x: 50, y: 50, scale: 100, visible: true, frame: 'macbook' },
    tablet: { x: 15, y: 55, scale: 100, visible: true, frame: 'ipad' },
    smartphone: { x: 85, y: 60, scale: 100, visible: true, frame: 'iphone' },
  };

  const settings = deviceSettings || defaultSettings;
  
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [interactionMode, setInteractionMode] = useState(null); // 'drag' or 'resize'
  
  const containerRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const initialScaleRef = useRef(100);
  const initialMouseRef = useRef({ x: 0, y: 0 });

  const handleDeviceMouseDown = useCallback((e, deviceType) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseXPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseYPercent = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Calculate offset from device center to mouse position
    dragOffsetRef.current = {
      x: mouseXPercent - settings[deviceType].x,
      y: mouseYPercent - settings[deviceType].y
    };
    
    setSelectedDevice(deviceType);
    setInteractionMode('drag');
  }, [settings]);

  const handleResizeMouseDown = useCallback((e, deviceType) => {
    e.stopPropagation();
    e.preventDefault();
    
    initialScaleRef.current = settings[deviceType].scale;
    initialMouseRef.current = { x: e.clientX, y: e.clientY };
    
    setSelectedDevice(deviceType);
    setInteractionMode('resize');
  }, [settings]);

  const handleContainerClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setSelectedDevice(null);
      setInteractionMode(null);
    }
  }, []);

  useEffect(() => {
    if (!interactionMode || !selectedDevice) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current || !onDeviceSettingsChange) return;

      if (interactionMode === 'drag') {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseXPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const mouseYPercent = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Subtract offset to get true device position
        const newX = Math.max(5, Math.min(95, mouseXPercent - dragOffsetRef.current.x));
        const newY = Math.max(5, Math.min(95, mouseYPercent - dragOffsetRef.current.y));

        onDeviceSettingsChange({
          ...settings,
          [selectedDevice]: {
            ...settings[selectedDevice],
            x: newX,
            y: newY,
          }
        });
      } else if (interactionMode === 'resize') {
        const deltaX = e.clientX - initialMouseRef.current.x;
        const deltaY = e.clientY - initialMouseRef.current.y;
        const scaleDelta = (deltaX + deltaY) / 2;
        const newScale = Math.max(30, Math.min(200, initialScaleRef.current + scaleDelta));

        onDeviceSettingsChange({
          ...settings,
          [selectedDevice]: {
            ...settings[selectedDevice],
            scale: Math.round(newScale),
          }
        });
      }
    };

    const handleMouseUp = () => {
      setInteractionMode(null);
    };

    // Use capture phase for smoother response
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [interactionMode, selectedDevice, settings, onDeviceSettingsChange]);

  // Device wrapper component for cleaner code
  const DeviceWrapper = ({ deviceType, children, className = '' }) => {
    const isSelected = selectedDevice === deviceType;
    const isActive = isSelected && interactionMode;
    
    return (
      <div 
        className={`absolute select-none
          ${isActive ? '' : 'transition-all duration-150 ease-out'}
          ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:ring-2 hover:ring-indigo-300'}
          ${className}
        `}
        style={{
          left: `${settings[deviceType].x}%`,
          top: `${settings[deviceType].y}%`,
          transform: `translate(-50%, -50%) scale(${settings[deviceType].scale / 100})`,
          zIndex: isSelected ? 40 : deviceType === 'smartphone' ? 30 : deviceType === 'tablet' ? 20 : 10,
          cursor: interactionMode === 'drag' && isSelected ? 'grabbing' : 'grab',
        }}
        onMouseDown={(e) => handleDeviceMouseDown(e, deviceType)}
      >
        {/* Resize handles */}
        {isSelected && (
          <>
            <div
              onMouseDown={(e) => handleResizeMouseDown(e, deviceType)}
              className="absolute -bottom-3 -right-3 w-5 h-5 bg-white border-2 border-indigo-500 rounded-full cursor-se-resize z-50 hover:bg-indigo-100 hover:scale-110 transition-transform shadow-md"
              style={{ transform: 'translate(25%, 25%)' }}
            />
            <div
              onMouseDown={(e) => handleResizeMouseDown(e, deviceType)}
              className="absolute -top-3 -right-3 w-5 h-5 bg-white border-2 border-indigo-500 rounded-full cursor-ne-resize z-50 hover:bg-indigo-100 hover:scale-110 transition-transform shadow-md"
              style={{ transform: 'translate(25%, -25%)' }}
            />
            <div
              onMouseDown={(e) => handleResizeMouseDown(e, deviceType)}
              className="absolute -bottom-3 -left-3 w-5 h-5 bg-white border-2 border-indigo-500 rounded-full cursor-sw-resize z-50 hover:bg-indigo-100 hover:scale-110 transition-transform shadow-md"
              style={{ transform: 'translate(-25%, 25%)' }}
            />
            <div
              onMouseDown={(e) => handleResizeMouseDown(e, deviceType)}
              className="absolute -top-3 -left-3 w-5 h-5 bg-white border-2 border-indigo-500 rounded-full cursor-nw-resize z-50 hover:bg-indigo-100 hover:scale-110 transition-transform shadow-md"
              style={{ transform: 'translate(-25%, -25%)' }}
            />
            <div className="absolute -top-1 -left-1 bg-indigo-500 text-white p-1 rounded-md z-50 pointer-events-none shadow-md">
              <Move className="w-3 h-3" />
            </div>
          </>
        )}
        {children}
      </div>
    );
  };

  // Render PC/Laptop device based on frame type
  const renderPCDevice = () => {
    const frameId = settings.pc.frame || 'macbook';
    const frame = DEVICE_FRAMES.pc[frameId] || DEVICE_FRAMES.pc.macbook;

    const renderBase = () => {
      switch (frame.baseStyle) {
        case 'macbook':
          return (
            <div className="w-[550px] h-4 bg-gradient-to-b from-slate-700 to-slate-800 rounded-b-lg shadow-xl relative z-20 flex justify-center">
              <div className="w-16 h-1 bg-slate-600 rounded-full mt-1.5 opacity-50"></div>
            </div>
          );
        case 'imac':
          return (
            <div className="flex flex-col items-center">
              <div className="w-24 h-16 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-sm"></div>
              <div className="w-40 h-2 bg-gray-400 rounded-b-lg shadow-lg"></div>
            </div>
          );
        case 'windows':
          return (
            <div className="w-[530px] h-3 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-md shadow-xl flex justify-center">
              <div className="w-20 h-1 bg-gray-700 rounded-full mt-1 opacity-50"></div>
            </div>
          );
        case 'monitor':
          return (
            <div className="flex flex-col items-center">
              <div className="w-16 h-20 bg-black rounded-b-sm"></div>
              <div className="w-48 h-3 bg-gray-900 rounded-lg shadow-lg"></div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="flex flex-col items-center pointer-events-none">
        <div 
          className={`${frame.bezelColor} ${frame.screenRadius} shadow-2xl overflow-hidden relative ring-1 ring-slate-800`}
          style={{ 
            width: `${frame.width}px`, 
            aspectRatio: frame.aspectRatio,
            borderWidth: `${frame.bezelWidth}px`,
            borderColor: 'inherit',
          }}
        >
          {frame.baseStyle === 'macbook' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-700 rounded-full mt-0.5 z-20"></div>
          )}
          {frame.baseStyle === 'imac' && (
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full z-20"></div>
          )}
          {screenshot ? (
            <img src={screenshot} className="w-full h-full object-cover object-top" alt="Screen" draggable={false} />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <Monitor className="text-slate-600 w-16 h-16 opacity-50" />
            </div>
          )}
        </div>
        {renderBase()}
      </div>
    );
  };

  // Render Tablet device based on frame type
  const renderTabletDevice = () => {
    const frameId = settings.tablet.frame || 'ipad';
    const frame = DEVICE_FRAMES.tablet[frameId] || DEVICE_FRAMES.tablet.ipad;

    return (
      <div 
        className={`${frame.bezelColor} ${frame.screenRadius} shadow-xl overflow-hidden relative ring-1 ring-slate-700 pointer-events-none`}
        style={{ 
          width: `${frame.width}px`, 
          aspectRatio: frame.aspectRatio,
          borderWidth: `${frame.bezelWidth}px`,
        }}
      >
        {frameId === 'ipadMini' && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 border-2 border-slate-600 rounded-full z-20"></div>
        )}
        {screenshot ? (
          <img src={screenshot} className="w-full h-full object-cover object-top" alt="Tablet Screen" draggable={false} />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <Tablet className="text-slate-600 w-10 h-10 opacity-50" />
          </div>
        )}
      </div>
    );
  };

  // Render Smartphone device based on frame type
  const renderSmartphoneDevice = () => {
    const frameId = settings.smartphone.frame || 'iphone';
    const frame = DEVICE_FRAMES.smartphone[frameId] || DEVICE_FRAMES.smartphone.iphone;

    const renderNotch = () => {
      switch (frame.notch) {
        case 'dynamic-island':
          return (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-2 h-2 bg-slate-800 rounded-full mr-6"></div>
            </div>
          );
        case 'punch-hole':
          return (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-20"></div>
          );
        case 'punch-hole-left':
          return (
            <div className="absolute top-2 left-4 w-3 h-3 bg-black rounded-full z-20"></div>
          );
        default:
          return null;
      }
    };

    return (
      <div 
        className={`${frame.bezelColor} ${frame.screenRadius} shadow-2xl overflow-hidden relative ring-1 ring-slate-700 pointer-events-none`}
        style={{ 
          width: `${frame.width}px`, 
          aspectRatio: frame.aspectRatio,
          borderWidth: `${frame.bezelWidth}px`,
        }}
      >
        {renderNotch()}
        {frame.homeButton && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 border-2 border-slate-600 rounded-full z-20"></div>
        )}
        {screenshot ? (
          <img src={screenshot} className="w-full h-full object-cover object-top" alt="Phone Screen" draggable={false} />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <Smartphone className="text-slate-600 w-8 h-8 opacity-50" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative"
      onClick={handleContainerClick}
    >
      {/* Laptop / PC */}
      {settings.pc.visible && (
        <DeviceWrapper deviceType="pc" className="rounded-xl">
          {renderPCDevice()}
        </DeviceWrapper>
      )}

      {/* Tablet */}
      {settings.tablet.visible && (
        <DeviceWrapper deviceType="tablet" className="rounded-xl">
          {renderTabletDevice()}
        </DeviceWrapper>
      )}

      {/* Mobile */}
      {settings.smartphone.visible && (
        <DeviceWrapper deviceType="smartphone" className="rounded-2xl">
          {renderSmartphoneDevice()}
        </DeviceWrapper>
      )}
    </div>
  );
};

// Export device frames for use in settings panel
export { DEVICE_FRAMES };

MultiDevicePreview.propTypes = {
  screenshot: PropTypes.string,
  deviceSettings: PropTypes.shape({
    pc: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      scale: PropTypes.number,
      visible: PropTypes.bool,
      frame: PropTypes.string,
    }),
    tablet: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      scale: PropTypes.number,
      visible: PropTypes.bool,
      frame: PropTypes.string,
    }),
    smartphone: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      scale: PropTypes.number,
      visible: PropTypes.bool,
      frame: PropTypes.string,
    }),
  }),
  onDeviceSettingsChange: PropTypes.func,
};

MultiDevicePreview.defaultProps = {
  screenshot: null,
  deviceSettings: null,
  onDeviceSettingsChange: null,
};

export default MultiDevicePreview;
