/**
 * Email template for document review reminder
 * Used by the document-review-reminder job
 */

export interface DocumentReviewEmailData {
    recipientName: string;
    documentTitle: string;
    reviewDate: string;
    documentId: string;
    loginUrl: string;
}

export function getDocumentReviewReminderEmailTemplate(data: DocumentReviewEmailData): string {
    const { recipientName, documentTitle, reviewDate, documentId, loginUrl } = data;

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Review Required</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #0066cc;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
        }
        .document-info {
            background-color: white;
            padding: 15px;
            margin: 20px 0;
            border-left: 4px solid #0066cc;
        }
        .document-info strong {
            color: #0066cc;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #0066cc;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 0.9em;
        }
        .alert-box {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Révision de Document Requise</h1>
    </div>
    
    <div class="content">
        <p>Bonjour <strong>${recipientName}</strong>,</p>
        
        <p>Ce message vous informe qu'un document nécessite votre attention pour révision.</p>
        
        <div class="document-info">
            <p><strong>Document :</strong> ${documentTitle}</p>
            <p><strong>Date de révision prévue :</strong> ${reviewDate}</p>
            <p><strong>Référence :</strong> ${documentId}</p>
        </div>
        
        <div class="alert-box">
            <p><strong>⚠️ Actions automatiques effectuées :</strong></p>
            <ul>
                <li>Le document a été <strong>dépublié</strong> s'il était publié</li>
                <li>Le statut du document a été changé en <strong>"En révision"</strong></li>
            </ul>
        </div>
        
        <p>Veuillez vous connecter à la plateforme ISMS pour effectuer votre révision dans les plus brefs délais.</p>
        
        <center>
            <a href="${loginUrl}" class="button">Accéder à la plateforme</a>
        </center>
        
        <p style="margin-top: 30px;">Si vous avez des questions concernant cette révision, n'hésitez pas à contacter l'équipe de gestion documentaire.</p>
    </div>
    
    <div class="footer">
        <p>Cet email a été envoyé automatiquement par le système ISMS Platform</p>
        <p>© ${new Date().getFullYear()} ISMS Solumada - Tous droits réservés</p>
    </div>
</body>
</html>
    `.trim();
}
