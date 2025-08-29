import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { QBoton } from '../atomos/qboton.tsx';
import { QIcono } from '../atomos/qicono.tsx';
import { SelectorModo } from './SelectorModo';
import './menu-acciones-movil.css';
import { ModoCalendario } from './tipos';

interface MenuAccionesMovilProps {
  modoAnio: boolean;
  modoVista?: ModoCalendario;
  modos?: ModoCalendario[];
  onCambioModo: () => void;
  onCambioModoVista?: (modo: ModoCalendario) => void;
  botonesIzqModo?: React.ReactNode[];
  botonesDerModo?: React.ReactNode[];
  botonesIzqHoy?: React.ReactNode[];
  botonesDerHoy?: React.ReactNode[];
  mostrarCambioModo?: boolean;
}

export function MenuAccionesMovil({
  modoAnio,
  modoVista,
  modos,
  onCambioModo,
  onCambioModoVista,
  botonesIzqModo = [],
  botonesDerModo = [],
  botonesIzqHoy = [],
  botonesDerHoy = [],
  mostrarCambioModo = true
}: MenuAccionesMovilProps) {
  const [abierto, setAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const ignoreNextClick = useRef(false);

  // Función toggle: abre si está cerrado, cierra si está abierto
  const toggleMenu = () => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    
    setAbierto(prev => !prev);
  };


  // Función para cerrar el menú
  const cerrarMenu = useCallback(() => {
    setAbierto(false);
  }, []);

  // Función wrapper que ejecuta la acción original y luego cierra el menú
  const crearManejadorConCierre = (accionOriginal?: () => void) => {
    return () => {
      // Ejecutar la acción original si existe
      if (accionOriginal) {
        accionOriginal();
      }
      // Cerrar el menú después de la acción
      cerrarMenu();
    };
  };

  // Wrappers para las acciones principales
  const handleCambioModo = crearManejadorConCierre(onCambioModo);

  // Función para clonar botones con el manejador de cierre
  const clonarBotonConCierre = (boton: React.ReactNode, index: number): React.ReactNode => {
    if (React.isValidElement<{ onClick?: () => void }>(boton)) {
      return React.cloneElement(boton, {
        key: index,
        onClick: crearManejadorConCierre(boton.props.onClick)
      });
    }
    return boton;
  };

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    if (!abierto) return;
    
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        // Marcar para ignorar el próximo clic en el botón toggle
        ignoreNextClick.current = true;
        cerrarMenu();
      }
    }
    
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [abierto, cerrarMenu]);

  // Portal para menú lateral
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
  useEffect(() => {
    let node = document.getElementById('menu-acciones-movil-portal');
    if (!node) {
      node = document.createElement('div');
      node.id = 'menu-acciones-movil-portal';
      document.body.appendChild(node);
    }
    setPortalNode(node);
    return () => {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    };
  }, []);

  const menuLateral = (
    <>
      {/* Overlay de fondo */}
      <div 
        className={`menu-overlay ${abierto ? 'visible' : ''}`}
        onClick={cerrarMenu}
      />
      
      {/* Menú lateral */}
      <menu-lateral 
        id="menu-acciones-movil"
        className={abierto ? 'abierto' : ''}
        style={{
          border: '1px solid #ccc',
          position: 'fixed',
          top: 154,
          height: '79vh',
          zIndex: 1200,
          width: '320px',
          maxWidth: '100vw',
          overflowY: 'hidden',
          marginLeft: '1rem',
          left: abierto ? 0 : '-320px',
          visibility: abierto ? 'visible' : 'hidden',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s',
        }}
      >
        <aside ref={menuRef} style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          background: '#fff',
          boxShadow: '2px 0 16px rgba(0,0,0,0.12)'
        }}>
          <nav>
            <div className="menu-acciones">
            {botonesIzqModo.map((boton, index) => (
              <div className="menu-acciones-fila" key={index}>
                {clonarBotonConCierre(boton, index)}
              </div>
            ))}
            
            {mostrarCambioModo && onCambioModoVista && (
              <div className="menu-acciones-fila" key={'selector-modo'}>
                <SelectorModo
                  modoActual={modoVista || 'mes'}
                  onCambioModo={(modo) => {
                    onCambioModoVista(modo);
                    cerrarMenu();
                  }}
                  variante="vertical"
                  mostrarIconos={false}
                  modos={modos}
                />
              </div>
            )}
            
            {/* Fallback para compatibilidad con sistemas que no usan modoVista */}
            {mostrarCambioModo && !onCambioModoVista && (
              <div className="menu-acciones-fila" key={'modo'}>
                <QBoton onClick={handleCambioModo} variante={'texto'}>
                  {modoAnio ? 'Modo Mes' : 'Modo Año'}
                </QBoton>
              </div>
            )}

            {botonesDerModo.map((boton, index) => (
              <div className="menu-acciones-fila" key={index}>
                {clonarBotonConCierre(boton, index)}
              </div>
            ))}      
            
            {botonesIzqHoy.map((boton, index) => (
              <div className="menu-acciones-fila" key={index}>
                {clonarBotonConCierre(boton, index)}
              </div>
            ))}            

            {botonesDerHoy.map((boton, index) => (
              <div className="menu-acciones-fila" key={index}>
                {clonarBotonConCierre(boton, index)}
              </div>
            ))}           
          </div>
        </nav>
      </aside>
    </menu-lateral>
    </>
  );

  return (
    <>
      <button
        id="boton-menu-acciones-movil"
        aria-label={abierto ? "Cerrar menú acciones" : "Abrir menú acciones"}
        className="boton-menu-lateral"
        onClick={toggleMenu}
        type="button"
      >
        <QIcono nombre="menu" tamaño="sm" />
      </button>
      {portalNode && ReactDOM.createPortal(menuLateral, portalNode)}
    </>
  );
}
