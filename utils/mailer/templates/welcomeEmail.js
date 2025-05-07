export const getWelcomeEmailTemplate = (name, email, password, baseUrl) => {
  const logoDica =
    "https://dica-mx.com/wp-content/uploads/2022/12/cropped-botones-dica-300x200.png";

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Registro</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color:black;">
            <!-- Header con Logos lado a lado y centrados -->
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: inline-block;">
                    <img src="${logoDica}" alt="Logo Dica" style="width: 64px; height: 44px; vertical-align: middle; margin-right: 15px;">
                </div>
            </div>
            
            <!-- Contenido Principal -->
            <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                <h2 style="text-align: center; color: #2d2d2d; margin-top: 0; font-weight: 400; margin-bottom: 20px;">¡Bienvenid@ ${name}!</h2>
                
                <p style="margin-bottom: 25px;">Tu cuenta ha sido creada exitosamente. Ahora puedes acceder a todos nuestros servicios.</p>
                
                <!-- Datos de Acceso -->
                <div style="background-color: #f5f7fa; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
                    <h3 style="margin-top: 0; color: #2d2d2d; font-size: 16px; font-weight: 500;">Tus datos de acceso</h3>
                    <p style="margin-bottom: 5px;"><strong>Email:</strong> ${email}</p>
                    <p style="margin-bottom: 0;"><strong>Contraseña:</strong> ${password}</p>
                </div>
                
                <!-- Botón de Confirmación -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${baseUrl}" style="display: inline-block; background-color: #4A90E2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 500; letter-spacing: 0.5px;">Confirmar mi correo</a>
                </div>
                
                <p style="color: #777; font-size: 14px;">Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:</p>
                <p style="word-break: break-all; font-size: 14px; color: #4A90E2;">${baseUrl}</p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; color: #999; font-size: 13px;">
                <p>Si no has solicitado esta cuenta, puedes ignorar este correo.</p>
                <!-- Iconos de redes sociales lado a lado y centrados -->
                <div style="text-align: center; margin: 20px 0;">
                    <div style="display: inline-block;">
                        <img src="${logoDica}" alt="Dica" style="width: 64px; height: 44px; vertical-align: middle; margin-right: 15px;">
                    </div>
                </div>
                <p style="margin-top: 20px;">&copy; 2025 DICA MX. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};
