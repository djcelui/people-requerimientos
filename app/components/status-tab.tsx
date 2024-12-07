'use client'

import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Button } from "@/app/components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Solicitud {
  id: number;
  lote_id: string;
  requisition_id: string;
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
  createdAt: string;
}

export default function StatusTab() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [expandedLotes, setExpandedLotes] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    fetchSolicitudes()
  }, [])

  const fetchSolicitudes = async () => {
    try {
      const response = await fetch('/api/solicitudes')
      if (!response.ok) {
        throw new Error('Failed to fetch solicitudes')
      }
      const data = await response.json()
      setSolicitudes(data)
    } catch (error) {
      console.error('Error fetching solicitudes:', error)
    }
  }

  const toggleLote = (loteId: string) => {
    setExpandedLotes(prev => ({
      ...prev,
      [loteId]: !prev[loteId]
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'text-yellow-500'
      case 'Cancelado':
        return 'text-red-500'
      case 'Completado':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  const groupedSolicitudes = solicitudes.reduce((acc, solicitud) => {
    if (!acc[solicitud.lote_id]) {
      acc[solicitud.lote_id] = []
    }
    acc[solicitud.lote_id].push(solicitud)
    return acc
  }, {} as {[key: string]: Solicitud[]})

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Status de Pedidos</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lote ID</TableHead>
            <TableHead>Cantidad de Solicitudes</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha de Creación</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupedSolicitudes).map(([loteId, solicitudesLote]) => (
            <React.Fragment key={loteId}>
              <TableRow className="bg-background hover:bg-accent/10">
                <TableCell>{loteId}</TableCell>
                <TableCell>{solicitudesLote.length}</TableCell>
                <TableCell>
                  <span className={`font-medium ${getStatusColor(solicitudesLote[0].estado)}`}>
                    {solicitudesLote[0].estado}
                  </span>
                </TableCell>
                <TableCell>{new Date(solicitudesLote[0].createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLote(loteId)}
                    aria-expanded={expandedLotes[loteId]}
                    aria-controls={`lote-details-${loteId}`}
                  >
                    {expandedLotes[loteId] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <span className="sr-only">{expandedLotes[loteId] ? 'Collapse' : 'Expand'} lote details</span>
                  </Button>
                </TableCell>
              </TableRow>
              {expandedLotes[loteId] && (
                <TableRow id={`lote-details-${loteId}`}>
                  <TableCell colSpan={5}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Requisition ID</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>País</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {solicitudesLote.map((solicitud) => (
                          <TableRow key={solicitud.requisition_id}>
                            <TableCell>{solicitud.requisition_id}</TableCell>
                            <TableCell>{solicitud.tipo}</TableCell>
                            <TableCell>{solicitud.pais}</TableCell>
                            <TableCell>{solicitud.cliente}</TableCell>
                            <TableCell>
                              <span className={`font-medium ${getStatusColor(solicitud.estado)}`}>
                                {solicitud.estado}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

