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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'

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

interface DeviceRegistrationForm {
  username: string
  password: string
  cooperativa: string
  dono: string
}

export function Devices() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [formData, setFormData] = React.useState<DeviceRegistrationForm>({
    username: '',
    password: '',
    cooperativa: '',
    dono: '',
  })

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

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/v1/mqttusers', formData)
      console.log('Device registered:', response.data)
      toast.success('Dispositivo cadastrado com sucesso')
      setIsDialogOpen(false)
      setFormData({
        username: '',
        password: '',
        cooperativa: '',
        dono: '',
      })
    } catch (error) {
      console.error('Error registering device:', error)
      toast.error('Falha ao cadastrar dispositivo. Tente novamente.')
    }
  }

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

      <div className="mb-6 flex gap-4 items-center justify-between">
        <Input
          placeholder="Buscar por ID, dono ou cooperativa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              Cadastrar Dispositivo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Dispositivo</DialogTitle>
              <DialogDescription>
                Preencha as informações abaixo para cadastrar um novo dispositivo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cooperativa" className="text-right">
                    Cooperativa
                  </Label>
                  <Input
                    id="cooperativa"
                    name="cooperativa"
                    value={formData.cooperativa}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dono" className="text-right">
                    Dono
                  </Label>
                  <Input
                    id="dono"
                    name="dono"
                    value={formData.dono}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-green-500 hover:bg-green-600">
                  Cadastrar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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