import Joi from "joi";

export const passwordValidationSchema = Joi.object({
  currentPassword: Joi.string().min(6).required().messages({
    "string.empty": "Пароль не может быть пустым",
    "string.base": "Текущий пароль должен быть строкой.",
    "string.min": "Текущий пароль должен содержать хотя бы 6 символов.",
    "any.required": "Текущий пароль обязателен.",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.base": "Новый пароль должен быть строкой.",
    "string.min": "Новый пароль должен содержать хотя бы 6 символов.",
    "string.pattern.base":
      "Новый пароль должен содержать хотя бы одну строчную букву, одну заглавную букву, одну цифру и один специальный символ.",
    "any.required": "Новый пароль обязателен.",
  }),
});
