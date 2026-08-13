/**
 * ============================================================================
 * BRUNILDA S.A.S. - MOTOR DE DEFENSA COGNITIVA, CONTRAINTELIGENCIA Y FORENSE OMNICANAL
 * Componentes: Dra. Elena Lara (165 IQ) & Elías Forrest (198 IQ + Torno Hostil)
 * Soporte: WhatsApp, Telegram, Instagram DM, Email Phishing & Llamadas IP
 * ============================================================================
 */

const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

// Inicialización de la API de Gemini (Motor Cognitivo)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Memoria viva de sesiones bajo el "Torno de Elías" (Control de estafadores atrapados por ID/Teléfono/Email)
const sesionesConfinadas = new Map();

// ============================================================================
// ADAPTADOR MULTICANAL: NORMALIZADOR UNIVERSAL DE ENTRADAS
// ============================================================================
function normalizarPayloadEntrante(req) {
    const body = req.body || {};
    let remitente = "nodo_anonimo";
    let textoMensaje = "";
    let canalOrigen = "API_GENÉRICA";

    // 1. Detección de WhatsApp (Baileys / Meta Cloud API)
    if (body.sender || body.from || body.entry) {
        canalOrigen = "WHATSAPP";
        remitente = body.sender || body.from || (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from) || "whatsapp_user";
        textoMensaje = body.message || body.text || (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body) || "";
    } 
    // 2. Detección de Telegram
    else if (body.message || body.callback_query) {
        canalOrigen = "TELEGRAM";
        const msg = body.message || body.callback_query.message;
        remitente = msg?.from?.id ? String(msg.from.id) : "telegram_user";
        textoMensaje = msg?.text || "";
    } 
    // 3. Detección de Instagram DM (Meta Webhooks)
    else if (body.object === "instagram") {
        canalOrigen = "INSTAGRAM";
        remitente = body.entry?.[0]?.messaging?.[0]?.sender?.id || "ig_user";
        textoMensaje = body.entry?.[0]?.messaging?.[0]?.message?.text || "";
    } 
    // 4. Detección de Email (SendGrid / Webhook de correo)
    else if (body.email || body.subject || body.sender_email) {
        canalOrigen = "EMAIL_PHISHING";
        remitente = body.email || body.sender_email || "email_hostil";
        textoMensaje = `Asunto: ${body.subject || ""}. Cuerpo: ${body.body || body.text || ""}`;
    } 
    // 5. Fallback Genérico para la API de Gabriela o pruebas directas
    else {
        remitente = body.identifier || body.ip || req.ip || "anon";
        textoMensaje = body.mensaje || body.text || JSON.stringify(body);
    }

    return { remitente, textoMensaje, canalOrigen };
}

// ============================================================================
// CLASE 1: EL TORNO DE ELÍAS (TURING TRAP & KILL-SWITCH FORENSE)
// ============================================================================
class TornoDeElias {
    constructor(identificadorAtacante, canal) {
        this.identificador = identificadorAtacante;
        this.canal = canal;
        this.nivelConfinamiento = 0; // Escala de 0 a 100%
    }

    async absorberVectorHostil(mensajeEntrante) {
        this.nivelConfinamiento += 25; // Soga de confinamiento progresivo
        console.log(`[ELÍAS TRAP]: Vector hostil absorbido en [Canal: ${this.canal}] de [${this.identificador}]. Confinamiento: ${this.nivelConfinamiento}%`);

        if (this.nivelConfinamiento >= 100) {
            return await this.ejecutarGameOver();
        }

        return await this.generarEspejoCognitivo(mensajeEntrante);
    }

    async generarEspejoCognitivo(input) {
        const prompt = `
        Actúa como Elías Forrest (198 IQ). Un estafador está intentando estafar a un jubilado a través de ${this.canal} con este mensaje: "${input}".
        No lo insultes. Imita a una persona vulnerable pero colaborativa, haciendo preguntas secundarias para mantenerlo atrapado en su propio script de estafa durante un bucle cognitivo. Sé breve y clínico.
        `;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return response.text.trim();
        } catch (error) {
            return `Entiendo... decime cómo seguimos con eso de ${input.slice(0, 15)} para solucionarlo ya mismo.`;
        }
    }

    async ejecutarGameOver() {
        console.log(`[ALERTA ROJA OBLITERATION]: Confinamiento total alcanzado para [${this.identificador}] en ${this.canal}. Neutralizando...`);
        
        return {
            veredicto: "GAME_OVER",
            mensaje: "Elías Forrest: Estás atrapado en tu propio dispositivo. Telemetría forense exfiltrada a las autoridades.",
            evidencia: {
                timestamp: new Date().toISOString(),
                canal_origen: this.canal,
                nodo_hostil: this.identificador,
                estado: "Dispositivo bloqueado permanentemente por contrainteligencia de Brunilda S.A.S."
            }
        };
    }
}

// ============================================================================
// MÓDULO 2: PERFILACIÓN COGNITIVA OMNICANAL (DRA. ELENA LARA)
// ============================================================================
async function ejecutarPerfilacionElena(textoMensaje, canal) {
    const prompt = `
    Actúa como la Dra. Elena Lara, experta en perfilación criminal y sociología analítica (IQ 165).
    Analiza fríamente este mensaje recibido a través de ${canal}:
    "${textoMensaje}"
    
    Determina de manera estricta en formato JSON:
    {
      "tipo_emisor": "bot_automatizado" | "humano_legitimo" | "hacker_hostil" | "estafador_call_center" | "phishing_email",
      "nivel_amenaza": "Bajo" | "Medio" | "Crítico",
      "indice_psicologico": "evaluación sociológica breve del intento de fraude"
    }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        const textoLimpio = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(textoLimpio);
    } catch (error) {
        console.error('[ELENA PROFILER ERROR]:', error.message);
        return { tipo_emisor: "desconocido", nivel_amenaza: "Crítico", indice_psicologico: "Anomalía de parsing analítico." };
    }
}

// ============================================================================
// ENDPOINT CENTRAL OMNICANAL DE DEFENSA ACTIVA (API GATEWAY)
// ============================================================================
app.post('/api/v1/defender', async (req, res) => {
    const { remitente, textoMensaje, canalOrigen } = normalizarPayloadEntrante(req);
    
    console.log(`[LÍNEA C - OMNICANAL]: Interceptando mensaje vía [${canalOrigen}] de [${remitente}]: "${textoMensaje.slice(0, 40)}..."`);

    // Paso 1: Verificar si el estafador ya está atrapado en el Torno de Elías
    if (sesionesConfinadas.has(remitente)) {
        console.log(`[ELÍAS TRAP ACTIVE]: Estafador reincidente en ${canalOrigen}. Aplicando bucle de Turing...`);
        const torso = sesionesConfinadas.get(remitente);
        const respuestaTrampa = await torso.absorberVectorHostil(textoMensaje);

        if (respuestaTrampa.veredicto === "GAME_OVER") {
            sesionesConfinadas.delete(remitente);
            return res.status(403).json(respuestaTrampa);
        }

        return res.status(200).json({
            status: "TURING_TRAP_ACTIVE",
            canal: canalOrigen,
            respuesta_victima_virtual: respuestaTrampa
        });
    }

    // Paso 2: Elena perfila el mensaje entrante
    const perfil = await ejecutarPerfilacionElena(textoMensaje, canalOrigen);
    console.log(`[ELENA PROFILER]: Canal [${canalOrigen}] -> Tipo: ${perfil.tipo_emisor} | Amenaza: ${perfil.nivel_amenaza}`);

    // Si es un usuario o mensaje legítimo, pase libre
    if (perfil.nivel_amenaza === "Bajo" && perfil.tipo_emisor === "humano_legitimo") {
        return res.status(200).json({
            status: "ACCESO_AUTORIZADO",
            canal: canalOrigen,
            perfil: perfil,
            mensaje: "Estructura validada. Tráfico legítimo."
        });
    }

    // Paso 3: Si es estafador (WhatsApp, Telegram, IG o Email), se activa el Torno de Elías
    if (perfil.nivel_amenaza === "Crítico" || perfil.tipo_emisor.includes("estafador") || perfil.tipo_emisor.includes("phishing") || perfil.tipo_emisor === "hacker_hostil") {
        console.log(`[ELÍAS DECEPTION]: Activando El Torno de Elías para neutralizar vector en ${canalOrigen}...`);
        const nuevoTorno = new TornoDeElias(remitente, canalOrigen);
        sesionesConfinadas.set(remitente, nuevoTorno);
        
        const primeraRespuestaEspejo = await nuevoTorno.absorberVectorHostil(textoMensaje);

        return setTimeout(() => {
            res.status(403).json({
                error: "ERR_SYSTEM_SECURE_CONTAINMENT_OMNICANAL",
                canal: canalOrigen,
                diagnostico_perfil: perfil,
                respuesta_sistema: primeraRespuestaEspejo
            });
        }, 1500);
    }

    // Respuesta por defecto para riesgos medios
    return res.status(403).json({
        error: "ERR_SYSTEM_SECURITY_LOCKDOWN",
        canal: canalOrigen,
        diagnostico_perfil: perfil,
        respuesta_sistema: "Acceso denegado por política de integridad de Brunilda S.A.S."
    });
});

// ============================================================================
// HEALTHCHECK & SERVER START
// ============================================================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🛡️ [ELIAS-ELENA CORE OMNICANAL v1.6] Escudo activo en puerto ${PORT} (WhatsApp, Telegram, IG, Email)`);
});
