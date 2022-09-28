import { useEffect, useState } from "react"
import { DataTableBody } from "./DataTableBody"
import { DataTableHead } from "./DataTableHead"

interface Column<Item> {
    accessor: keyof Item
    view: JSX.Element
}

interface Transform<Item> {
    accessor: keyof Item
    transform: (x: any) => JSX.Element
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


interface DataTableConfig {
    SHOW_ALL_ITEMS: boolean
    NUM_ITEMS_TO_SHOW_INITTIALY?: number
    NUM_ITEMS_TO_INCREASE_PER_SCROLL?: number
    SCROLL_REACHED_BOTTOM_STATE: boolean
}
interface DataTableProps<Item> {
    CONFIG: DataTableConfig
    DATA: Array<Item>
    COLUMNS: Array<Column<Item>>
    TRANSFORMATIONS: Array<Transform<Item>>
    FILTERS: Array<Filter<Item>>
    SORTS: Array<Sort<Item>>
    onRowClick: (item: Item) => void
    
}

type SortDirection = 'ASC' | 'DESC';

function DataTable<Item>(props: DataTableProps<Item>) {
    const { CONFIG, DATA, COLUMNS, TRANSFORMATIONS, FILTERS, SORTS, onRowClick } = props;

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
        
        setFilteredData(filteredData.sort((a,b) => sort.sort(accessor, sortDirection, a, b)));
    }

    return <table>
        { DataTableHead<Item>({COLUMNS, FILTERS, onSort: onSortHandler, onFilter: onFilterHandler}) }
        { DataTableBody<Item>({CONFIG, DATA: filteredData, COLUMNS, TRANSFORMATIONS, onRowClick}) }
    </table>
}

export { DataTable }

export type { Column, Transform, Filter, Sort, SortDirection, DataTableConfig }

// Helper Functions

function getInitialSortsObj<Item>(columns: Array<Column<Item>>) {
    return columns.reduce((prev, curr) => ({...prev, [curr.accessor.toString()]: 'DESC'}), {} as { [key: string]: string });
}

function getInitialFiltersObj<Item>(columns: Array<Column<Item>>) {
    return columns.reduce((prev, curr) => ({...prev, [curr.accessor.toString()]: null} ), {} as { [key: string]: ((item: Item) => boolean) | null });
}