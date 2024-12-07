'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AgenteForm from './agente-form'
import StaffForm from './staff-form'
import ContractorForm from './contractor-form'

export default function FormTabs({ initialTab = 'requerimiento', tipoUsuario }) {
  const [activeTab, setActiveTab] = useState(initialTab)

  const renderForm = () => {
    switch (tipoUsuario) {
      case 'agente':
        return <AgenteForm />
      case 'staff':
        return <StaffForm />
      case 'contractor':
        return <ContractorForm />
      default:
        return null
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="requerimiento">Requerimiento Posiciones</TabsTrigger>
        <TabsTrigger value="training">Training</TabsTrigger>
        <TabsTrigger value="manager">Manager</TabsTrigger>
        <TabsTrigger value="operaciones">Operaciones</TabsTrigger>
        <TabsTrigger value="status">Status</TabsTrigger>
      </TabsList>
      <TabsContent value="requerimiento">
        <div className="mt-6">
          {renderForm()}
        </div>
      </TabsContent>
      <TabsContent value="training">
        <div className="mt-6">Contenido de Training</div>
      </TabsContent>
      <TabsContent value="manager">
        <div className="mt-6">Contenido de Manager</div>
      </TabsContent>
      <TabsContent value="operaciones">
        <div className="mt-6">Contenido de Operaciones</div>
      </TabsContent>
      <TabsContent value="status">
        <div className="mt-6">Contenido de Status</div>
      </TabsContent>
    </Tabs>
  )
}

