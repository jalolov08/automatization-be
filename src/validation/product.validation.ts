import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Имя продукта не может быть пустым",
    "string.base": "Название должно быть строкой",
    "string.min": "Название должно содержать не менее 3 символов",
    "string.max": "Название должно содержать не более 100 символов",
    "any.required": "Название продукта обязательно",
  }),
  description: Joi.string().optional().max(500).messages({
    "string.base": "Описание должно быть строкой",
    "string.max": "Описание не должно превышать 500 символов",
  }),
  weight: Joi.number().greater(0).optional().messages({
    "number.base": "Вес должен быть числом",
    "number.greater": "Вес должен быть больше 0",
  }),
  categoryId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/, "ObjectId")
    .required()
    .messages({
      "string.empty": "Категория не может быть пустой",
      "string.pattern.base": "Неверный формат categoryId, должен быть ObjectId",
      "any.required": "Категория обязательна",
    }),
  residue: Joi.number().min(0).required().messages({
    "number.base": "Остаток должен быть числом",
    "number.min": "Остаток не может быть меньше 0",
    "any.required": "Остаток обязателен",
  }),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional().messages({
    "string.empty": "Имя продукта не может быть пустым",
    "string.base": "Название должно быть строкой",
    "string.min": "Название должно содержать не менее 3 символов",
    "string.max": "Название должно содержать не более 100 символов",
  }),
  description: Joi.string().optional().max(500).messages({
    "string.base": "Описание должно быть строкой",
    "string.max": "Описание не должно превышать 500 символов",
  }),
  weight: Joi.number().greater(0).optional().messages({
    "number.base": "Вес должен быть числом",
    "number.greater": "Вес должен быть больше 0",
  }),
  categoryId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/, "ObjectId")
    .optional()
    .messages({
      "string.pattern.base": "Неверный формат categoryId, должен быть ObjectId",
    }),
  residue: Joi.number().min(0).optional().messages({
    "number.base": "Остаток должен быть числом",
    "number.min": "Остаток не может быть меньше 0",
  }),
});
