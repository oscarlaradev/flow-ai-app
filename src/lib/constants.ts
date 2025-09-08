export const EXAMPLE_FLOWS = [
  {
    id: "purchase-flow",
    name: "Flujo de Compra",
    content: `// Proceso de Compra en Línea
INICIO: Cliente visita el sitio web

(Navegar productos)
- Cliente busca y filtra artículos.

(Seleccionar un artículo)

<¿Hay producto en stock?>
  [Sí] -> (Añadir al carrito)
    -> [/Ver carrito y proceder al pago/]
    -> <¿Usuario está registrado?>
      [Sí] -> (Validar sesión)
        -> (Confirmar pedido)
      [No] -> [/Crear cuenta o pagar como invitado/]
        -> (Confirmar pedido)
    -> (Confirmar pedido)
    -> [[Generar factura]]
    -> FIN: Compra exitosa
  [No] -> (Mostrar mensaje 'Agotado')
    -> (Sugerir productos similares)
    -> (Navegar productos)`,
  },
  {
    id: "login-flow",
    name: "Flujo de Inicio de Sesión",
    content: `// Autenticación de Usuario
INICIO: Usuario navega a la página de inicio de sesión

[/Usuario ingresa credenciales (email, contraseña)/]

(Enviar formulario)

<¿Credenciales son válidas?>
  [Sí] -> (Crear token de sesión)
    -> (Redirigir al panel de control)
    -> FIN: Inicio de sesión exitoso
  [No] -> (Mostrar mensaje de error)
    -> [/Usuario ingresa credenciales (email, contraseña)/]`,
  },
  {
    id: "error-handling",
    name: "Manejo de Errores",
    content: `// Manejo de Errores en Petición de API
INICIO: Realizar petición a la API

(Petición enviada al servidor)

<¿Petición fue exitosa?>
  [Sí] -> (Procesar datos de respuesta)
    -> FIN: Proceso completo
  [No] -> <¿Es un error de red?>
    [Sí] -> (Reintentar petición después de 5 segundos)
      -> INICIO
    [No] -> (Registrar error en servicio de monitoreo)
      -> (Mostrar mensaje de error genérico al usuario)
      -> FIN: Proceso fallido`,
  },
];
