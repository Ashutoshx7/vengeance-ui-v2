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
            duration: 0.8,
            easing: (t) => 1 - Math.pow(1 - t, 4),
            touchMultiplier: 1.5,
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
