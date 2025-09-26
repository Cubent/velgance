import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_TOKEN);

export interface ModelApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location: string;
  height: string;
  weight?: string;
  gender: string;
  instagram?: string;
  experience?: string;
  availability?: string;
  additionalInfo?: string;
  portfolioUrl?: string;
}

/**
 * Generate HTML email template for model application notification to admin
 */
function generateModelApplicationAdminEmailHTML(data: ModelApplicationData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nuova Candidatura Modello - Velgance Agency</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; background: white;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">
            Velgance Agency
          </h1>
          <p style="margin: 8px 0 0 0; color: #cccccc; font-size: 16px;">
            Nuova Candidatura Modello
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 20px;">
          <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
            Candidatura Ricevuta
          </h2>
          
          <div style="background: #f0f0f0; border-left: 4px solid #000000; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
            <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.5;">
              È stata ricevuta una nuova candidatura per diventare modello presso Velgance Agency.
            </p>
          </div>

          <h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px; font-weight: 600;">
            📋 Dettagli Candidato
          </h3>

          <!-- Personal Information -->
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 16px; background: white;">
            <h4 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
              Informazioni Personali
            </h4>
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="padding: 4px 0; color: #6b7280; font-weight: 500; width: 30%;">Nome:</td>
                <td style="padding: 4px 0; color: #1f2937;">${data.firstName} ${data.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #6b7280; font-weight: 500;">Email:</td>
                <td style="padding: 4px 0; color: #1f2937;">${data.email}</td>
              </tr>
              ${data.phone ? `
              <tr>
                <td style="padding: 4px 0; color: #6b7280; font-weight: 500;">Telefono:</td>
                <td style="padding: 4px 0; color: #1f2937;">${data.phone}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 4px 0; color: #6b7280; font-weight: 500;">Città:</td>
                <td style="padding: 4px 0; color: #1f2937;">${data.location}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #6b7280; font-weight: 500;">Genere:</td>
                <td style="padding: 4px 0; color: #1f2937;">${data.gender === 'female' ? 'Donna' : 'Uomo'}</td>
              </tr>
            </table>
          </div>

          <!-- Physical Characteristics -->
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 16px; background: white;">
            <h4 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
              Caratteristiche Fisiche
            </h4>
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="padding: 4px 0; color: #6b7280; font-weight: 500; width: 30%;">Altezza:</td>
                <td style="padding: 4px 0; color: #1f2937;">${data.height}</td>
              </tr>
              ${data.weight ? `
              <tr>
                <td style="padding: 4px 0; color: #6b7280; font-weight: 500;">Peso:</td>
                <td style="padding: 4px 0; color: #1f2937;">${data.weight}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <!-- Social Media -->
          ${data.instagram ? `
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 16px; background: white;">
            <h4 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
              Social Media
            </h4>
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="padding: 4px 0; color: #6b7280; font-weight: 500; width: 30%;">Instagram:</td>
                <td style="padding: 4px 0; color: #1f2937;">${data.instagram}</td>
              </tr>
            </table>
          </div>
          ` : ''}

          <!-- Additional Information -->
          ${data.experience || data.availability || data.additionalInfo ? `
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 16px; background: white;">
            <h4 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
              Informazioni Aggiuntive
            </h4>
            ${data.experience ? `
              <div style="margin-bottom: 12px;">
                <strong style="color: #6b7280; font-size: 14px;">Esperienza:</strong>
                <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 14px; line-height: 1.5;">${data.experience}</p>
              </div>
            ` : ''}
            ${data.availability ? `
              <div style="margin-bottom: 12px;">
                <strong style="color: #6b7280; font-size: 14px;">Disponibilità:</strong>
                <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 14px; line-height: 1.5;">${data.availability}</p>
              </div>
            ` : ''}
            ${data.additionalInfo ? `
              <div style="margin-bottom: 12px;">
                <strong style="color: #6b7280; font-size: 14px;">Note aggiuntive:</strong>
                <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 14px; line-height: 1.5;">${data.additionalInfo}</p>
              </div>
            ` : ''}
          </div>
          ` : ''}

          <!-- Portfolio -->
          ${data.portfolioUrl ? `
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 16px; background: white;">
            <h4 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
              Portfolio
            </h4>
            <p style="margin: 0; color: #1f2937; font-size: 14px;">
              📎 File allegato: ${data.portfolioUrl}
            </p>
          </div>
          ` : ''}

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">
              Questa candidatura è stata inviata tramite il sito web di Velgance Agency.
            </p>
            <p style="margin: 0; color: #6b7280; font-size: 12px;">
              Data di ricezione: ${new Date().toLocaleDateString('it-IT', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate HTML email template for confirmation to applicant
 */
function generateModelApplicationConfirmationEmailHTML(data: ModelApplicationData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Candidatura Ricevuta - Velgance Agency</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; background: white;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">
            Velgance Agency
          </h1>
          <p style="margin: 8px 0 0 0; color: #cccccc; font-size: 16px;">
            Dal 1998 trasformiamo il talento in opportunità
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 20px;">
          <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
            Grazie ${data.firstName}!
          </h2>
          
          <div style="background: #f0f0f0; border-left: 4px solid #000000; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
            <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.5;">
              La tua candidatura è stata ricevuta con successo. Il nostro team la esaminerà e ti contatteremo presto.
            </p>
          </div>

          <h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px; font-weight: 600;">
            📋 Prossimi Passi
          </h3>

          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 16px; background: white;">
            <ol style="margin: 0; padding-left: 20px; color: #1f2937; font-size: 14px; line-height: 1.6;">
              <li style="margin-bottom: 8px;">Il nostro team di casting esaminerà la tua candidatura</li>
              <li style="margin-bottom: 8px;">Se il tuo profilo è interessante, ti contatteremo per un colloquio</li>
              <li style="margin-bottom: 8px;">Ti informeremo di opportunità di lavoro adatte al tuo profilo</li>
              <li>Inizierai il tuo percorso professionale nel mondo della moda</li>
            </ol>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
              💡 Nel frattempo...
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px; line-height: 1.6;">
              <li>Mantieni il tuo portfolio aggiornato</li>
              <li>Segui i nostri social media per le ultime novità</li>
              <li>Continua a curare la tua forma fisica</li>
            </ul>
          </div>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">
              Per qualsiasi domanda, non esitare a contattarci:
            </p>
            <p style="margin: 0; color: #1f2937; font-size: 14px; font-weight: 500;">
              📧 info@velgance.com
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; padding: 24px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            © 2024 Velgance Agency. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send model application notification email to admin
 */
export async function sendModelApplicationAdminEmail(data: ModelApplicationData): Promise<boolean> {
  try {
    const result = await resend.emails.send({
      from: 'Velgance Agency <noreply@velgance.com>',
      to: ['info@velgance.com'],
      subject: `📋 Nuova Candidatura Modello: ${data.firstName} ${data.lastName}`,
      html: generateModelApplicationAdminEmailHTML(data),
    });

    console.log(`Model application admin email sent to info@velgance.com`, result);
    return true;
  } catch (error) {
    console.error('Error sending model application admin email:', error);
    return false;
  }
}

/**
 * Send confirmation email to model applicant
 */
export async function sendModelApplicationConfirmationEmail(data: ModelApplicationData): Promise<boolean> {
  try {
    const result = await resend.emails.send({
      from: 'Velgance Agency <noreply@velgance.com>',
      to: [data.email],
      subject: '✅ Candidatura Ricevuta - Velgance Agency',
      html: generateModelApplicationConfirmationEmailHTML(data),
    });

    console.log(`Model application confirmation email sent to ${data.email}`, result);
    return true;
  } catch (error) {
    console.error('Error sending model application confirmation email:', error);
    return false;
  }
}
