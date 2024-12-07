import { useState, useEffect } from 'react'
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

const paises = ['ARG', 'CHL', 'PAR', 'URU', 'COL']
const canales = ['Digital', 'Telefónico', 'Presencial']
const cargasHorarias = ['5 x 6', '5 x 7', '5 x 8', '5 x 9', '6 x 6', '6 x 7', '6 x 8', '6 x 9']
const estados = ['Pendiente', 'Cancelado', 'Completado']

export default function BaseForm() {
  const [horarioIn, setHorarioIn] = useState('09:00')
  const [cargaHoraria, setCargaHoraria] = useState('5 x 8')
  const [diasLibres, setDiasLibres] = useState('2')
  const [horarioOut, setHorarioOut] = useState('17:00')

  useEffect(() => {
    const [dias, horas] = cargaHoraria.split(' x ').map(Number)
    setDiasLibres((7 - dias).toString())

    const [horasIn, minutosIn] = horarioIn.split(':').map(Number)
    const horasSalida = new Date(2023, 0, 1, horasIn + horas, minutosIn)
    setHorarioOut(horasSalida.toTimeString().slice(0, 5))
  }, [cargaHoraria, horarioIn])

  const generateTimeOptions = () => {
    const options = []
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = i.toString().padStart(2, '0')
        const minute = j.toString().padStart(2, '0')
        options.push(`${hour}:${minute}`)
      }
    }
    return options
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="pais">País</Label>
        <Select name="pais" defaultValue={paises[0]}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un país" />
          </SelectTrigger>
          <SelectContent>
            {paises.map((pais) => (
              <SelectItem key={pais} value={pais}>{pais}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
        <Input id="fechaIngreso" name="fechaIngreso" type="date" />
      </div>
      <div>
        <Label htmlFor="cliente">Cliente</Label>
        <Input id="cliente" name="cliente" />
      </div>
      <div>
        <Label htmlFor="canal">Canal</Label>
        <Select name="canal" defaultValue={canales[0]}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un canal" />
          </SelectTrigger>
          <SelectContent>
            {canales.map((canal) => (
              <SelectItem key={canal} value={canal}>{canal}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="cargaHoraria">Carga Horaria</Label>
        <Select name="cargaHoraria" value={cargaHoraria} onValueChange={setCargaHoraria}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione la carga horaria" />
          </SelectTrigger>
          <SelectContent>
            {cargasHorarias.map((carga) => (
              <SelectItem key={carga} value={carga}>{carga}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="horarioIn">Horario de Entrada</Label>
        <Select name="horarioIn" value={horarioIn} onValueChange={setHorarioIn}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione el horario de entrada" />
          </SelectTrigger>
          <SelectContent>
            {generateTimeOptions().map((time) => (
              <SelectItem key={time} value={time}>{time}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="horarioOut">Horario de Salida</Label>
        <Input id="horarioOut" name="horarioOut" value={horarioOut} readOnly />
      </div>
      <div>
        <Label htmlFor="diasLibres">Días Libres</Label>
        <Input id="diasLibres" name="diasLibres" value={diasLibres} readOnly />
      </div>
      <div>
        <Label htmlFor="area">Área</Label>
        <Input id="area" name="area" />
      </div>
      <div>
        <Label htmlFor="estado">Estado</Label>
        <Select name="estado" defaultValue="Pendiente">
          <SelectTrigger>
            <SelectValue placeholder="Seleccione el estado" />
          </SelectTrigger>
          <SelectContent>
            {estados.map((estado) => (
              <SelectItem key={estado} value={estado}>{estado}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

