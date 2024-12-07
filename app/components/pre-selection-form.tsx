'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
// import { Label } from "@/components/ui/label"
import { Label } from "../components/ui/label"
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card"

interface PreSelectionFormProps {
  onSelect: (type: string) => void
}

export default function PreSelectionForm({ onSelect }: PreSelectionFormProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedType) {
      onSelect(selectedType)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Seleccione el tipo de formulario</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit} ref={formRef}>
        <CardContent>
          <RadioGroup 
            onValueChange={(value) => {
              setSelectedType(value)
              formRef.current?.requestSubmit()
            }} 
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="agente" id="agente" />
              <Label htmlFor="agente" onClick={() => formRef.current?.requestSubmit()}>Agente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="staff" id="staff" />
              <Label htmlFor="staff" onClick={() => formRef.current?.requestSubmit()}>Staff</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="contractor" id="contractor" />
              <Label htmlFor="contractor" onClick={() => formRef.current?.requestSubmit()}>Contractor</Label>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter>
          {/* El botón "Continuar" ya no es necesario */}
        </CardFooter>
      </form>
    </Card>
  )
}

