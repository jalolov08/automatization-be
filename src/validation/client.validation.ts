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
  }).required().messages({
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
  debt: Joi.object({
    totalDebt: Joi.number()
      .min(0)
      .required()
      .messages({
        "number.base": "Общий долг должен быть числом",
        "number.min": "Общий долг не может быть отрицательным",
        "any.required": "Общий долг обязателен",
      }),
    transactions: Joi.array()
      .items(
        Joi.object({
          purchaseId: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/, "ObjectId")
            .required()
            .messages({
              "string.pattern.base": "Неверный формат purchaseId, должен быть ObjectId",
              "any.required": "purchaseId обязателен",
            }),
          amount: Joi.number()
            .greater(0)
            .required()
            .messages({
              "number.base": "Сумма должна быть числом",
              "number.greater": "Сумма должна быть больше 0",
              "any.required": "Сумма обязательна",
            }),
          date: Joi.string()
            .pattern(/^\d{4}-\d{2}-\d{2}$/, "Date Format")
            .required()
            .messages({
              "string.pattern.base": "Неверный формат даты, должен быть 'YYYY-MM-DD'",
              "any.required": "Дата обязательна",
            }),
        })
      )
      .min(1)
      .required()
      .messages({
        "array.base": "Транзакции долга должны быть массивом",
        "array.min": "Необходимо указать хотя бы одну транзакцию",
        "any.required": "Транзакции обязательны",
      }),
  }).required().messages({
    "object.base": "Информация о долге должна быть объектом",
    "any.required": "Информация о долге обязательна",
  }),
  totalPurchases: Joi.object({
    totalCount: Joi.number()
      .integer()
      .min(0)
      .required()
      .messages({
        "number.base": "Общее количество покупок должно быть числом",
        "number.min": "Общее количество покупок не может быть отрицательным",
        "any.required": "Общее количество покупок обязательно",
      }),
    wholesaleCount: Joi.number()
      .integer()
      .min(0)
      .required()
      .messages({
        "number.base": "Количество оптовых покупок должно быть числом",
        "number.min": "Количество оптовых покупок не может быть отрицательным",
        "any.required": "Количество оптовых покупок обязательно",
      }),
    retailCount: Joi.number()
      .integer()
      .min(0)
      .required()
      .messages({
        "number.base": "Количество розничных покупок должно быть числом",
        "number.min": "Количество розничных покупок не может быть отрицательным",
        "any.required": "Количество розничных покупок обязательно",
      }),
  }).required().messages({
    "object.base": "Информация о покупках должна быть объектом",
    "any.required": "Информация о покупках обязательна",
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
  }).optional(),
  status: Joi.string()
    .valid("active", "inactive")
    .optional()
    .messages({
      "string.base": "Статус должен быть строкой",
      "any.only": "Статус может быть только 'active' или 'inactive'",
    }),
  debt: Joi.object({
    totalDebt: Joi.number()
      .min(0)
      .optional()
      .messages({
        "number.base": "Общий долг должен быть числом",
        "number.min": "Общий долг не может быть отрицательным",
      }),
    transactions: Joi.array()
      .items(
        Joi.object({
          purchaseId: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/, "ObjectId")
            .optional()
            .messages({
              "string.pattern.base": "Неверный формат purchaseId, должен быть ObjectId",
            }),
          amount: Joi.number()
            .greater(0)
            .optional()
            .messages({
              "number.base": "Сумма должна быть числом",
              "number.greater": "Сумма должна быть больше 0",
            }),
          date: Joi.string()
            .pattern(/^\d{4}-\d{2}-\d{2}$/, "Date Format") // Date format check
            .optional()
            .messages({
              "string.pattern.base": "Неверный формат даты, должен быть 'YYYY-MM-DD'",
            }),
        })
      )
      .optional(),
  }).optional(),
  totalPurchases: Joi.object({
    totalCount: Joi.number()
      .integer()
      .min(0)
      .optional()
      .messages({
        "number.base": "Общее количество покупок должно быть числом",
        "number.min": "Общее количество покупок не может быть отрицательным",
      }),
    wholesaleCount: Joi.number()
      .integer()
      .min(0)
      .optional()
      .messages({
        "number.base": "Количество оптовых покупок должно быть числом",
        "number.min": "Количество оптовых покупок не может быть отрицательным",
      }),
    retailCount: Joi.number()
      .integer()
      .min(0)
      .optional()
      .messages({
        "number.base": "Количество розничных покупок должно быть числом",
        "number.min": "Количество розничных покупок не может быть отрицательным",
      }),
  }).optional(),
});
