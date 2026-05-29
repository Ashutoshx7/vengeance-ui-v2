'use client'
import { ReactNode, useEffect, useRef } from 'react'
import Lenis from 'lenis'

export interface SmoothScrollProps {
    children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
    const rafRef = useRef<number>(0)

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.05,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 0.85,
            touchMultiplier: 1.2,
            infinite: false,
        })

        function raf(time: number) {
            lenis.raf(time)
            rafRef.current = requestAnimationFrame(raf)
        }

        rafRef.current = requestAnimationFrame(raf)

        return () => {
            cancelAnimationFrame(rafRef.current)
            lenis.destroy()
        }
    }, [])

    return <>{children}</>
}

export default SmoothScroll
