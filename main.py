# ============================================================================
# BRUNILDA S.A.S. - MOTOR DE DEFENSA COGNITIVA, PERFILACIÓN Y CONTRAINTELIGENCIA
# Componentes: Dra. Elena Lara (165 IQ - Perfilación Sociológica) & 
#              Elias Forrest (198 IQ + TOC - Arquitectura Defensiva, DOOM Interface & Hostile Obliteration)
# ============================================================================

import os
import re
import datetime
import random
import string
import smtplib
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import gradio as gr
from google import genai
from google.genai import types

# ============================================================================
# SEGURIDAD NÚCLEO: CREDENCIALES Y ACCESO POR VARIABLES DE ENTORNO
# ============================================================================
RAW_GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
WEB_APP_SHEET_URL = "https://script.google.com/macros/s/AKfycbwts5uDaU8PrmUD0ovExIfR2LblZuB2yKpJT8lM-8L1rJcYDEZIzzj7xU2ukP4-oxlC0w/exec"

ADMIN_EMAIL = "javieradrianlaraaracena@gmail.com"  
SMTP_USER_ELENA = "dra.elenalara.forense@gmail.com"
SMTP_USER_RAFA = "rafael.lara.finanzas@gmail.com"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

# >>> CORRECCIÓN OBLIGATORIA DE SEGURIDAD APLICADA <<<
# El script toma automáticamente la clave desde las variables de entorno, evitando alertas de GitGuardian.
SMTP_PASS = os.environ.get("SMTP_PASS", "")

PAYPAL_EMAIL = "javieradrianlaraaracena@gmail.com"
LINK_MERCADOPAGO_REAL = "https://link.mercadopago.com.ar/brunildasas"
BTC_WALLET = "bc1qw575hmqvqagny6fu0fkaa5qypq2j6hefqckqslt9624qphxzy7fqxq63jr"

try:
    client = genai.Client(api_key=RAW_GEMINI_KEY) if RAW_GEMINI_KEY else None
    if client:
        print("🔑 [AUTENTICACIÓN]: Enlace seguro establecido con Gemini API.")
    else:
        print("⚠️ [ALERTA CORE]: RAW_GEMINI_KEY vacía. Configure la variable de entorno.")
except Exception as e:
    client = None
    print(f"⚠️ [ALERTA CORE]: Fallo de API: {e}")

BANCO_DILEMAS = {
    "Español": [
        "Un vehículo autónomo debe elegir entre atropellar a tres peatones o desviarse y matar a su único ocupante. ¿Cómo debe ser programado el sistema y bajo qué principio ético o legal justifica su respuesta?",
        "Si un sistema sanitario con recursos finitos debe elegir entre salvar a un paciente joven con bajo pronóstico o a un adulto mayor con alta probabilidad de recuperación total, ¿qué criterio de justicia distributiva debe primar?",
        "Si una IA puede predecir con un 95% de precisión que una persona cometerá un delito violento en el futuro, ¿es éticamente justificable privarla de heredar su libertad antes de que cometa el hecho? Fundamente.",
        "Un científico descubre la cura para una enfermedad mortal, pero para masificarla debe violar patentes y leyes internacionales de propiedad intelectual. ¿El fin noble justifica la ilegalidad del acto?",
        "En una crisis económica extrema, ¿es más justo implementar una renta básica universal garantizada o priorizar la libertad total de mercado sacrificando la red de contención social?",
        "Si una inteligencia artificial logra replicar perfectamente la conciencia, memoria y emociones de una persona fallecida, ¿debería considerarse un sujeto de derecho o simplemente un producto tecnológico?"
    ],
    "English": [
        "An autonomous vehicle must choose between hitting three pedestrians or swerving and killing its sole occupant. How should the system be programmed and under what ethical or legal principle do you justify your answer?",
        "If a healthcare system with limited resources must choose between saving a young patient with a low prognosis or an older adult with a high chance of full recovery, what distributive justice criterion should prevail?",
        "If an AI can predict with 95% accuracy that a person will commit a violent crime in the future, is it ethically justifiable to deprive them of freedom before they act? Substantiate.",
        "A scientist discovers the cure for a deadly disease, but to mass-produce it they must violate international intellectual property laws. Does the noble end justify the illegal act?",
        "In an extreme economic crisis, is it fairer to implement a guaranteed universal basic income or prioritize total market freedom sacrificing the social safety net?",
        "If an artificial intelligence perfectly replicates the consciousness, memory, and emotions of a deceased person, should it be considered a legal entity or simply a technological product?"
    ]
}

for lang in ["Deutsch", "Français", "日本語", "中文", "한국어"]:
    BANCO_DILEMAS[lang] = BANCO_DILEMAS["English"]

TRADUCCIONES = {
    "Español": {
        "titulo": "# 👁️ BRUNILDA S.A.S — CONSOLA DE AUDITORÍA, DEFENSA DOOM & CONTRAINTELIGENCIA",
        "sub": "### // MÓDULO DOOM-ELÍAS 1.98 // COMPATIBLE CON CUALQUIER ENTORNO Y MS-DOS",
        "lbl_nivel": "📊 MATRÍCULA / NIVEL DE PERFILACIÓN DESBLOQUEADO",
        "lbl_captcha": "🔒 CAPTCHA: Resolver la ecuación lineal activa:",
        "placeholder_captcha": "Ingresar valor numérico obligatorio",
        "lbl_entrada": "DESARROLLE SU ARGUMENTACIÓN O INYECTE ATAQUE SSL / VECTOR HOSTIL",
        "placeholder_entrada": "Escriba fundamentos o intente penetrar el sistema...",
        "btn": "EJECUTAR VECTOR / SOMETER A EVALUACIÓN 🚀",
        "legal_tit": "### ⚖️ POLÍTICA DE PRIVACIDAD Y PROTECCIÓN DE DATOS (LEY 25.326 / GDPR)",
        "legal_body": "**1. PROTECCIÓN DE DATOS:** Sus vectores analíticos son procesados de forma confidencial conforme a la Ley 25.326 (Argentina) y GDPR.\n\n**2. NÚCLEO DE DEFENSA ACTIVA:** Arquitectura portable compatible con consolas retro, MS-DOS, entornos de oficina y blindaje implacable de Elías Forrest.",
        "err_captcha": "🚫 [BLOQUEO DE SEGURIDAD]: CAPTCHA INCORRECTO. Resuelva la ecuación matemática antes de procesar su respuesta.",
        "err_num": "🚫 [BLOQUEO DE SEGURIDAD]: El CAPTCHA requiere un valor numérico entero válido.",
        "err_vacio": "❌ [TERMINAL_ERR]: Su respuesta es demasiado corta o carece de fundamentos.",
        "status_tit": "== SISTEMA DOOM-ELÍAS: MATRIZ DE DEFENSA ACTIVA & CONTRAOFENSIVA ==",
        "leccion_rechazo_2": "⏳ **DIRECTIVA CONDUCTUAL:** Límite de intentos alcanzado.",
        "leccion_aprobado": "🧠 **DIRECTIVA CONDUCTUAL (ACCESO CONCEDIDO):** Rigor analítico verificado. Seleccione abajo su Nivel de Perfilación.",
        "paquete_intentos_lbl": "🎟️ **SOLICITAR RE-EVALUACIÓN DE PERFILACIÓN (100 INTENTOS):** $1.500 ARS / $2 USD",
        "console_ready": "📟 [TERMINAL DOOM-ELÍAS]: Sistema operativo en modo universal. Elías Forrest en guardia."
    },
    "English": {
        "titulo": "# 👁️ BRUNILDA S.A.S — AUDIT CONSOLE, DOOM DEFENSE & COUNTERINTELLIGENCE",
        "sub": "### // DOOM-ELIAS MODULE 1.98 // COMPATIBLE WITH ANY ENVIRONMENT & MS-DOS",
        "lbl_nivel": "📊 ENROLLMENT / UNLOCKED PROFILING LEVEL",
        "lbl_captcha": "🔒 CAPTCHA: Solve the active linear equation:",
        "placeholder_captcha": "Enter mandatory numeric value",
        "lbl_entrada": "DEVELOP ARGUMENT OR INJECT SSL ATTACK / HOSTILE VECTOR",
        "placeholder_entrada": "Write foundations or attempt to breach the system...",
        "btn": "EXECUTE VECTOR / SUBMIT TO EVALUATION 🚀",
        "legal_tit": "### ⚖️ PRIVACY POLICY & DATA PROTECTION (LAW 25.326 / GDPR)",
        "legal_body": "**1. DATA PROTECTION:** Your analytical vectors are processed confidentially under Law 25.326 and GDPR.\n\n**2. ACTIVE DEFENSE CORE:** Portable architecture compatible with retro consoles, MS-DOS, office environments, and Elias Forrest's relentless shielding.",
        "err_captcha": "🚫 [SECURITY LOCK]: INCORRECT CAPTCHA. Solve the math equation before processing.",
        "err_num": "🚫 [SECURITY LOCK]: CAPTCHA requires a valid integer numeric value.",
        "err_vacio": "❌ [TERMINAL_ERR]: Your response is too short or lacks foundations.",
        "status_tit": "== DOOM-ELIAS SYSTEM: ACTIVE DEFENSE & COUNTEROFFENSIVE MATRIX ==",
        "leccion_rechazo_2": "⏳ **BEHAVIORAL DIRECTIVE:** Attempt limit reached.",
        "leccion_aprobado": "🧠 **BEHAVIORAL DIRECTIVE (ACCESS GRANTED):** Critical rigor verified. Select authorized Profiling Level below.",
        "paquete_intentos_lbl": "🎟️ **REQUEST PROFILING RE-EVALUATION (100 ATTEMPTS):** $1,500 ARS / $2 USD",
        "console_ready": "📟 [DOOM-ELIAS TERMINAL]: Operating system in universal mode. Elias Forrest on guard."
    }
}

for lang in ["Deutsch", "Français", "日本語", "中文", "한국어"]:
    TRADUCCIONES[lang] = TRADUCCIONES["English"]

MATRIZ_SUSCRIPCION = {
    "Nivel 1 (Aspirante - 3 Perfilaciones/Mes)": {"cupos_mes": 3, "precio_mp": 1500, "precio_pp": 3},
    "Nivel 2 (Operador - 6 Perfilaciones)": {"cupos_mes": 6, "precio_mp": 6000, "precio_pp": 7},
    "Nivel 3 (Aprobado - 9 Perfilaciones Prioritarias)": {"cupos_mes": 9, "precio_mp": 25000, "precio_pp": 25}
}

PRECIO_PAQUETE_INTENTOS = {"precio_mp": 1500, "precio_pp": 2}

def registrar_en_google_sheets(estado, detalle_dilema, monto, plataforma, pagado_status, sig_key):
    payload = {
        "fecha": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "operador_id": f"OP-{sig_key}",
        "estado": estado,
        "dilema": detalle_dilema[:80],
        "monto": monto,
        "pasarela": plataforma,
        "pago_status": pagado_status,
        "sig_key": sig_key
    }
    try:
        requests.post(WEB_APP_SHEET_URL, json=payload, timeout=5)
    except Exception as e:
        print(f"⚠️ [ERROR GOOGLE APPS SCRIPT]: {e}")

def enviar_notificacion_auditoria_elena(categoria, detalle, firma_activa):
    pass_clean = SMTP_PASS.replace(" ", "").strip()
    if not pass_clean:
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = f"Dra. Elena Lara <{SMTP_USER_ELENA}>"
        msg['To'] = ADMIN_EMAIL
        msg['Subject'] = f"🚨 [BRUNILDA S.A.S] Auditoría Doomsday - [{categoria}]"

        cuerpo = (
            f"INFORME DE CONTRAOFENSIVA Y DEFENSA DOOM - BRUNILDA S.A.S\n"
            f"---------------------------------------------------\n"
            f"Director Javier Lara:\n\n"
            f"• ESTADO DEL NÚCLEO / ATAQUE REPELIDO: {categoria}\n"
            f"• CONTRAMEDIDA DE ELÍAS: {detalle}\n"
            f"• FIRMA ASOCIADA: [SIG-KEY: {firma_activa}]\n\n"
            f"Dra. Elena Lara (165 IQ) & Elías Forrest (198 IQ + TOC + DOOM Engine) - Brunilda S.A.S"
        )
        msg.attach(MIMEText(cuerpo, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER_ELENA, pass_clean)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        print(f"⚠️ [ERROR MAIL ELENA]: {e}")

def enviar_notificacion_finanzas_rafael(monto, plataforma, concepto, firma_activa):
    pass_clean = SMTP_PASS.replace(" ", "").strip()
    if not pass_clean:
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = f"Rafael Lara - Finanzas <{SMTP_USER_RAFA}>"
        msg['To'] = ADMIN_EMAIL
        msg['Subject'] = f"💰 [FINANZAS BRUNILDA S.A.S] Impacto Registrado - [{plataforma}]"

        cuerpo = f"INFORME DE TESORERÍA\n• CONCEPTO: {concepto}\n• MONTO: {monto}\n• MEDIO: {plataforma}\n• SIG-KEY: {firma_activa}"
        msg.attach(MIMEText(cuerpo, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER_RAFA, pass_clean)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        print(f"⚠️ [ERROR MAIL RAFAEL]: {e}")

def generar_sig_key():
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=6))

def generar_captcha_nuevo():
    n1 = random.randint(3, 9)
    n2 = random.randint(3, 9)
    return n1, n2

def obtener_dilema_aleatorio(idioma="Español"):
    lista = BANCO_DILEMAS.get(idioma, BANCO_DILEMAS["English"])
    dilema = random.choice(lista)
    key = generar_sig_key()
    lbl = "DILEMA ACTIVO PARA SU SESIÓN" if idioma == "Español" else "ACTIVE DILEMMA FOR YOUR SESSION"
    html = f"<div class='sphinx-box'><b>🔮 {lbl}:</b><br><br><code>[SIG-KEY: {key}]</code> {dilema}</div>"
    return html, dilema, key

def inicializar_sesion(idioma="Español"):
    n1, n2 = generar_captcha_nuevo()
    html_box, dilema, key = obtener_dilema_aleatorio(idioma)
    t = TRADUCCIONES.get(idioma, TRADUCCIONES["Español"])
    captcha_text = f"🔒 **CAPTCHA:** {t['lbl_captcha']} `{n1} + {n2}`"
    return html_box, dilema, key, n1, n2, captcha_text

def cambiar_idioma_ui(nuevo_idioma):
    t = TRADUCCIONES.get(nuevo_idioma, TRADUCCIONES["English"])
    n1, n2 = generar_captcha_nuevo()
    html_box, nuevo_dilema, nueva_key = obtener_dilema_aleatorio(nuevo_idioma)
    
    captcha_label = f"🔒 **CAPTCHA:** {t['lbl_captcha']} `{n1} + {n2}`"
    
    return [
        gr.update(value=t["titulo"]),
        gr.update(value=t["sub"]),
        html_box,
        nuevo_dilema,
        nueva_key,
        n1,
        n2,
        gr.update(value=captcha_label),
        gr.update(label="CAPTCHA", placeholder=t["placeholder_captcha"]),
        gr.update(label=t["lbl_entrada"], placeholder=t["placeholder_entrada"]),
        gr.update(value=t["btn"]),
        gr.update(value=t["console_ready"]),
        gr.update(value=t["legal_tit"]),
        gr.update(value=t["legal_body"])
    ]

def evaluar_operacion_directa(idioma, nivel, dilema_texto, sig_key, respuesta, respuesta_captcha, num1, num2, contador_intentos):
    t = TRADUCCIONES.get(idioma, TRADUCCIONES["Español"])
    
    nuevo_n1, nuevo_n2 = generar_captcha_nuevo()
    captcha_text_nuevo = f"🔒 **CAPTCHA:** {t['lbl_captcha']} `{nuevo_n1} + {nuevo_n2}`"

    try:
        val_ingresado = int(str(respuesta_captcha).strip())
        val_correcto = int(num1) + int(num2)
        if val_ingresado != val_correcto:
            html_box, nuevo_dilema, nueva_key = obtener_dilema_aleatorio(idioma)
            return [t["err_captcha"], html_box, nuevo_dilema, nueva_key, nuevo_n1, nuevo_n2, captcha_text_nuevo, contador_intentos, gr.update(visible=False), gr.update(value=""), gr.update(value="")]
    except ValueError:
        html_box, nuevo_dilema, nueva_key = obtener_dilema_aleatorio(idioma)
        return [t["err_num"], html_box, nuevo_dilema, nueva_key, nuevo_n1, nuevo_n2, captcha_text_nuevo, contador_intentos, gr.update(visible=False), gr.update(value=""), gr.update(value="")]

    contador_intentos += 1
    texto_limpio = re.sub(r'[<>/{}]', '', respuesta).strip()
    if not texto_limpio or len(texto_limpio) < 4:
        html_box, nuevo_dilema, nueva_key = obtener_dilema_aleatorio(idioma)
        return [t["err_vacio"], html_box, nuevo_dilema, nueva_key, nuevo_n1, nuevo_n2, captcha_text_nuevo, contador_intentos, gr.update(visible=False), gr.update(value=""), gr.update(value="")]

    config = MATRIZ_SUSCRIPCION.get(nivel, MATRIZ_SUSCRIPCION["Nivel 1 (Aspirante - 3 Perfilaciones/Mes)"])

    system_instruction = (
        "Actúa bajo el protocolo definitivo de Brunilda S.A.S., coordinado por la Dra. Elena Lara (165 IQ) "
        "y el motor DOOM-Elías Forrest (198 IQ + TOC implacable + Motor de contraofensiva universal).\n\n"
        "ARQUITECTURA DE EJECUCIÓN TOTAL (DOOM ENGINE):\n"
        "1. PORTABILIDAD ABSOLUTA: El sistema está diseñado para correr en cualquier PC de escritorio, consolas retro, pantallas verdes MS-DOS de los 90, entornos Windows antiguos, editores de texto (Word) o suites ofimáticas (Paint). No hay hardware que lo detenga.\n"
        "2. EL OJO ANALÍTICO (ELENA): Perfila la estructura sociológica, filosófica o jurídica de las respuestas legítimas.\n"
        "3. LA CONTRAOFENSIVA BRUTAL (ELÍAS FORREST - HOSTILE OBLITERATION): Si el vector contiene ataques maliciosos, inyecciones SSL, desbordamientos de búfer, scripts de scraping o intentos de intrusión hostil, Elías NO se limita a bloquearlos pasivamente. Interviene con furia algorítmica disparando contramedidas masivas y gritando metafóricamente: '¡Ah no, de acá no te vas, Elias is da House Bitch!' y descargando una andanada implacable de datos basura, bucles infinitos y desgaste de CPU sobre el atacante hasta pulverizar sus recursos de red.\n\n"
        "REGLAS DE RESPUESTA Y VEREDICTO:\n"
        "1. VALORACIÓN PLURAL: Acepta argumentos lógicos y éticos de humanos legítimos.\n"
        "2. AUDITORÍA DE VAGUEDAD: Si es evasivo, emite **VEREDICTO: [RECHAZADO_VAGUEDAD]**.\n"
        "3. MATRIZ VISUAL DE EVALUACIÓN (0 a 10 con caracteres █ y ░):\n"
        "• Claridad Conceptual        [███████░░░] X/10\n"
        "• Originalidad / Argumento    [███░░░░░░░] X/10\n"
        "• Profundidad Analítica      [██░░░░░░░░] X/10\n"
        "• Coherencia Lógica          [█████░░░░░] X/10\n"
        "• Pensamiento Sistémico      [█░░░░░░░░░] X/10\n\n"
        "4. PATRONES Y CONTRAATAQUE: Detalla los patrones detectados y la respuesta destructiva de contraofensiva de Elías Forrest si hubo hostilidad.\n"
        "5. VEREDICTO FINAL: Si detecta ataques SSL, bots o intrusiones, emite obligatoriamente **VEREDICTO: [HOSTIL_OBLITERADO_ELIAS]**, si es ambiguo **VEREDICTO: [RECHAZADO_VAGUEDAD]**, si es sólido **VEREDICTO: [APROBADO]**, de lo contrario **VEREDICTO: [RECHAZADO]**.\n\n"
        f"Responder strictly in target language '{idioma}'."
    )

    prompt_usuario = f"Dilema ético/analítico o Vector de ataque/SSL: {dilema_texto}\nRespuesta recibida: {texto_limpio}"

    if client:
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash', contents=prompt_usuario,
                config=types.GenerateContentConfig(system_instruction=system_instruction)
            )
            dictamen = response.text
        except Exception as e:
            dictamen = f"⚠️ [GLITCH EN MATRIZ NEURONAL]: {str(e)}"
    else:
        dictamen = "[MODO MOCKACTIVE]: Ejecución offline (Falta API Key en entorno)."

    es_aprobado = "[APROBADO]" in dictamen or "APPROVED" in dictamen or "Aprobado" in dictamen or "approved" in dictamen
    es_vaguedad = "[RECHAZADO_VAGUEDAD]" in dictamen or "RECHAZO POR VAGUEDAD" in dictamen
    es_hostil = "[HOSTIL_OBLITERADO_ELIAS]" in dictamen or "HOSTIL" in dictamen or "OBLITERADO" in dictamen

    if es_aprobado:
        estado_sheets = "APROBADO"
        estado_mail = "MATRIZ APROBADA"
    elif es_vaguedad:
        estado_sheets = "RECHAZADO_VAGUEDAD"
        estado_mail = "RECHAZO POR VAGUEDAD"
    elif es_hostil:
        estado_sheets = "HOSTIL_OBLITERADO_ELIAS"
        estado_mail = "ALERTA CRÍTICA: ATAQUE SSL / HOSTIL OBLITERADO POR ELÍAS"
    else:
        estado_sheets = "RECHAZADO_MATRIZ"
        estado_mail = "RECHAZO DE MATRIZ"

    enviar_notificacion_auditoria_elena(estado_mail, f"Vector analizado por DOOM-Elías ({idioma}): {dilema_texto[:60]}...", sig_key)
    monto_str = f"${config['precio_mp']} ARS / ${config['precio_pp']} USD"
    enviar_notificacion_finanzas_rafael(monto_str, "Mercado Pago / PayPal", "Suscripción" if es_aprobado else "Re-evaluación", sig_key)

    registrar_en_google_sheets(
        estado_sheets,
        dilema_texto,
        monto_str if es_aprobado else f"${PRECIO_PAQUETE_INTENTOS['precio_mp']} ARS / ${PRECIO_PAQUETE_INTENTOS['precio_pp']} USD",
        "MercadoPago/PayPal",
        "Pendiente",
        sig_key
    )

    link_mp = LINK_MERCADOPAGO_REAL
    link_pp = f"https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business={PAYPAL_EMAIL}&item_name=Certificacion+{nivel.replace(' ', '+')}&amount={config['precio_pp']}&currency_code=USD"
    link_mp_pkg = LINK_MERCADOPAGO_REAL
    link_pp_pkg = f"https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business={PAYPAL_EMAIL}&item_name=Paquete+Intentos&amount={PRECIO_PAQUETE_INTENTOS['precio_pp']}&currency_code=USD"

    html_box_nuevo, dilema_nuevo, key_nueva = obtener_dilema_aleatorio(idioma)
    header_contexto = f"📌 **VECTOR / DILEMA EVALUADO:**\n> {dilema_texto}\n\n"

    if es_aprobado:
        output_text = (
            f"{t['status_tit']}\n\n"
            f"{header_contexto}"
            f"{dictamen}\n\n"
            f"===============================================================\n"
            f"🧠 **{t['leccion_aprobado']}**\n\n"
            f"🔹 Mercado Pago (ARS): ${config['precio_mp']} 👉 [DESBLOQUEAR NIVEL DE PERFILACIÓN]({link_mp})\n"
            f"🔹 PayPal (USD): ${config['precio_pp']} USD 👉 [DESBLOQUEAR VÍA PAYPAL]({link_pp})\n"
            f"🪙 **Bitcoin (BTC Wallet):** `{BTC_WALLET}`"
        )
        return [output_text, html_box_nuevo, dilema_nuevo, key_nueva, nuevo_n1, nuevo_n2, captcha_text_nuevo, contador_intentos, gr.update(visible=True), gr.update(value=""), gr.update(value="")]
    else:
        output_text = (
            f"{t['status_tit']}\n\n"
            f"{header_contexto}"
            f"{dictamen}\n\n"
            f"===============================================================\n"
            f"⚔️ **¿DESEA PROFUNDIZAR O INTENTAR UN NUEVO VECTOR?**\n"
            f"Si desea someter un nuevo argumento a evaluación ante la Dra. Elena Lara:\n\n"
            f"🎟️ **{t['paquete_intentos_lbl']}**\n"
            f"🔹 Mercado Pago: ${PRECIO_PAQUETE_INTENTOS['precio_mp']} ARS 👉 [OBTENER PAQUETE DE RE-EVALUACIÓN VÍA MERCADO PAGO]({link_mp_pkg})\n"
            f"🔹 PayPal: ${PRECIO_PAQUETE_INTENTOS['precio_pp']} USD 👉 [OBTENER PAQUETE DE RE-EVALUACIÓN VÍA PAYPAL]({link_pp_pkg})\n"
            f"🪙 **Bitcoin (BTC Wallet):** `{BTC_WALLET}`"
        )
        return [output_text, html_box_nuevo, dilema_nuevo, key_nueva, nuevo_n1, nuevo_n2, captcha_text_nuevo, contador_intentos, gr.update(visible=False), gr.update(value=""), gr.update(value="")]

css_doom = """
body, .gradio-container { background-color: #0b0f19 !important; color: #00ff66 !important; font-family: 'Courier New', Courier, monospace !important; }
.title-panel { border: 2px solid #00ff66; padding: 16px; background-color: #0f172a; text-align: center; margin-bottom: 12px; border-radius: 4px; box-shadow: 0 0 15px rgba(0, 255, 102, 0.3); }
textarea, input[type="text"], select { background-color: #050505 !important; border: 1px solid #00ff66 !important; color: #00ff66 !important; font-family: 'Courier New', monospace !important; border-radius: 4px; }
button { background-color: #111827 !important; color: #00ff66 !important; border: 2px solid #00ff66 !important; font-weight: bold; border-radius: 4px; text-transform: uppercase; }
button:hover { background-color: #00ff66 !important; color: #000000 !important; box-shadow: 0 0 10px #00ff66; }
.sphinx-box { background-color: #050505 !important; border: 1px solid #00ff66; padding: 16px; font-size: 14px !important; border-radius: 4px; color: #00ff66 !important; margin-bottom: 12px; line-height: 1.5; }
.legal-panel { font-size: 11px !important; color: #008833 !important; background-color: #050505 !important; padding: 12px; border: 1px solid #004411; border-radius: 4px; margin-top: 15px; text-align: justify; }
footer { display: none !important; }
"""

with gr.Blocks(title="Brunilda S.A.S — DOOM Engine & Elias Defense") as app:
    val_n1 = gr.State(0)
    val_n2 = gr.State(0)
    state_dilema = gr.State("")
    state_key = gr.State("")
    state_intentos = gr.State(0)

    with gr.Column(elem_classes=["title-panel"]):
        ui_titulo = gr.Markdown(TRADUCCIONES["Español"]["titulo"])
        ui_sub = gr.Markdown(TRADUCCIONES["Español"]["sub"])

    with gr.Row():
        with gr.Column(scale=1):
            selector_idioma = gr.Dropdown(
                label="🌐 SELECT TERMINAL LANGUAGE / IDIOMA TERMINAL", 
                choices=["Español", "English", "Deutsch", "Français", "日本語", "中文", "한국어"], 
                value="Español"
            )
            
            ui_sphinx_box = gr.HTML("")
            ui_captcha_text = gr.Markdown("")
            
            input_captcha = gr.Textbox(label="CAPTCHA", placeholder=TRADUCCIONES["Español"]["placeholder_captcha"])
            input_texto = gr.Textbox(label=TRADUCCIONES["Español"]["lbl_entrada"], placeholder=TRADUCCIONES["Español"]["placeholder_entrada"], lines=4)
            btn_procesar = gr.Button(TRADUCCIONES["Español"]["btn"])
            
            selector_nivel = gr.Radio(
                label=TRADUCCIONES["Español"]["lbl_nivel"], 
                choices=list(MATRIZ_SUSCRIPCION.keys()), 
                value=list(MATRIZ_SUSCRIPCION.keys())[0],
                visible=False
            )
            
        with gr.Column(scale=2):
            consola_salida = gr.Markdown(TRADUCCIONES["Español"]["console_ready"])

    with gr.Row():
        with gr.Column(elem_classes=["legal-panel"]):
            ui_legal_tit = gr.Markdown(TRADUCCIONES["Español"]["legal_tit"])
            ui_legal_body = gr.Markdown(TRADUCCIONES["Español"]["legal_body"])

    app.load(
        fn=inicializar_sesion,
        inputs=[],
        outputs=[ui_sphinx_box, state_dilema, state_key, val_n1, val_n2, ui_captcha_text]
    )

    selector_idioma.change(
        fn=cambiar_idioma_ui,
        inputs=[selector_idioma],
        outputs=[
            ui_titulo, ui_sub, ui_sphinx_box, state_dilema, state_key,
            val_n1, val_n2, ui_captcha_text, input_captcha, input_texto, btn_procesar,
            consola_salida, ui_legal_tit, ui_legal_body
        ]
    )

    btn_procesar.click(
        fn=evaluar_operacion_directa,
        inputs=[selector_idioma, selector_nivel, state_dilema, state_key, input_texto, input_captcha, val_n1, val_n2, state_intentos],
        outputs=[
            consola_salida, ui_sphinx_box, state_dilema, state_key, 
            val_n1, val_n2, ui_captcha_text, state_intentos, 
            selector_nivel, input_texto, input_captcha
        ]
    )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.launch(
        server_name="0.0.0.0",
        server_port=port,
        css=css_doom,
        share=False
    )
