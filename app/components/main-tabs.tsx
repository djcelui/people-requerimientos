'use client'

import { useState } from 'react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
// import { Card, CardContent } from "@/components/ui/card"
import { Card, CardContent } from "../components/ui/card"
import { Clock, XCircle, CheckCircle } from 'lucide-react'
import PreSelectionForm from './pre-selection-form'
import AgenteForm from './agente-form'
import StaffForm from './staff-form'
import ContractorForm from './contractor-form'
import UserManagement from './user-management'
import StatusTab from './status-tab'
import { theme } from '../styles/theme'
// import { Button } from "@/components/ui/button"
import { Button } from "../components/ui/button"

const statusIcons = [
  { status: 'Pendiente', icon: Clock, color: theme.colors.warning },
  { status: 'Cancelado', icon: XCircle, color: theme.colors.error },
  { status: 'Completado', icon: CheckCircle, color: theme.colors.success }
]

export default function MainTabs() {
  const [activeTab, setActiveTab] = useState('requerimiento')
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const handleTypeSelection = (type: string) => {
    setSelectedType(type)
  }

  const handleVolverAPreForm = () => {
    setSelectedType(null)
  }

  const renderForm = () => {
    switch (selectedType) {
      case 'agente':
        return <AgenteForm />
      case 'staff':
        return <StaffForm />
      case 'contractor':
        return <ContractorForm />
      default:
        return <PreSelectionForm onSelect={handleTypeSelection} />
    }
  }

  return (
    <div className="space-y-4 p-6 bg-background text-text">
      <h1 className="text-3xl font-heading font-bold text-primary mb-6">Sistema de Gestión de Pedidos</h1>
      <div className="flex justify-center space-x-4 mb-6">
        {statusIcons.map(({ status, icon: Icon, color }) => (
          <Card key={status} className="w-auto border-l-4" style={{ borderLeftColor: color }}>
            <CardContent className="flex items-center p-2 space-x-2">
              <Icon className="h-4 w-4" style={{ color }} />
              <span className="text-sm font-medium">{status}</span>
            </CardContent>
          </Card>
        ))}
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-secondary text-background">
          <TabsTrigger value="requerimiento" className="data-[state=active]:bg-primary">Requerimiento Posiciones</TabsTrigger>
          <TabsTrigger value="training" className="data-[state=active]:bg-primary">Training</TabsTrigger>
          <TabsTrigger value="manager" className="data-[state=active]:bg-primary">Manager</TabsTrigger>
          <TabsTrigger value="operaciones" className="data-[state=active]:bg-primary">Operaciones</TabsTrigger>
          <TabsTrigger value="status" className="data-[state=active]:bg-primary">Status</TabsTrigger>
          <TabsTrigger value="usuarios" className="data-[state=active]:bg-primary">Usuarios</TabsTrigger>
        </TabsList>
        <TabsContent value="requerimiento">
          <div className="mt-6">
            {selectedType ? (
              <div>
                <Button onClick={handleVolverAPreForm} className="mb-4">Volver a la selección</Button>
                {renderForm()}
              </div>
            ) : (
              <PreSelectionForm onSelect={handleTypeSelection} />
            )}
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
          <div className="mt-6">
            <StatusTab />
          </div>
        </TabsContent>
        <TabsContent value="usuarios">
          <div className="mt-6">
            <UserManagement />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

