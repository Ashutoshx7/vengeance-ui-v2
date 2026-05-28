"use client";

import React from 'react'
import dynamic from 'next/dynamic'
import Hero from '@/components/landing/hero';

// Below-the-fold sections loaded lazily for faster initial paint
const TechStack = dynamic(() => import('@/components/landing/tech-stack'), { ssr: false })
const ComponentsGrid = dynamic(() => import('@/components/landing/components-gird'), { ssr: false })
const Features = dynamic(() => import('@/components/landing/features'), { ssr: false })
const Testimonial = dynamic(() => import('@/components/landing/testimonial'), { ssr: false })
const CTA = dynamic(() => import('@/components/landing/cta'), { ssr: false })
const Footer = dynamic(() => import('@/components/landing/footer'), { ssr: false })

const SmoothScroll = dynamic(() => import('@/components/landing/smooth-scroll'), { ssr: false })

export default function Home(): React.ReactNode {
    return (
        <SmoothScroll>
            <main>
                <Hero />
                <TechStack />
                <ComponentsGrid />
                <Features />
                <Testimonial />
                <CTA />
                <Footer />
            </main>
        </SmoothScroll>
    )
}
