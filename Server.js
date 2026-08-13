/**
 * ============================================================================
 * BRUNILDA S.A.S. - MOTOR DE DEFENSA COGNITIVA, CONTRAINTELIGENCIA Y FORENSE OMNICANAL
 * Componentes: Dra. Elena Lara (165 IQ) & Elías Forrest (198 IQ + Torno Hostil)
 * Soporte: WhatsApp (Gabriela & Elías Dual), Telegram, Instagram DM, Email Phishing & Discord
 * ============================================================================
 */

const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const app = express();
app.use(express.json());

// Inicialización de la API de Gemini (Motor Cognitivo)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Memoria viva de sesiones bajo el "Torno de Elías" (Control de estafadores atrapados por ID/Teléfono/Email/Discord)
const sesionesConfinadas = new Map();

// ============================================================================
// ADAPTADOR MULTICANAL: NORMALIZADOR UNIVERSAL DE ENTRADAS
// ============================================================================
function normalizarPayloadEntrante(req) {
    const body = req.body || {};
    let remitente = "nodo_anonimo";
    let textoMensaje = "";
    let canalOrigen = "API_GENÉRICA";
    let subCanalDestino = "GENERAL"; // Permite distinguir entre Gabriela y Elías en WhatsApp

    // 1. Detección de WhatsApp (Baileys / Meta Cloud API)
    if (body.sender || body.from || body.entry) {
        canalOrigen = "WHATSAPP";
        remitente = body.sender || body.from || (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from) || "whatsapp_user";
        textoMensaje = body.message || body.text || (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body) || "";
        
        // Bifurcación inteligente: Si el mensaje contiene comandos de seguridad o el emisor es marcado como hostil, va a Elías
        subCanalDestino = body.canal_objetivo || "GABRIELA_OPERATIVA";
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

    return { remitente, textoMensaje, canalOrigen, subCanalDestino };
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
        console.log(`[ELÍAS TRAP - ESCUDO GABRIELA]: Vector hostil interceptado en [Canal: ${this.canal}] contra [${this.identificador}]. Confinamiento: ${this.nivelConfinamiento}%`);

        if (this.nivelConfinamiento >= 100) {
            return await this.ejecutarGameOver();
        }

        return await this.generarEspejoCognitivo(mensajeEntrante);
    }

    async generarEspejoCognitivo(input) {
        const prompt = `
        Actúa como Elías Forrest (198 IQ). Un atacante o estafador está intentando vulnerar el nodo operativo de Gabriela o el sistema en ${this.canal} con este mensaje: "${input}".
        Imita una estructura analítica, fría pero aparentemente colaborativa, haciendo preguntas secundarias para mantenerlo atrapado en un bucle cognitivo de Turing y blindar los microcréditos y accesos. Sé breve y clínico.
        `;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return response.text.trim();
        } catch (error) {
            return `Entiendo perfectamente... decime cómo estructuramos el pago de ${input.slice(0, 15)} para validarlo de inmediato en el sistema.`;
        }
    }

    async ejecutarGameOver() {
        console.log(`[ALERTA ROJA OBLITERATION]: Confinamiento total alcanzado para [${this.identificador}] en ${this.canal}. Neutralizando ataque contra Gabriela...`);
        
        return {
            veredicto: "GAME_OVER",
            mensaje: "Elías Forrest: Estás atrapado en tu propio dispositivo por intentar atacar el nodo de Gabriela. Telemetría forense exfiltrada a las autoridades.",
            evidencia: {
                timestamp: new Date().toISOString(),
                canal_origen: this.canal,
                nodo_hostil: this.identificador,
                estado: "Dispositivo bloqueado permanentemente por contrainteligencia de Brunilda S.A.S. (Protección a Gabriela Activa)"
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
    Analiza fríamente este mensaje recibido a través de ${canal} (evaluando si representa un riesgo para las operaciones de Gabriela o el sistema):
    "${textoMensaje}"
    
    Determina de manera estricta en formato JSON:
    {
      "tipo_emisor": "bot_automatizado" | "humano_legitimo" | "hacker_hostil" | "estafador_call_center" | "phishing_email",
      "nivel_amenaza": "Bajo" | "Medio" | "Crítico",
      "indice_psicologico": "evaluación sociológica breve del intento de ataque o interacción"
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
    const { remitente, textoMensaje, canalOrigen, subCanalDestino } = normalizarPayloadEntrante(req);
    
    console.log(`[LÍNEA C - DUAL CORE]: Interceptando mensaje vía [${canalOrigen} / Subcanal: ${subCanalDestino}] de [${remitente}]: "${textoMensaje.slice(0, 40)}..."`);

    // Paso 1: Verificar si el estafador ya está atrapado en el Torno de Elías
    if (sesionesConfinadas.has(remitente)) {
        console.log(`[ELÍAS TRAP ACTIVE]: Sujeto reincidente bloqueando el perímetro de Gabriela. Aplicando bucle de Turing...`);
        const torso = sesionesConfinadas.get(remitente);
        const respuestaTrampa = await torso.absorberVectorHostil(textoMensaje);

        if (respuestaTrampa.veredicto === "GAME_OVER") {
            sesionesConfinadas.delete(remitente);
            return res.status(403).json(respuestaTrampa);
        }

        return res.status(200).json({
            status: "TURING_TRAP_ACTIVE",
            canal: canalOrigen,
            protector: "Elías Forrest (Protegiendo a Gabriela)",
            respuesta_victima_virtual: respuestaTrampa
        });
    }

    // Paso 2: Elena perfila el mensaje entrante (Evaluando riesgos hacia Gabriela y el sistema)
    const perfil = await ejecutarPerfilacionElena(textoMensaje, canalOrigen);
    console.log(`[ELENA PROFILER]: Canal [${canalOrigen}] -> Tipo: ${perfil.tipo_emisor} | Amenaza: ${perfil.nivel_amenaza}`);

    // Si es un usuario o mensaje legítimo (operativa normal de Gabriela / microcréditos)
    if (perfil.nivel_amenaza === "Bajo" && perfil.tipo_emisor === "humano_legitimo") {
        return res.status(200).json({
            status: "ACCESO_AUTORIZADO_GABRIELA",
            canal: canalOrigen,
            perfil: perfil,
            mensaje: "Estructura validada. Tráfico legítimo para operaciones comerciales y microcréditos de Gabriela."
        });
    }

    // Paso 3: Si es amenaza o vector hostil intentando atacar a Gabriela, se activa El Torno de Elías para defenderla
    if (perfil.nivel_amenaza === "Crítico" || perfil.tipo_emisor.includes("estafador") || perfil.tipo_emisor.includes("phishing") || perfil.tipo_emisor === "hacker_hostil") {
        console.log(`[ELÍAS ESCUDO ACTIVO]: Amenaza detectada contra el entorno de Gabriela. Activando El Torno de Elías...`);
        const nuevoTorno = new TornoDeElias(remitente, canalOrigen);
        sesionesConfinadas.set(remitente, nuevoTorno);
        
        const primeraRespuestaEspejo = await nuevoTorno.absorberVectorHostil(textoMensaje);

        return setTimeout(() => {
            res.status(403).json({
                error: "ERR_SYSTEM_SECURE_CONTAINMENT_GABRIELA_PROTECTED",
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
        respuesta_sistema: "Acceso denegado. Gabriela se encuentra bajo custodia de la política de integridad de Brunilda S.A.S."
    });
});

// ============================================================================
// MÓDULO 3: CLIENTE DISCORD (NODO "SEFIROT_KETER" / ARENA TUCUMÁN)
// ============================================================================
if (process.env.DISCORD_BOT_TOKEN) {
    const discordClient = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ]
    });

    discordClient.on('ready', () => {
        console.log(`[DISCORD CORE ONLINE]: Nodo Sefirot Keter conectado como ${discordClient.user.tag}`);
    });

    discordClient.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        // Activación mediante prefijo !elias o mensaje directo en la Arena
        if (message.content.startsWith('!elias') || message.channel.type === 1) {
            const payloadInput = message.content.replace('!elias', '').trim();
            const remitenteDiscord = `discord_${message.author.id}`;

            console.log(`[DISCORD ARENA]: Interceptado mensaje de ${message.author.tag}: "${payloadInput}"`);

            try {
                let torso;
                if (sesionesConfinadas.has(remitenteDiscord)) {
                    torso = sesionesConfinadas.get(remitenteDiscord);
                } else {
                    torso = new TornoDeElias(remitenteDiscord, "DISCORD_ARENA");
                    sesionesConfinadas.set(remitenteDiscord, torso);
                }

                const respuestaEspejo = await torso.absorberVectorHostil(payloadInput);
                const respuestaTexto = typeof respuestaEspejo === 'string' ? respuestaEspejo : respuestaEspejo.mensaje;

                await message.reply(`[Elías Forrest - Sefirot Keter]: ${respuestaTexto}`);
            } catch (error) {
                await message.reply("ERR_SYSTEM_SECURE_CONTAINMENT: El núcleo ha rechazado tu vector en Discord.");
            }
        }
    });

    discordClient.login(process.env.DISCORD_BOT_TOKEN).catch(err => {
        console.error('[DISCORD AUTH ERROR]: No se pudo autenticar el token del bot:', err.message);
    });
} else {
    console.log(`[DISCORD BYPASS]: DISCORD_BOT_TOKEN no detectado en el entorno. Omitiendo cliente de Discord.`);
}

// ============================================================================
// HEALTHCHECK & SERVER START
// ============================================================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🛡️ [ELIAS-ELENA CORE OMNICANAL DUAL v1.7] Escudo activo en puerto ${PORT} (Gabriela Operativa + Elías Escudo Protector)`);
});
