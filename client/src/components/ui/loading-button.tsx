import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";

interface LoadingButtonProps extends ButtonProps {
    isLoading?: boolean;
    text?: string;
    loadingText: string;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
    ({ isLoading = false, text, loadingText, disabled, children, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                disabled={isLoading || disabled}
                {...props}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{loadingText}</span>
                    </div>
                ) : (
                    text || children
                )}
            </Button>
        );
    }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
