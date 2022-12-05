import { FactOrden } from "@interfaces/fact_orden.interface"
import { getFactOrden } from "@services/fact_orden.service"
import classNames from "classnames"
import { useState } from "react"
import { useQuery } from "react-query"

const TableFactOrden = (): JSX.Element => {
  const { data, error, isLoading } = useQuery(["getFactOrden"], getFactOrden)
  const [currentPage, setCurrentPage] = useState(0)
  const [textSearch, setTextSearch] = useState("")

  if (isLoading) return <div>CARGANDO ...</div>
  if (!isLoading && Boolean(error)) return <div>ERROR ...</div>
  if (!isLoading && data == null) return <div>NO hay datos ...</div>

  const NUM_DATA_VIEW = 10

  const filteredFactOrden = (): FactOrden[] => {
    if (textSearch === "")
      return data.slice(currentPage, currentPage + NUM_DATA_VIEW)

    const filtered = data.filter(
      (fact) =>
        fact.NOMBREEMPLEADO.toLowerCase().includes(textSearch.toLowerCase()) ||
        fact.NOMBREPRODUCTO.toLowerCase().includes(textSearch.toLowerCase())
    )
    return filtered.slice(currentPage, currentPage + NUM_DATA_VIEW)
  }

  const nextPage = (): void => {
    if (
      data.filter(
        (fact) =>
          fact.NOMBREEMPLEADO.toLowerCase().includes(
            textSearch.toLowerCase()
          ) ||
          fact.NOMBREPRODUCTO.toLowerCase().includes(textSearch.toLowerCase())
      ).length >
      currentPage + NUM_DATA_VIEW
    )
      setCurrentPage(currentPage + NUM_DATA_VIEW)
  }

  const previusPage = (): void => {
    if (currentPage > 0) setCurrentPage(currentPage - NUM_DATA_VIEW)
  }

  const onsearchChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setCurrentPage(0)
    setTextSearch(target.value)
  }

  const TOTAL = `${
    data.length === 0 ? filteredFactOrden().length : currentPage + NUM_DATA_VIEW
  }/${data.length}`

  return (
    <div className="p-4 flex flex-col gap-6">
      <h3 className="text-2xl font-bold">FACTURAS DE ORDENES</h3>
      <div className="flex justify-between gap-4">
        <span className="text-lg font-semibold">{`Total: ${TOTAL}`}</span>
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Escribe para buscar ..."
          className="min-w-[20rem] rounded-md py-1.5 px-3 border border-gray-200 focus:border-gray-300"
          autoComplete="off"
          value={textSearch}
          onChange={onsearchChange}
        />
      </div>
      <table className="table-auto m-auto rounded-md overflow-hidden">
        <thead>
          <tr className="bg-blue-700 text-white">
            <th className="px-2 py-4 text-center">IdOrden</th>
            <th className="px-2 py-4 text-center">NombreEmpleado</th>
            <th className="px-2 py-4 text-center">NombreProducto</th>
            <th className="px-2 py-4 text-center">FechaOrden</th>
            <th className="px-2 py-4 text-center">PrecioUnidad</th>
            <th className="px-2 py-4 text-center">Cantidad</th>
            <th className="px-2 py-4 text-center">Descuento</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {filteredFactOrden().length === 0 && (
            <tr className="border border-gray-200/50">
              <td colSpan={7} className="p-2">
                No existen registros
              </td>
            </tr>
          )}
          {filteredFactOrden()?.map((fact: FactOrden) => {
            return (
              <tr
                key={fact.ID}
                className="border border-gray-200/50 hover:bg-gray-200/50"
              >
                <td className="p-2 text-center">{fact.CLAVEALTERNAORDEN}</td>
                <td className="p-2 text-center">{fact.NOMBREEMPLEADO}</td>
                <td className="p-2 text-center">{fact.NOMBREPRODUCTO}</td>
                <td className="p-2 text-center">{fact.CLAVEFECHAORDEN}</td>
                <td className="p-2 text-center">{fact.PRECIOUNITARIO}</td>
                <td className="p-2 text-center">{fact.CANTIDAD}</td>
                <td className="p-2 text-center">{fact.DESCUENTO}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex justify-end gap-4">
        <button
          onClick={previusPage}
          className={classNames(
            "px-4 py-3 rounded-md min-w-[7rem] bg-red-400 text-white"
          )}
        >
          PREVIUS
        </button>
        <button
          onClick={nextPage}
          className={classNames(
            "px-4 py-3 rounded-md min-w-[7rem] bg-blue-400 text-white"
          )}
        >
          NEXT
        </button>
      </div>
    </div>
  )
}

export default TableFactOrden
