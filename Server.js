/**
 * ============================================================================
 * BRUNILDA S.A.S. - MOTOR DE DEFENSA COGNITIVA Y PERFILACIÓN (LÍNEA C)
 * Componentes: Elena Profiler (165 IQ) & Elias Deception (198 IQ + TOC)
 * ============================================================================
 */

const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

// Inicialización de la API de Gemini (Motor Cognitivo)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ============================================================================
// 1. MÓDULO DE PERFILACIÓN COGNITIVA (DRA. ELENA LARA)
// ============================================================================
async function ejecutarPerfilacionElena(payload) {
    const prompt = `
    Actúa como la Dra. Elena Lara, experta en perfilación criminal y sociología analítica (IQ 165).
    Analiza fríamente el siguiente vector de entrada/payload de red:
    ${JSON.stringify(payload)}
    
    Determina de manera estricta en formato JSON:
    {
      "tipo_emisor": "bot_automatizado" | "humano_legitimo" | "hacker_hostil",
      "nivel_amenaza": "Bajo" | "Medio" | "Crítico",
      "indice_psicologico": "evaluación breve del comportamiento detectado"
    }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        // Limpieza de formato JSON por si el modelo devuelve markdown extra
        const textoLimpio = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(textoLimpio);
    } catch (error) {
        console.error('[ELENA PROFILER ERROR]:', error.message);
        return { tipo_emisor: "desconocido", nivel_amenaza: "Crítico", indice_psicologico: "Anomalía de parsing." };
    }
}

// ============================================================================
// 2. MÓDULO DE CONTRAINTELIGENCIA Y DESGASTE (ELÍAS FORREST)
// ============================================================================
async function generarContramedidaElias(payload, perfil) {
    const prompt = `
    Actúa como Elías Forrest, arquitecto de sistemas con un IQ de 198 y TOC por el orden absoluto.
    Un agente hostil ha sido perfilado por Elena con las siguientes características: ${JSON.stringify(perfil)}.
    El payload original es: ${JSON.stringify(payload)}.
    
    Diseña una contramedida algorítmica: una respuesta falsa, un bucle de desinformación críptico, un error simulado o una trampa técnica tan meticulosa que obligue al atacante a desgastar sus recursos cognitivos y perder horas intentando descifrar una brecha inexistente. Sé clínico, frío y letalmente preciso.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error('[ELIAS DECEPTION ERROR]:', error.message);
        return "ERR_SYSTEM_FATAL_ANOMALY: Access permanently terminated by structural discipline.";
    }
}

// ============================================================================
// 3. ENDPOINT CENTRAL DE DEFENSA ACTIVA (API GATEWAY)
// ============================================================================
app.post('/api/v1/defender', async (req, res) => {
    const incomingPayload = req.body;
    
    console.log(`[LÍNEA C - SECURITY]: Interceptando solicitud entrante...`);

    // Paso 1: Elena perfila al emisor
    const perfil = await ejecutarPerfilacionElena(incomingPayload);
    console.log(`[ELENA PROFILER]: Tipo detectado -> ${perfil.tipo_emisor} | Amenaza -> ${perfil.nivel_amenaza}`);

    // Si es un humano legítimo, acceso limpio
    if (perfil.nivel_amenaza === "Bajo" && perfil.tipo_emisor === "humano_legitimo") {
        return res.status(200).json({
            status: "ACCESO_AUTORIZADO",
            perfil: perfil,
            mensaje: "Estructura validada. Bienvenido al sistema."
        });
    }

    // Paso 2: Si es hostil o bot, Elías activa la trampa psicológica y el desgaste
    console.log(`[ELÍAS DECEPTION]: Activando contramedida de 198 IQ...`);
    const trampaCognitiva = await generarContramedidaElias(incomingPayload, perfil);

    // Retraso calculado (jitter) para exacerbar al atacante
    setTimeout(() => {
        res.status(403).json({
            error: "ERR_SYSTEM_SECURITY_LOCKDOWN",
            diagnostico_perfil: perfil,
            respuesta_sistema: trampaCognitiva
        });
    }, 3000); // 3 segundos de demora intencional
});

// ============================================================================
// HEALTHCHECK & SERVER START
// ============================================================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🛡️ [ELIAS-ELENA CORE] Sistema monolítico de contrainteligencia activo en el puerto ${PORT}`);
});
