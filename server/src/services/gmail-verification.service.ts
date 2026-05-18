export class GmailVerificationService {
    /**
     * Vérifie si une adresse email utilise Gmail/Google Workspace
     * Supporte les domaines @gmail.com et les domaines personnalisés configurés avec Google Workspace
     * @param email L'adresse email à vérifier
     * @returns true si l'email utilise Gmail/Google Workspace, false sinon
     */
    async verifyGmailAccount(email: string): Promise<boolean> {
        if (!email || !this.validateEmailFormat(email)) {
            return false;
        }

        try {
            // Méthode 1: Vérifier via l'API de vérification Google
            // Cette API vérifie si l'email existe dans l'écosystème Google (Gmail + Google Workspace)
            const response = await fetch(
                'https://accounts.google.com/_/signin/v1/lookup',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        email: email,
                        lookup_flow_name: 'glif',
                    }),
                    signal: AbortSignal.timeout(5000), // 5 secondes de timeout
                }
            );

            // Si Google répond avec succès, l'email utilise Gmail/Google Workspace
            if (response.ok) {
                return true;
            }

            // Méthode 2: Si la première méthode échoue, vérifier les enregistrements MX du domaine
            // pour voir s'ils pointent vers Google
            const domain = email.split('@')[1];
            if (domain) {
                return await this.checkMXRecordsForGoogle(domain);
            }

            return false;
        } catch (error) {
            console.error('Gmail verification error:', error);
            
            // Fallback: vérifier les MX records
            try {
                const domain = email.split('@')[1];
                if (domain) {
                    return await this.checkMXRecordsForGoogle(domain);
                }
            } catch (mxError) {
                console.error('MX check error:', mxError);
            }
            
            // Si tout échoue, on ne peut pas confirmer
            return false;
        }
    }

    /**
     * Vérifie si le domaine utilise les serveurs Gmail en examinant les enregistrements MX
     * @param domain Le domaine à vérifier
     * @returns true si le domaine utilise Google, false sinon
     */
    private async checkMXRecordsForGoogle(domain: string): Promise<boolean> {
        try {
            const dns = await import('dns');
            const { promisify } = await import('util');
            const resolveMx = promisify(dns.resolveMx);

            const mxRecords = await resolveMx(domain);
            
            // Les serveurs MX de Google contiennent généralement 'google.com' ou 'googlemail.com'
            const hasGoogleMX = mxRecords.some(record => 
                record.exchange.toLowerCase().includes('google.com') ||
                record.exchange.toLowerCase().includes('googlemail.com') ||
                record.exchange.toLowerCase().includes('aspmx.l.google.com')
            );

            return hasGoogleMX;
        } catch (error) {
            console.error('MX records check failed:', error);
            return false;
        }
    }

    /**
     * Validation de base du format d'email
     * @param email L'adresse email à valider
     * @returns true si le format est valide
     */
    private validateEmailFormat(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    /**
     * Validation de base du format d'email Gmail
     * @param email L'adresse email à valider
     * @returns true si le format est valide
     */
    private validateGmailFormat(email: string): boolean {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        return gmailRegex.test(email);
    }

    /**
     * Vérifie si plusieurs adresses Gmail sont valides
     * @param emails Liste des adresses à vérifier
     * @returns Objet avec les résultats de vérification pour chaque email
     */
    async verifyMultipleGmailAccounts(emails: string[]): Promise<Record<string, boolean>> {
        const results: Record<string, boolean> = {};
        
        // Limiter le nombre de vérifications simultanées pour ne pas surcharger l'API
        const batchSize = 3;
        for (let i = 0; i < emails.length; i += batchSize) {
            const batch = emails.slice(i, i + batchSize);
            const batchResults = await Promise.all(
                batch.map(async (email) => ({
                    email,
                    valid: await this.verifyGmailAccount(email),
                }))
            );
            
            batchResults.forEach(({ email, valid }) => {
                results[email] = valid;
            });
        }
        
        return results;
    }
}

export const gmailVerificationService = new GmailVerificationService();
