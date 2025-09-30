import { DocumentOwnerService } from '@/services/documentowner.service';
import { DocumentTypeService } from '@/services/documenttype.service';
import { ISOClauseService } from '@/services/isoclause.service';

export const initData = async () => {
    const ownserService = new DocumentOwnerService();
    const documentTypeService = new DocumentTypeService();
    const clauseService = new ISOClauseService();

    try {
        console.log('[init] Initializing data...');
        await ownserService.initialize(['SOLUMADA']);
        await documentTypeService.initialize();
        await clauseService.initialize();
    } catch (err) {
        console.error('[init] Failed to initialize data:', err);
    } finally {
        console.log('[init] Initialization done!');
    }
};
