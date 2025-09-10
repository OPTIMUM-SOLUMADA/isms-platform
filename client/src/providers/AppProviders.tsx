import { composeProviders } from "@/lib/provider";
import { UserProvider } from "@/contexts/UserContext";
import { DepartmentProvider } from "@/contexts/DepartmentContext";
import { UserUIProvider } from "@/contexts/ui/UserUIContext";
import { ISOClauseProvider } from "@/contexts/ISOClauseContext";
import { DocumentTypeProvider } from "@/contexts/DocumentTypeContext";
import { DocumentProvider } from "@/contexts/DocumentContext";
import { ViewerProvider } from "@/contexts/DocumentReviewContext";

// Compose providers
export const AppProviders = composeProviders(
    DepartmentProvider,
    UserProvider,
    DocumentTypeProvider,
    ISOClauseProvider,
    DocumentProvider,
    ViewerProvider,
    UserUIProvider,
    // Add more providers here
);
