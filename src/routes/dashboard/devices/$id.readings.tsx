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

export const Route = createFileRoute('/dashboard/devices/$id/readings')({
  component: DeviceReadings,
})

export type Reading = {
  readingId: string
  variable: 'temperatura' | 'umidade' | 'luminosidade'
  valor: number
  timestamp: string
}

// Function to fetch readings for a specific device
const fetchDeviceReadings = async (deviceId: string): Promise<Reading[]> => {
  try {
    const response = await axios.get(`/api/devices/${deviceId}/readings`)
    return response.data
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
  // Get the device ID from the route params
  const { id: deviceId } = Route.useParams()

  // Fetch readings using React Query
  const {
    data: readings,
    isLoading,
    isError,
    error
  } = useQuery<Reading[], Error>({
    queryKey: ['deviceReadings', deviceId],
    queryFn: () => fetchDeviceReadings(deviceId),
  })

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

  // Loading state
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

  // Error state
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
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  )
                })}
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