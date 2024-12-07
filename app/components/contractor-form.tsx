'use client'

import React, { useState } from 'react'
import BaseForm from './base-form'
import { Button } from "@/app/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { PlusCircle, Trash2 } from 'lucide-react'

interface Registro {
  id?: number;
  lote_id?: string;
  requisition_id?: string;
  tipo: string;
  pais: string;
  fechaIngreso: string;
  cliente: string;
  canal: string;
  cargaHoraria: string;
  horarioIn: string;
  horarioOut: string;
  diasLibres: string;
  area: string;
  estado: string;
}

export default function ContractorForm() {
  const [registros, setRegistros] = useState<Registro[]>([])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const nuevoRegistro: Registro = {
      tipo: 'contractor',
      pais: formData.get('pais') as string,
      fechaIngreso: formData.get('fechaIngreso') as string,
      cliente: formData.get('cliente') as string,
      canal: formData.get('canal') as string,
      cargaHoraria: formData.get('cargaHoraria') as string,
      horarioIn: formData.get('horarioIn') as string,
      horarioOut: formData.get('horarioOut') as string,
      diasLibres: formData.get('diasLibres') as string,
      area: formData.get('area') as string,
      estado: formData.get('estado') as string,
    }
    setRegistros([...registros, nuevoRegistro])
  }

  const handleDelete = async (index: number) => {
    if (registros[index].id) {
      await fetch('/api/solicitudes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: registros[index].id }),
      })
    }
    setRegistros(registros.filter((_, i) => i !== index))
  }

  const handleConfirmarTodo = async () => {
    const registrosSinConfirmar = registros.filter(registro => !registro.id)
    if (registrosSinConfirmar.length > 0) {
      const response = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrosSinConfirmar),
      })
      const data = await response.json()
      console.log('Confirmando todos los registros:', data)

      // Actualizar los registros locales con los nuevos IDs
      const updatedRegistros = registros.map(registro => {
        if (!registro.id) {
          const matchingResult = data.results.find(result => result.requisition_id === registro.requisition_id)
          return { ...registro, id: matchingResult.id, lote_id: matchingResult.lote_id, requisition_id: matchingResult.requisition_id }
        }
        return registro
      })
      setRegistros(updatedRegistros)
    }
  }

  const handleCancelarTodo = () => {
    setRegistros([])
  }

  const handleLimpiar = () => {
    const form = document.getElementById('contractorForm') as HTMLFormElement
    if (form) form.reset()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Formulario para Contractor</h2>
      <form id="contractorForm" onSubmit={handleSubmit} className="space-y-6">
        <BaseForm />
        <div className="flex justify-between">
          <Button type="submit" className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar
          </Button>
          <Button type="button" variant="outline" onClick={handleLimpiar}>
            Limpiar
          </Button>
        </div>
      </form>

      {registros.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lote ID</TableHead>
                <TableHead>Requisition ID</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Fecha de Ingreso</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Carga Horaria</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registros.map((registro, index) => (
                <TableRow key={index}>
                  <TableCell>{registro.lote_id || 'Pendiente'}</TableCell>
                  <TableCell>{registro.requisition_id || 'Pendiente'}</TableCell>
                  <TableCell>{registro.pais}</TableCell>
                  <TableCell>{registro.fechaIngreso}</TableCell>
                  <TableCell>{registro.cliente}</TableCell>
                  <TableCell>{registro.canal}</TableCell>
                  <TableCell>{registro.cargaHoraria}</TableCell>
                  <TableCell>{`${registro.horarioIn} - ${registro.horarioOut}`}</TableCell>
                  <TableCell>{registro.estado}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end space-x-4 mt-4">
            <Button onClick={handleConfirmarTodo}>Confirmar Todo</Button>
            <Button variant="destructive" onClick={handleCancelarTodo}>Cancelar Todo</Button>
          </div>
        </>
      )}
    </div>
  )
}

