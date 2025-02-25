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
import { Plus, X } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

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
  user: string
  uuid: string
  latitude: number
  longitude: number
  sensors: string[]
}

interface RegistrationResult {
  username: string
  password: string
  uuid: string
}

interface User {
  matricula: string
  nome: string
  email: string
  user: string
  ativo: boolean
  licencas: number
}

export function Devices() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [registrationResult, setRegistrationResult] = React.useState<RegistrationResult | null>(null)
  const [formData, setFormData] = React.useState<DeviceRegistrationForm>({
    user: '',
    uuid: '',
    latitude: 0,
    longitude: 0,
    sensors: ['']
  })
  const [users, setUsers] = React.useState<User[]>([])

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

  // Fetch users when dialog opens
  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>('/api/v1/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Erro ao carregar usuários')
    }
  }

  // Handle dialog open
  const handleDialogOpen = (open: boolean) => {
    if (open) {
      fetchUsers()
    }
    setIsDialogOpen(open)
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle sensor input changes
  const handleSensorChange = (index: number, value: string) => {
    setFormData(prev => {
      const newSensors = [...prev.sensors]
      newSensors[index] = value
      return { ...prev, sensors: newSensors }
    })
  }

  // Add new sensor input
  const addSensor = () => {
    if (formData.sensors.length < 7) {
      setFormData(prev => ({
        ...prev,
        sensors: [...prev.sensors, '']
      }))
    }
  }

  // Remove sensor input
  const removeSensor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sensors: prev.sensors.filter((_, i) => i !== index)
    }))
  }

  // Generate random password
  const generatePassword = () => {
    const length = 12
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      password += charset[randomIndex]
    }
    return password
  }

  // UUID validation function
  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Generate password
    const password = generatePassword()
    
    // Validate UUID or generate a new one
    let finalUUID = formData.uuid
    if (!formData.uuid || !isValidUUID(formData.uuid)) {
      finalUUID = uuidv4()
      toast.info('UUID inválido ou não fornecido. Um novo UUID foi gerado.')
    }
    
    try {
      // First API call - Register MQTT user with UUID as username
      await axios.post('/api/v1/mqttusers', {
        username: finalUUID,
        password: password,
        mosquitto_super: true
      })

      // Second API call - Register MQTT ACL with UUID as username
      await axios.post('/api/v1/mqttacls', {
        username: finalUUID,
        topic: 'pji3',
        rw: 1
      })

      // Store the registration result
      setRegistrationResult({
        username: finalUUID,
        password: password,
        uuid: finalUUID
      })

      toast.success('Dispositivo cadastrado com sucesso')
      setIsDialogOpen(false)
      setFormData({
        user: '',
        uuid: '',
        latitude: 0,
        longitude: 0,
        sensors: ['']
      })
    } catch (error) {
      console.error('Error registering device:', error)
      toast.error('Falha ao cadastrar dispositivo')
    }
  }

  // Optional: Real-time UUID validation
  const handleUUIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      uuid: value
    }))

    // Show validation feedback as user types
    if (value && !isValidUUID(value)) {
      toast.warning('UUID inválido. Deixe em branco para gerar automaticamente.')
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
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              Cadastrar Dispositivo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Dispositivo</DialogTitle>
              <DialogDescription>
                Preencha as informações do dispositivo e seus sensores.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user" className="text-right">
                    Usuário
                  </Label>
                  <select
                    id="user"
                    name="user"
                    value={formData.user}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="">Selecione um usuário</option>
                    {users.map(user => (
                      <option key={user.matricula} value={user.user}>
                        {user.user}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="uuid" className="text-right">
                    UUID
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="uuid"
                      name="uuid"
                      value={formData.uuid}
                      onChange={handleUUIDChange}
                      className={`${
                        formData.uuid && !isValidUUID(formData.uuid)
                          ? 'border-orange-500'
                          : ''
                      }`}
                      placeholder="Deixe em branco para gerar automaticamente"
                    />
                    {formData.uuid && !isValidUUID(formData.uuid) && (
                      <p className="text-orange-500 text-sm mt-1">
                        UUID inválido. Será gerado um novo UUID automaticamente.
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="latitude" className="text-right">
                    Latitude
                  </Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="longitude" className="text-right">
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>

                {/* Dynamic Sensor Inputs */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Sensores</Label>
                    {formData.sensors.length < 7 && (
                      <Button
                        type="button"
                        onClick={addSensor}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {formData.sensors.map((sensor, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={sensor}
                        onChange={(e) => handleSensorChange(index, e.target.value)}
                        placeholder={`Sensor ${index + 1}`}
                        required
                      />
                      {formData.sensors.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeSensor(index)}
                          variant="destructive"
                          size="sm"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
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

      {/* Success Dialog showing credentials */}
      <Dialog 
        open={!!registrationResult} 
        onOpenChange={() => setRegistrationResult(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Dispositivo Cadastrado com Sucesso!</DialogTitle>
            <DialogDescription>
              Guarde estas informações em um local seguro. O UUID será usado como nome de usuário para conexão MQTT:
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Username (UUID):</Label>
              <div className="col-span-3 font-mono bg-gray-100 p-2 rounded">
                {registrationResult?.username}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Senha:</Label>
              <div className="col-span-3 font-mono bg-gray-100 p-2 rounded">
                {registrationResult?.password}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setRegistrationResult(null)}
              className="bg-green-500 hover:bg-green-600"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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