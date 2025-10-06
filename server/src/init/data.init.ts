import { DocumentTypeService } from '@/services/documenttype.service';
import { ISOClauseService } from '@/services/isoclause.service';
import { OwnerService } from '@/services/owner.service';

export const initData = async () => {
    const ownerService = new OwnerService();
    const documentTypeService = new DocumentTypeService();
    const clauseService = new ISOClauseService();

    try {
        console.log('[init] Initializing data...');
        await ownerService.initialize();
        await documentTypeService.initialize();
        await clauseService.initialize();
    } catch (err) {
        console.error('[init] Failed to initialize data:', err);
    } finally {
        console.log('[init] Initialization done!');
    }
};
