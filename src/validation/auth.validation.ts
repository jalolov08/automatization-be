import Joi from "joi";

export const registrationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email не может быть пустым",
    "string.email": "Некорректный формат email",
  }),
  password: Joi.string()
    .min(6)
    .regex(/[a-z]/, "lowercase letter")
    .regex(/[A-Z]/, "uppercase letter")
    .regex(/[0-9]/, "number")
    .regex(/[\W_]/, "special character")
    .required()
    .messages({
      "string.empty": "Пароль не может быть пустым",
      "string.min": "Пароль должен содержать хотя бы 6 символов",
      "string.pattern.base":
        "Пароль должен содержать хотя бы одну строчную букву, одну заглавную букву, одну цифру и один специальный символ.",
    }),
  name: Joi.string().min(3).required().messages({
    "string.empty": "Имя не может быть пустым",
    "string.min": "Имя должно содержать хотя бы 3 символа",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email не может быть пустым",
    "string.email": "Некорректный формат email",
  }),
  password: Joi.string()
    .min(6)
    .regex(/[a-z]/, "lowercase letter")
    .regex(/[A-Z]/, "uppercase letter")
    .regex(/[0-9]/, "number")
    .regex(/[\W_]/, "special character")
    .required()
    .messages({
      "string.empty": "Пароль не может быть пустым",
      "string.min": "Пароль должен содержать хотя бы 6 символов",
      "string.pattern.base":
        "Пароль должен содержать хотя бы одну строчную букву, одну заглавную букву, одну цифру и один специальный символ.",
    }),
});
