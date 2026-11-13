export function errorHttp(status, message) {
  return Object.assign(new Error(message), {
    status
  });
}

// Express 4 necesita derivar explícitamente los rechazos al middleware de errores.
export const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
