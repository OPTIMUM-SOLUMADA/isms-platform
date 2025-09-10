import { useState, useEffect } from "react"

export function useIsMobile(breakpoint: number = 768) {
    // breakpoint defaults to Tailwind's md (768px)
    const [isMobile, setIsMobile] = useState<boolean>(
        typeof window !== "undefined" ? window.innerWidth < breakpoint : false
    )

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint)
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [breakpoint])

    return isMobile
}