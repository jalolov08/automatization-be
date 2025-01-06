import Joi from "joi";

export const passwordValidationSchema = Joi.object({
  currentPassword: Joi.string().min(6).required().messages({
    "string.base": "Текущий пароль должен быть строкой.",
    "string.min": "Текущий пароль должен содержать хотя бы 6 символов.",
    "any.required": "Текущий пароль обязателен.",
  }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/[a-z]/, "lowercase letter")
    .pattern(/[A-Z]/, "uppercase letter")
    .pattern(/[0-9]/, "number")
    .pattern(/[\W_]/, "special character")
    .required()
    .messages({
      "string.base": "Новый пароль должен быть строкой.",
      "string.min": "Новый пароль должен содержать хотя бы 8 символов.",
      "string.pattern.base":
        "Новый пароль должен содержать хотя бы одну строчную букву, одну заглавную букву, одну цифру и один специальный символ.",
      "any.required": "Новый пароль обязателен.",
    }),
});
