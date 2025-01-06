export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

export class InternalServerError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = 500;
  }
}
