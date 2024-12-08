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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/cooperatives')({
  component: Cooperativas,
})

export type Cooperativa = {
  id: string
  nome: string
  endereco: string
  qtdUsuarios: number
  qtdLicencas: number
  qtdDispositivos: number
  cnpj: string
  email: string
}

const data: Cooperativa[] = [
  {
    id: 'coop1',
    nome: 'Cooperativa Central',
    endereco: 'Rua Principal, 123 - Centro, São Paulo - SP',
    qtdUsuarios: 50,
    qtdLicencas: 30,
    qtdDispositivos: 25,
    cnpj: '12.345.678/0001-90',
    email: 'contato@cooperativacentral.com.br',
  },
  {
    id: 'coop2',
    nome: 'Cooperativa Rural',
    endereco: 'Avenida Agricultura, 456 - Rural, Campinas - SP',
    qtdUsuarios: 30,
    qtdLicencas: 20,
    qtdDispositivos: 12,
    cnpj: '98.765.432/0001-10',
    email: 'admin@cooperativarural.com.br',
  },
]

export const columns: ColumnDef<Cooperativa>[] = [
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
    accessorKey: 'nome',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('nome')}</div>,
  },
  {
    accessorKey: 'endereco',
    header: 'Endereço',
    cell: ({ row }) => <div>{row.getValue('endereco')}</div>,
  },
  {
    accessorKey: 'qtdUsuarios',
    header: () => <div className="text-right">Qtd. Usuários</div>,
    cell: ({ row }) => {
      const qtdUsuarios = Number.parseInt(row.getValue('qtdUsuarios'))
      return <div className="text-right">{qtdUsuarios}</div>
    },
  },
  {
    accessorKey: 'qtdLicencas',
    header: () => <div className="text-right">Qtd. Licenças</div>,
    cell: ({ row }) => {
      const qtdLicencas = Number.parseInt(row.getValue('qtdLicencas'))
      return <div className="text-right">{qtdLicencas}</div>
    },
  },
  {
    accessorKey: 'qtdDispositivos',
    header: () => <div className="text-right">Qtd. Dispositivos</div>,
    cell: ({ row }) => {
      const qtdDispositivos = Number.parseInt(row.getValue('qtdDispositivos'))
      return <div className="text-right">{qtdDispositivos}</div>
    },
  },
  {
    accessorKey: 'cnpj',
    header: 'CNPJ',
    cell: ({ row }) => <div>{row.getValue('cnpj')}</div>,
  },
  {
    accessorKey: 'email',
    header: 'E-mail',
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const cooperativa = row.original

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
              onClick={() => navigator.clipboard.writeText(cooperativa.id)}
            >
              Copiar ID da Cooperativa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Editar Cooperativa</DropdownMenuItem>
            <DropdownMenuItem>Visualizar Detalhes</DropdownMenuItem>
            <DropdownMenuItem>Gerenciar Dispositivos</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function Cooperativas() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
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

  return (
    <div>
      <h2 className="text-3xl mb-8">Cooperativas</h2>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nome, endereço, CNPJ ou e-mail..."
          value={
            (table.getColumn('nome')?.getFilterValue() as string) ??
            (table.getColumn('endereco')?.getFilterValue() as string) ??
            (table.getColumn('cnpj')?.getFilterValue() as string) ??
            (table.getColumn('email')?.getFilterValue() as string) ??
            ''
          }
          onChange={(event) => {
            const value = event.target.value
            table.getColumn('nome')?.setFilterValue(value)
            table.getColumn('endereco')?.setFilterValue(value)
            table.getColumn('cnpj')?.setFilterValue(value)
            table.getColumn('email')?.setFilterValue(value)
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
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
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
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}