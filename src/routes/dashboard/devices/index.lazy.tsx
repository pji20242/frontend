import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createLazyFileRoute('/dashboard/devices/')({
  component: Devices,
})

export type Device = {
  id: string
  significancia: number
  dono: string
  leitura: number
  cooperativa: string
  ultimaLeitura: string
}

const data: Device[] = [
  {
    id: 'device1',
    significancia: 1500,
    dono: 'João Silva',
    leitura: 2500,
    cooperativa: 'Cooperativa Central',
    ultimaLeitura: '2024-02-15T10:30:00Z',
  },
  {
    id: 'device2',
    significancia: 1200,
    dono: 'Maria Souza',
    leitura: 2200,
    cooperativa: 'Cooperativa Rural',
    ultimaLeitura: '2024-02-14T15:45:00Z',
  },
]

export function Devices() {
  const [searchTerm, setSearchTerm] = React.useState('')

  // Filter devices based on search term
  const filteredDevices = data.filter(
    (device) =>
      device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.dono.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.cooperativa.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <h2 className="text-3xl mb-8">Dispositivos</h2>

      <div className="mb-6">
        <Input
          placeholder="Buscar por ID, dono ou cooperativa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.length > 0 ? (
          filteredDevices.map((device) => (
            <Card key={device.id} className="w-full">
              <CardHeader>
                <CardTitle>Dispositivo {device.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Valor de Significância:</span>
                    <span>{device.significancia}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Dono:</span>
                    <span>{device.dono}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Leitura:</span>
                    <span>{device.leitura}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Cooperativa:</span>
                    <span>{device.cooperativa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Última Leitura:</span>
                    <span>
                      {new Date(device.ultimaLeitura).toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/dashboard/devices/${device.id}/readings`}>
                  <Button variant="outline" className="w-full">
                    Ver Leituras
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            Nenhum dispositivo encontrado.
          </div>
        )}
      </div>
    </div>
  )
}
