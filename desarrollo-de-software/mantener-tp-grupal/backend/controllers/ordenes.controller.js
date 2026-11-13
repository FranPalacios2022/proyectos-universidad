export function crearOrdenesController(service) {
  return {
    listar: async (req, res) => res.json(await service.listar(req.usuario, req.query)),
    obtener: async (req, res) => res.json(await service.obtener(req.usuario, req.params.id)),
    crear: async (req, res) => res.status(201).json(await service.crear(req.usuario, req.body)),
    modificar: async (req, res) => res.json(await service.modificar(req.usuario, req.params.id, req.body)),
    cancelar: async (req, res) => res.json(await service.modificar(req.usuario, req.params.id, {
      estado: 'cancelada'
    })),
    asignar: async (req, res) => res.json(await service.modificar(req.usuario, req.params.id, {
      tecnicoId: req.body.tecnicoId
    })),
    resolver: async (req, res) => res.json(await service.modificar(req.usuario, req.params.id, {
      estado: 'resuelta'
    })),
    historial: async (req, res) => res.json(await service.verHistorial(req.usuario, req.params.id)),
    resumen: async (req, res) => res.json(await service.resumen())
  };
}
