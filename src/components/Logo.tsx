import React from 'react'
import Image from 'next/image'

export function Logo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <Image
      src="/CRECHE.svg"
      alt="Estrela do Oriente"
      width={32}
      height={32}
      className={className}
      priority
    />
  )
}

export function LogoWithText({ showText = true, size = 'md' }: { showText?: boolean, size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { logo: 'w-6 h-6', text: 'text-sm' },
    md: { logo: 'w-8 h-8', text: 'text-base' },
    lg: { logo: 'w-16 h-16', text: 'text-xl' }
  }
  
  const currentSize = sizes[size]
  
  return (
    <div className="flex flex-col items-center gap-2">
      <Logo className={currentSize.logo} />
      {showText && (
        <span className={`font-bold text-[#0d833a] ${currentSize.text}`}>
          ESTRELA DO ORIENTE
        </span>
      )}
    </div>
  )
}
