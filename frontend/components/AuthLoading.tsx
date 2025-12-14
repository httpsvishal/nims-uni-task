"use client"

import React from "react"
import { GraduationCap } from "lucide-react"

export const AuthLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-blue-600 rounded-full animate-pulse">
          <GraduationCap className="h-12 w-12 text-white" />
        </div>
        <div className="text-lg font-medium text-gray-600 dark:text-gray-300">
          Loading...
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          NIMS University
        </div>
      </div>
    </div>
  )
}
