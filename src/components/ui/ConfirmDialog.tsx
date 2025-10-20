'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './Button'
import { Card, CardContent, CardHeader } from './Card'
import { AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Props do componente ConfirmDialog
 */
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger' | 'warning'
  loading?: boolean
}

/**
 * Componente de diálogo de confirmação moderno
 * Substitui o window.confirm nativo por uma interface mais elegante
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  loading = false
}) => {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const variantStyles = {
    default: {
      icon: <AlertTriangle className="h-6 w-6 text-blue-600" />,
      iconBg: 'bg-blue-100',
      confirmVariant: 'primary' as const
    },
    danger: {
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      iconBg: 'bg-red-100',
      confirmVariant: 'danger' as const
    },
    warning: {
      icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
      iconBg: 'bg-yellow-100',
      confirmVariant: 'primary' as const
    }
  }

  const styles = variantStyles[variant]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        
        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md"
        >
          <Card className="shadow-strong">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', styles.iconBg)}>
                    {styles.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  {cancelText}
                </Button>
                <Button
                  variant={styles.confirmVariant}
                  onClick={handleConfirm}
                  loading={loading}
                >
                  {confirmText}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Hook para usar o ConfirmDialog
 */
export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [config, setConfig] = React.useState<{
    title: string
    message: string
    onConfirm: () => void
    variant?: 'default' | 'danger' | 'warning'
  } | null>(null)

  const confirm = (config: {
    title: string
    message: string
    onConfirm: () => void
    variant?: 'default' | 'danger' | 'warning'
  }) => {
    setConfig(config)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setConfig(null)
  }

  const handleConfirm = () => {
    if (config?.onConfirm) {
      config.onConfirm()
    }
    close()
  }

  return {
    isOpen,
    config,
    confirm,
    close,
    handleConfirm
  }
}
