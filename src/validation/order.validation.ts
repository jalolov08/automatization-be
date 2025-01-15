import Joi from "joi";

export const createOrderSchema = Joi.object({
  clientId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/, "ObjectId")
    .required()
    .messages({
      "string.empty": "ID клиента не может быть пустым",
      "string.pattern.base": "Неверный формат clientId, должен быть ObjectId",
      "any.required": "ID клиента обязателен",
    }),
  orderType: Joi.string()
    .valid("single", "bulk")
    .required()
    .messages({
      "string.base": "Тип заказа должен быть строкой",
      "any.only": "Тип заказа может быть только 'single' или 'bulk'",
      "any.required": "Тип заказа обязателен",
    }),
  type: Joi.string()
    .valid("purchase", "sale")
    .required()
    .messages({
      "string.base": "Тип должен быть строкой",
      "any.only": "Тип может быть только 'purchase' или 'sale'",
      "any.required": "Тип обязателен",
    }),
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/, "ObjectId")
          .required()
          .messages({
            "string.empty": "ID продукта не может быть пустым",
            "string.pattern.base": "Неверный формат productId, должен быть ObjectId",
            "any.required": "ID продукта обязателен",
          }),
        quantity: Joi.number().integer().greater(0).required().messages({
          "number.base": "Количество должно быть числом",
          "number.greater": "Количество должно быть больше 0",
          "any.required": "Количество продукта обязательно",
        }),
        price: Joi.number().greater(0).required().messages({
          "number.base": "Цена должна быть числом",
          "number.greater": "Цена должна быть больше 0",
          "any.required": "Цена продукта обязательна",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Продукты должны быть массивом",
      "array.min": "Необходимо указать хотя бы один продукт",
      "any.required": "Список продуктов обязателен",
    }),
  totalCost: Joi.number().greater(0).required().messages({
    "number.base": "Общая стоимость должна быть числом",
    "number.greater": "Общая стоимость должна быть больше 0",
    "any.required": "Общая стоимость обязательна",
  }),
  profit: Joi.number().required().messages({
    "number.base": "Прибыль должна быть числом",
    "any.required": "Прибыль обязательна",
  }),
  deliveryConditions: Joi.string()
    .valid("pickup", "courier")
    .required()
    .messages({
      "string.base": "Условие доставки должно быть строкой",
      "any.only": "Условие доставки может быть только 'pickup' или 'courier'",
      "any.required": "Условие доставки обязательно",
    }),
  date: Joi.string()
    .optional()
    .messages({
      "string.base": "Дата должна быть строкой",
    }),
  status: Joi.string()
    .valid("processing", "completed", "canceled")
    .optional()
    .messages({
      "string.base": "Статус заказа должен быть строкой",
      "any.only": "Статус заказа может быть только 'processing', 'completed' или 'canceled'",
    }),
});

export const updateOrderSchema = Joi.object({
  status: Joi.string()
    .valid("processing", "completed", "canceled")
    .required()
    .messages({
      "string.base": "Статус заказа должен быть строкой",
      "any.only": "Статус заказа может быть только 'processing', 'completed' или 'canceled'",
      "any.required": "Статус заказа обязателен",
    }),
});
