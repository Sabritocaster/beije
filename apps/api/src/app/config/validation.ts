import * as Joi from 'joi';

export const validationSchema = Joi.object({
  MONGODB_URI: Joi.string()
    .uri({ scheme: ['mongodb', 'mongodb+srv'] })
    .default('mongodb://localhost:27017/beije'),
  APP_BASE_URL: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .default('http://localhost:3333'),
  EMAIL_FROM: Joi.string()
    .email({ tlds: false })
    .default('no-reply@beije.local'),
  EMAIL_SMTP_HOST: Joi.string().optional(),
  EMAIL_SMTP_PORT: Joi.number().port().optional(),
  EMAIL_SMTP_SECURE: Joi.boolean()
    .truthy('true')
    .falsy('false')
    .optional(),
  EMAIL_SMTP_USER: Joi.string().optional(),
  EMAIL_SMTP_PASS: Joi.string().optional(),
});
