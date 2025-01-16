import Joi from "joi";

export const createClientSchema = Joi.object({
  fullName: Joi.string()
    .max(100)
    .required()
    .messages({
      "string.base": "ФИО должно быть строкой",
      "string.max": "ФИО не может быть длиннее 100 символов",
      "any.required": "ФИО обязательно",
    }),
  contactInfo: Joi.object({
    phone: Joi.string()
      .pattern(/^[\+]{0,1}(\d[\d\(\)\ -]{4,}\d)$/, "Phone Number")
      .required()
      .messages({
        "string.base": "Номер телефона должен быть строкой",
        "string.pattern.base": "Неверный формат номера телефона",
        "any.required": "Номер телефона обязателен",
      }),
    email: Joi.string()
      .email()
      .optional()
      .messages({
        "string.email": "Неверный формат email",
      }),
    address: Joi.string()
      .optional()
      .messages({
        "string.base": "Адрес должен быть строкой",
      }),
  })
    .required()
    .messages({
      "object.base": "Контактная информация должна быть объектом",
      "any.required": "Контактная информация обязательна",
    }),
  status: Joi.string()
    .valid("active", "inactive")
    .required()
    .messages({
      "string.base": "Статус должен быть строкой",
      "any.only": "Статус может быть только 'active' или 'inactive'",
      "any.required": "Статус обязателен",
    }),
});

export const updateClientSchema = Joi.object({
  fullName: Joi.string()
    .max(100)
    .optional()
    .messages({
      "string.base": "ФИО должно быть строкой",
      "string.max": "ФИО не может быть длиннее 100 символов",
    }),
  contactInfo: Joi.object({
    phone: Joi.string()
      .pattern(/^[\+]{0,1}(\d[\d\(\)\ -]{4,}\d)$/, "Phone Number")
      .optional()
      .messages({
        "string.base": "Номер телефона должен быть строкой",
        "string.pattern.base": "Неверный формат номера телефона",
      }),
    email: Joi.string()
      .email()
      .optional()
      .messages({
        "string.email": "Неверный формат email",
      }),
    address: Joi.string()
      .optional()
      .messages({
        "string.base": "Адрес должен быть строкой",
      }),
  })
    .optional()
    .messages({
      "object.base": "Контактная информация должна быть объектом",
    }),
  status: Joi.string()
    .valid("active", "inactive")
    .optional()
    .messages({
      "string.base": "Статус должен быть строкой",
      "any.only": "Статус может быть только 'active' или 'inactive'",
    }),
});