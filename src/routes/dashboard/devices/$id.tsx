import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import axios from 'axios'
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'
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

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const Route = createFileRoute('/dashboard/devices/$id')({
  component: DeviceReadings,
})

export type Reading = {
  readingId: string
  variable: 'temperatura' | 'umidade' | 'luminosidade'
  valor: number
  timestamp: string
}

// Função para buscar as leituras do dispositivo
const fetchDeviceReadings = async (deviceId: string): Promise<Reading[]> => {
  try {
    const response = await axios.get(`/api/v1/devices/${deviceId}`)
    return response.data.slice(0, 1000)
  } catch (error) {
    console.error('Error fetching device readings:', error)
    throw error
  }
}

export const columns: ColumnDef<Reading>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'readingId',
    header: 'ID',
    cell: ({ row }) => <div>{row.getValue('readingId')}</div>,
  },
  {
    accessorKey: 'variable',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Variável
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('variable')}</div>,
  },
  {
    accessorKey: 'valor',
    header: () => <div className="text-right">Valor</div>,
    cell: ({ row }) => {
      const valor = Number.parseFloat(row.getValue('valor'))
      return <div className="text-right">{valor.toFixed(2)}</div>
    },
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({ row }) => {
      const timestamp = new Date(row.getValue('timestamp'))
      return (
        <div>
          {timestamp.toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
          })}
        </div>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const reading = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(reading.readingId)}
            >
              Copiar ID da Leitura
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Detalhes da Leitura</DropdownMenuItem>
            <DropdownMenuItem>Análise Comparativa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DeviceReadings() {
  // Obtém o ID do dispositivo via params da rota
  const { id: deviceId } = Route.useParams()

  // Busca as leituras utilizando React Query
  const {
    data: readings,
    isLoading,
    isError,
    error,
  } = useQuery<Reading[], Error>({
    queryKey: ['deviceReadings', deviceId],
    queryFn: () => fetchDeviceReadings(deviceId),
  })

  // ============================
  // Lógica do Gráfico de Série Temporal
  // ============================
  // Estado para a variável selecionada para o gráfico
  const [selectedVariable, setSelectedVariable] = React.useState<string>('')

  // Obtém as variáveis únicas disponíveis (ex.: temperatura, umidade, luminosidade)
  const sensorVariables = React.useMemo(() => {
    return readings ? Array.from(new Set(readings.map((r) => r.variable))) : []
  }, [readings])

  // Define a primeira variável encontrada como padrão, se nenhuma estiver selecionada
  React.useEffect(() => {
    if (sensorVariables.length > 0 && !selectedVariable) {
      setSelectedVariable(sensorVariables[0])
    }
  }, [sensorVariables, selectedVariable])

  // Filtra e ordena os dados para o gráfico conforme a variável selecionada
  const filteredChartData = React.useMemo(() => {
    if (!readings) return []
    return readings
      .filter((r) => r.variable === selectedVariable)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      )
  }, [readings, selectedVariable])
  // ============================

  // Configurações da tabela (já existentes)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: readings || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Estado de carregamento
  if (isLoading) {
    return (
      <div>
        <h2 className="text-3xl mb-8">Leituras do Dispositivo</h2>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  // Estado de erro
  if (isError) {
    return (
      <div>
        <h2 className="text-3xl mb-8">Erro ao Carregar Leituras</h2>
        <p className="text-red-500">
          Não foi possível carregar as leituras do dispositivo: {error.message}
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl mb-8">Leituras do Dispositivo</h2>

      {/* Seção do Gráfico de Série Temporal */}
      <div className="mb-8 border p-4 rounded">
        <h3 className="text-2xl mb-4">
          Série Temporal {selectedVariable && `- ${selectedVariable}`}
        </h3>
        <div className="mb-4">
          <label htmlFor="variable-select" className="mr-2 font-medium">
            Selecionar variável:
          </label>
          <select
            id="variable-select"
            value={selectedVariable}
            onChange={(e) => setSelectedVariable(e.target.value)}
            className="border p-2 rounded"
          >
            {sensorVariables.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {filteredChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredChartData}>
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
          <p>Nenhum dado para exibir para a variável selecionada.</p>
        )}
      </div>

      {/* Seção da Tabela */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por ID, variável..."
          value={
            (table.getColumn('readingId')?.getFilterValue() as string) ??
            (table.getColumn('variable')?.getFilterValue() as string) ??
            ''
          }
          onChange={(event) => {
            const value = event.target.value
            table.getColumn('readingId')?.setFilterValue(value)
            table.getColumn('variable')?.setFilterValue(value)
          }}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhuma leitura encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
