import React from "react"
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb" // ShadCN re-export
import { ChevronRightIcon } from "lucide-react"
import { Link } from "react-router-dom"

export type BreadcrumbItemType = {
    label: string
    href?: string
    onClick?: () => void
}

type BreadcrumbNavProps = {
    items: BreadcrumbItemType[]
    /** Optional custom separator icon */
    separatorIcon?: React.ReactNode
    /** Optional custom className */
    className?: string
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
    items,
    separatorIcon = <ChevronRightIcon className="h-4 w-4" />,
    className,
}) => {
    return (
        <Breadcrumb className={className}>
            <BreadcrumbList>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1
                    return (
                        <React.Fragment key={index}>
                            <BreadcrumbItem className="text-xs">
                                {item.href ? (
                                    <Link to={item.href} className="transition-colors hover:text-theme-2-muted text-muted-foreground">{item.label}</Link>
                                ) : (
                                    <span
                                        onClick={item.onClick}
                                        className={item.onClick ? "cursor-pointer" : ""}
                                    >
                                        {item.label}
                                    </span>
                                )}
                            </BreadcrumbItem>
                            {!isLast && (
                                <BreadcrumbSeparator>{separatorIcon}</BreadcrumbSeparator>
                            )}
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
