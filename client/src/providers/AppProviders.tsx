import { composeProviders } from "@/lib/provider";
import { UserProvider } from "@/contexts/UserContext";
import { UIProvider } from "@/contexts/ui/UIProvider";
import { ISOClauseProvider } from "@/contexts/ISOClauseContext";
import { DocumentTypeProvider } from "@/contexts/DocumentTypeContext";
import { DocumentProvider } from "@/contexts/DocumentContext";
import { ViewerProvider } from "@/contexts/DocumentReviewContext";

// Compose providers
export const AppProviders = composeProviders(
    UserProvider,
    DocumentTypeProvider,
    ISOClauseProvider,
    DocumentProvider,
    ViewerProvider,
    UIProvider,
    // Add more providers here
);
