"use strict";

class BadRequestError extends Error {
  constructor(message, details = {}, name) {
    super();
    this.name    = name || "BadRequestError";
    this.status  = 400;
    this.message = message;
    this.path    = details.path;
    this.key     = details.key;
  }
}

class UnauthorizedError extends BadRequestError {
  constructor(message, details) {
    super(message, details, "UnauthorizedError");
    this.status = 401;
  }
}

class ForbiddenError extends BadRequestError {
  constructor(message, details) {
    super(message, details, "ForbiddenError");
    this.status = 403;
  }
}

class NotFoundError extends BadRequestError {
  constructor(message, details) {
    super(message, details, "NotFoundError");
    this.status = 404;
  }
}

class ConflictError extends BadRequestError {
  constructor(message, details) {
    super(message, details, "ConflictError");
    this.status = 409;
  }
}

class UnprocessableContentError extends BadRequestError {
  constructor(message, details) {
    super(message, details, "UnprocessableContentError");
    this.status = 422;
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableContentError
};
