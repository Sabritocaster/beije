export default () => ({
  app: {
    baseUrl: process.env.APP_BASE_URL ?? 'http://localhost:3333',
  },
  database: {
    uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/beije',
  },
  email: {
    from: process.env.EMAIL_FROM ?? 'no-reply@beije.local',
    smtp: process.env.EMAIL_SMTP_HOST
      ? {
          host: process.env.EMAIL_SMTP_HOST,
          port: Number(process.env.EMAIL_SMTP_PORT ?? 587),
          secure:
            (process.env.EMAIL_SMTP_SECURE ?? 'false').toLowerCase() ===
            'true',
          auth: process.env.EMAIL_SMTP_USER
            ? {
                user: process.env.EMAIL_SMTP_USER,
                pass: process.env.EMAIL_SMTP_PASS,
              }
            : undefined,
        }
      : null,
  },
});
