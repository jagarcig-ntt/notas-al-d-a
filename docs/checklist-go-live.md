# Checklist de go-live




Antes de hacer merge de un cambio importante, responde **sí o no** a cada punto. Si hay un "no", decide a sabiendas: lo arreglas, aceptas el riesgo o no sales.




| # | Pregunta | Sí / No |

|---|---|---|

| 1 | ¿Lo que sale ha pasado por un PR revisado, con checks en verde? | |

| 2 | ¿Se ha probado en la preview del PR, con el flujo principal de usuario de principio a fin? | |

| 3 | ¿Están configuradas en producción todas las variables y secretos que necesita? | |

| 4 | ¿Cambia algo en la base de datos? Si es así, ¿se puede deshacer? | |

| 5 | ¿Sabemos cómo volver atrás y cuánto se tarda? | |

| 6 | ¿Hay forma de apagarlo sin cambiar el código (*feature flag*)? | |

| 7 | ¿Alguien estará mirando las señales durante la primera hora tras salir? | |

| 8 | ¿Saben soporte y los usuarios afectados lo que cambia? | |




## Recuerda

- **Los cambios de base de datos de Lovable se aplican al pulsar *Allow*,** antes del PR. Si borran o cambian permisos, haz el merge justo después.

- **Volver atrás en Cloudflare:** *Workers & Pages → tu Worker → Deployments → versión anterior → Rollback*. No deshace los cambios de base de datos.

- **Después de salir, abre tu web.** Verde no significa que funcione.
