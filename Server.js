// ============================================================================
// ENDPOINT CENTRAL OMNICANAL DE DEFENSA ACTIVA (API GATEWAY)
// ============================================================================
app.post('/api/v1/defender', verificarLicenciaComercial, async (req, res) => {
    const { remitente, textoMensaje, canalOrigen, subCanalDestino } = normalizarPayloadEntrante(req);
    
    // Verificación de exclusión por whitelist de seguridad
    if (esNumeroExcluido(remitente)) {
        return res.status(200).json({
            status: "ACCESO_EXCLUIDO_WHITELIST",
            remitente: remitente,
            mensaje: "Nodo en lista blanca. Tráfico autorizado sin inspección de contrainteligencia."
        });
    }

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

    // Paso 2: Elena perfila el mensaje entrante
    // MODIFICACIÓN: Si la perfilación falla (denegación por defecto)
    const perfil = await ejecutarPerfilacionElena(textoMensaje, canalOrigen);
    
    // Blindaje: Si Elena no pudo perfilar (perfil es nulo o error), denegamos por seguridad
    if (!perfil || perfil.tipo_emisor === "desconocido") {
        console.error(`[ALERTA DE SEGURIDAD]: Error en perfilación o caída del núcleo. Denegando por seguridad.`);
        return res.status(403).json({
            error: "ERR_SYSTEM_SECURITY_LOCKDOWN",
            mensaje: "El sistema de seguridad no pudo validar el origen. Acceso denegado por defecto."
        });
    }

    console.log(`[ELENA PROFILER]: Canal [${canalOrigen}] -> Tipo: ${perfil.tipo_emisor} | Amenaza: ${perfil.nivel_amenaza}`);

    // Si es un usuario o mensaje legítimo
    if (perfil.nivel_amenaza === "Bajo" && perfil.tipo_emisor === "humano_legitimo") {
        return res.status(200).json({
            status: "ACCESO_AUTORIZADO_GABRIELA",
            canal: canalOrigen,
            perfil: perfil,
            mensaje: "Estructura validada. Tráfico legítimo para operaciones comerciales y microcréditos de Gabriela."
        });
    }

    // Paso 3: Si es amenaza o vector hostil
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
