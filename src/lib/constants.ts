export const EXAMPLE_FLOW = {
  id: 'ejemplo-general',
  name: 'Ejemplo General',
  content: `El proceso inicia al llegar un cliente. Se le pregunta si tiene una reserva. Si la respuesta es sí, se verifica la reserva en el sistema y se le asigna una mesa. Si la respuesta es no, se comprueba si hay mesas disponibles. Si hay disponibilidad, se le asigna una mesa. Si no hay mesas, se le informa al cliente y se le ofrece esperar. Tanto si se le asigna mesa desde la reserva como si se le asigna por disponibilidad, el siguiente paso es tomar la orden. Después de tomar la orden, finaliza el proceso.`,
};
