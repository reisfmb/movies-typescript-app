import { useEffect, useState } from "react"
import { DataTableBody } from "./DataTableBody"
import { DataTableHead } from "./DataTableHead"

interface Column<Item> {
    accessor: keyof Item
    name: string
}

interface Transform<Item> {
    accessor: keyof Item
    transform: (x: any) => string
}

interface Filter<Item> {
    accessor: keyof Item
    filter: (item: Item, inputValue: any) => boolean
    input: {
        type: 'text' | 'select'
        placeholder: string
        options?: Array<{text: string, value: string}>
    }
}

interface Sort<Item> {
    accessor: keyof Item
    sort: (accessor: keyof Item, direction: 'ASC' | 'DESC', a: Item, b: Item) => number
}

interface DataTableProps<Item> {
    DATA: Array<Item>,
    COLUMNS: Array<Column<Item>>,
    TRANSFORMATIONS: Array<Transform<Item>>,
    FILTERS: Array<Filter<Item>>,
    SORTS: Array<Sort<Item>>
}

type SortDirection = 'ASC' | 'DESC';

function DataTable<Item>(props: DataTableProps<Item>) {
    const { DATA, COLUMNS, TRANSFORMATIONS, FILTERS, SORTS } = props;

    const [ currentSortDirectionsObj, setCurrentSortDirectionsObj ] = useState(getInitialSortsObj<Item>(COLUMNS));
    const [ currentFiltersObj, setCurrentFiltersObj ] = useState(getInitialFiltersObj<Item>(COLUMNS));
    const [ filteredData, setFilteredData ] = useState(DATA);

    useEffect(applyDataFilters, [currentFiltersObj]);

    function applyDataFilters() {
        const filtersToBeApplied = Object.keys(currentFiltersObj).map(key => currentFiltersObj[key]);

        const newData = filtersToBeApplied.reduce((prev, currFilter) => {
            if(!currFilter) return prev;
            return prev.filter(item => currFilter(item));
        }, DATA);

        setFilteredData(newData);
    }

    function onFilterHandler(accessor: keyof Item, inputValue: any) {
        const filter = FILTERS.find(filter => filter.accessor.toString() === accessor.toString());
        
        if(!filter) return;

        if(inputValue) {
            setCurrentFiltersObj({
                ...currentFiltersObj,
                [accessor.toString()]: (item: Item) => filter.filter(item, inputValue)
            });
        } else {
            setCurrentFiltersObj({
                ...currentFiltersObj,
                [accessor.toString()]: null
            });
        }
    }

    function onSortHandler(accessor: keyof Item) {
        const sort = SORTS.find(sort => sort.accessor.toString() === accessor.toString());

        if(!sort) return;

        const sortDirection = (currentSortDirectionsObj[accessor.toString()] || 'DESC') as SortDirection;

        setCurrentSortDirectionsObj({
            ...currentSortDirectionsObj,
            [accessor.toString()]: sortDirection === 'ASC' ? 'DESC' : 'ASC' 
        });

        setFilteredData(filteredData.sort((a,b) => sort.sort(accessor, sortDirection, a, b)))
    }

    return <table>
        { DataTableHead<Item>({COLUMNS, FILTERS, onSort: onSortHandler, onFilter: onFilterHandler}) }
        { DataTableBody<Item>({DATA: filteredData, COLUMNS, TRANSFORMATIONS}) }
    </table>
}

export { DataTable }

export type { Column, Transform, Filter, Sort }

// Helper Functions

function getInitialSortsObj<Item>(columns: Array<Column<Item>>) {
    return columns.reduce((prev, curr) => ({...prev, [curr.accessor.toString()]: 'DESC'}), {} as { [key: string]: string });
}

function getInitialFiltersObj<Item>(columns: Array<Column<Item>>) {
    return columns.reduce((prev, curr) => ({...prev, [curr.accessor.toString()]: null} ), {} as { [key: string]: ((item: Item) => boolean) | null });
}