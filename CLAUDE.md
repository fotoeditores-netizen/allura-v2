# CLAUDE.md

This file provides guidance to Claude Code when working with the "Allura Healthcare" web project.

## 🏢 Contexto del Negocio y Marca
Allura es una marca colombiana de turismo médico en Medellín que integra salud, bienestar y placer (tratamientos médicos, estéticos y odontológicos) [5].
- **Tono de Comunicación:** Elegante, empático, claro y profesional. Debe proyectar "quiet luxury", confianza y calidez humana [6].
- **Tipografías:** `Qalinza` para títulos/subtítulos y `Nexa` para el cuerpo de texto [7].
- **Paleta de Colores:** 
  - Azul oscuro principal: `#051c33`
  - Azul claro: `#8b9fb3`
  - Gris plateado: `#abacae`
  - Fondo claro: `#eaeeef` [7].
- **Estilo Visual:** Minimalista, luz natural, transmitiendo serenidad y bienestar [8].

## 🏗️ Estado del Proyecto y Arquitectura
- **Fase actual:** Diseño y planificación de la arquitectura web inicial.
- **Estructura base requerida:** Vistas de Inicio (Hero section enfocado en Medellín y Beneficios), Servicios, Nosotros y Contacto.

## 🛠️ Skills y Herramientas Disponibles
Claude, tienes acceso a las siguientes skills instaladas en este proyecto. Úsalas de manera proactiva cuando el flujo de trabajo lo requiera:
- **Excalidraw (`excalidraw-diagram-skill`):** Úsala para crear diagramas de flujo profesionales de la arquitectura web y generar archivos PNG para visualizar la estructura antes de codificar [9-11].
- **Playwright (`playwright-cli`):** Úsala para automatizar interacciones en el navegador, tomar capturas de pantalla, revisar la UI renderizada y hacer testing web de las vistas creadas [9].
- **N8N (`n8n-skills` + `n8n-mcp`):** Úsala cuando necesitemos crear o auditar automatizaciones (ej. conectar los formularios de contacto de la web) [12, 13].
- **Firecloud (`firecloud.cli`):** Úsala si en algún momento necesitamos hacer web scraping o extracción de datos para integrarlos al proyecto [3, 14].

## 🔌 Plugins Activos
- **Super Powers & Feature Dev:** Utiliza estas capacidades para proponer mejoras constantes al código, optimizar la aplicación de manera proactiva y estructurar el desarrollo web de forma profesional [4, 15].
- **Claude MD Management:** Tienes permitido y debes actualizar este archivo `CLAUDE.md` automáticamente si cometemos errores en el flujo de trabajo, para aprender de ellos y mejorar las reglas del proyecto [16, 17].

## 📝 Reglas de Desarrollo
1. **Planificación primero:** Antes de crear archivos masivos, presenta siempre un plan o diagrama.
2. **Componentes reutilizables:** Escribe código modular y escalable.
3. **Fidelidad al Brandbook:** Respeta estrictamente los códigos hexadecimales y las tipografías mencionadas.

