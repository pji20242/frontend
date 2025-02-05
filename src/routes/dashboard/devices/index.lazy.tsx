import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import axios from 'axios'
import React from 'react'

export const Route = createLazyFileRoute('/dashboard/devices/')({
  component: Devices,
})

export type Device = {
  uuid: string
  peso: number
  dono: string
  leitura: number
  cooperativa: string
  ultimaLeitura: string
}

// API function to fetch devices
const fetchDevices = async (): Promise<Device[]> => {
  const { data } = await axios.get('/api/v1/devices')

  // Ensure we always return an array
  return Array.isArray(data) ? data : []
}

export function Devices() {
  const [searchTerm, setSearchTerm] = React.useState('')

  // Use React Query to fetch devices
  const {
    data: devices = [],
    isLoading,
    isError,
    error
  } = useQuery<Device[], Error>({
    queryKey: ['devices'],
    queryFn: fetchDevices,
    // Add retry logic if needed
    retry: 1,
  })

  // Ensure devices is always an array before filtering
  const filteredDevices = (devices || []).filter(
    (device) =>
      device.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.dono.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.cooperativa.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span>Carregando dispositivos...</span>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="text-red-500 text-center">
        Erro ao carregar dispositivos: {error.message}
      </div>
    )
  }

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
            <Card key={device.uuid} className="w-full">
              <CardHeader>
                <CardTitle>Dispositivo {device.uuid}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Valor de Significância:</span>
                    <span>{device.peso}</span>
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
                <Link to={`/dashboard/devices/${device.uuid}`}>
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