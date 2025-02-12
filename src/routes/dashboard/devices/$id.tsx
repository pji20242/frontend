import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios'
import * as React from 'react'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

// ===========================
// Rota
// ===========================
export const Route = createFileRoute('/dashboard/devices/$id')({
  component: DeviceReadings,
})

// ===========================
// Mapeamento ID -> Nome do Sensor
// ===========================
const sensorIdToName: Record<number, string> = {
  1: 'Temperatura',
  2: 'Pressão',
  3: 'Luminosidade',
  4: 'Umidade',
  5: 'Corrente',
  6: 'Tensão',
}

// ===========================
// Tipos
// ===========================
export type SensorReading = {
  timestamp: string
  id_sensor: number
  valor: number
}

// ===========================
// Funções de fetch
// ===========================
const fetchDeviceReadings = async (deviceId: string): Promise<SensorReading[]> => {
  const response = await axios.get(`/api/v1/devices/${deviceId}`)
  return response.data
}

const fetchSensorReadings = async (
  deviceId: string,
  sensorId: string,
): Promise<SensorReading[]> => {
  const response = await axios.get(`/api/v1/devices/${deviceId}/sensor/${sensorId}`)
  return response.data
}

// ===========================
// Função para filtrar leituras por data (frontend)
// ===========================
function filterReadingsByRange(readings: SensorReading[], range: string) {
  if (!range) return readings

  const now = new Date()
  let cutoff = new Date()

  switch (range) {
    case 'hour':
      // Última hora
      cutoff = new Date(now.getTime() - 60 * 60 * 1000)
      break
    case 'day':
      // Último dia (24h)
      cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case 'week':
      // Última semana (7 dias)
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      // Último mês (30 dias, simplificado)
      cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    default:
      // Se não houver range específico, não filtra
      return readings
  }

  return readings.filter((r) => {
    const ts = new Date(r.timestamp)
    return ts >= cutoff
  })
}

// ===========================
// Componente principal
// ===========================
export function DeviceReadings() {
  // 1) Obter o UUID do device via params da rota
  const { id: deviceId } = Route.useParams()

  // 2) Buscar TODAS as leituras desse device (sem filtro de sensor)
  const {
    data: deviceData,
    isLoading: isLoadingDevice,
    isError: isErrorDevice,
    error: errorDevice,
  } = useQuery<SensorReading[], Error>({
    queryKey: ['deviceReadingsAll', deviceId],
    queryFn: () => fetchDeviceReadings(deviceId),
  })

  // Lista de IDs de sensor únicos, extraídos de deviceData
  const availableSensors = React.useMemo(() => {
    if (!deviceData) return []
    const uniqueSensors = new Set<number>()
    // biome-ignore lint/complexity/noForEach: <explanation>
    deviceData.forEach((d) => uniqueSensors.add(d.id_sensor))
    return Array.from(uniqueSensors)
  }, [deviceData])

  // Estado para o sensor selecionado
  const [selectedSensor, setSelectedSensor] = React.useState<string>('')

  // Se houver sensores disponíveis e nenhum selecionado, seleciona o primeiro
  React.useEffect(() => {
    if (availableSensors.length > 0 && !selectedSensor) {
      setSelectedSensor(String(availableSensors[0]))
    }
  }, [availableSensors, selectedSensor])

  // 3) Ao selecionar um sensor no combo, buscamos as leituras específicas
  const {
    data: sensorReadings,
    isLoading: isLoadingSensor,
    isError: isErrorSensor,
    error: errorSensor,
  } = useQuery<SensorReading[], Error>({
    queryKey: ['sensorReadings', deviceId, selectedSensor],
    queryFn: () => fetchSensorReadings(deviceId, selectedSensor),
    enabled: Boolean(selectedSensor), // só busca se houver sensor selecionado
  })

  // 4) Filtrar as leituras no frontend por data
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<string>('hour')

  const filteredReadings = React.useMemo(() => {
    if (!sensorReadings) return []
    return filterReadingsByRange(sensorReadings, selectedTimeRange)
  }, [sensorReadings, selectedTimeRange])

  // 5) Dados do gráfico (ordenados por timestamp)
  const chartData = React.useMemo(() => {
    return filteredReadings.slice().sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    })
  }, [filteredReadings])

  // ============================
  // Renderização
  // ============================
  // Se ainda estamos carregando o primeiro endpoint (deviceData)
  if (isLoadingDevice) {
    return (
      <div>
        <h2 className="text-3xl mb-6">Carregando Leituras do Dispositivo...</h2>
        <Skeleton className="h-6 w-[300px]" />
      </div>
    )
  }

  // Se deu erro ou não veio nada do primeiro endpoint
  if (isErrorDevice || !deviceData?.length) {
    return (
      <div>
        <h2 className="text-3xl mb-4">Erro ao Carregar Leituras</h2>
        <p className="text-red-500 mb-2">
          {errorDevice
            ? `Não foi possível carregar as leituras: ${errorDevice.message}`
            : 'Nenhum dado encontrado para este dispositivo.'}
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl mb-6">Leituras do Dispositivo</h2>

      {/* Seção de seleção de Sensor e Período */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {/* Select Sensor (esquerda) */}
        <div className="flex flex-col">
          <label htmlFor="sensorSelect" className="font-medium mb-1">
            Selecione o Sensor:
          </label>
          <select
            id="sensorSelect"
            className="border rounded p-2"
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
          >
            {availableSensors.map((idSensor) => {
              const nomeSensor = sensorIdToName[idSensor] ?? `Sensor ${idSensor}`
              return (
                <option key={idSensor} value={idSensor}>
                  {nomeSensor} (ID: {idSensor})
                </option>
              )
            })}
          </select>
        </div>

        {/* Select Time Range (direita) */}
        <div className="flex flex-col">
          <label htmlFor="timeRangeSelect" className="font-medium mb-1">
            Período:
          </label>
          <select
            id="timeRangeSelect"
            className="border rounded p-2"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
          >
            <option value="hour">Última hora</option>
            <option value="day">Último dia</option>
            <option value="week">Última semana</option>
            <option value="month">Último mês</option>
            {/* Adicione mais opções se necessário */}
          </select>
        </div>
      </div>

      {/* Seção do Gráfico */}
      <div className="mb-8 border p-4 rounded">
        <h3 className="text-2xl mb-4">Série Temporal</h3>

        {isLoadingSensor ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : isErrorSensor ? (
          <p className="text-red-500">
            Erro ao carregar leituras do sensor: {errorSensor?.message}
          </p>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) =>
                  new Date(value).toLocaleTimeString('pt-BR')
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) =>
                  new Date(label).toLocaleString('pt-BR')
                }
              />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>Nenhuma leitura disponível para o filtro atual.</p>
        )}
      </div>
    </div>
  )
}
