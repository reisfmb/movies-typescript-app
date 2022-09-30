import { DataTableConfig, Column, Filter, Sort } from './DataTable';

interface DataTableHeadProps<Item> {
    CONFIG: DataTableConfig
    COLUMNS: Array<Column<Item>>
    FILTERS: Array<Filter<Item>>
    SORTS: Array<Sort<Item>>
    SORT_DIRECTIONS_STATE: { [key: string]: string }
    onSort: (accessor: string) => void
    onFilter: (accessor: string, inputValue: any) => void
}

function DataTableHead<Item>(props: DataTableHeadProps<Item>) {    
    const { CONFIG, COLUMNS, FILTERS, SORTS, SORT_DIRECTIONS_STATE, onSort, onFilter } = props;

    return <thead>
        <tr>
            { 
                COLUMNS.map(({view, accessor}) => <th onClick={ () => onSort(accessor) }>
                    { view }
                    { ' ' }
                    {  SORTS.find(sort => sort.accessor.toString() === accessor) &&  ShowSortIcon(SORT_DIRECTIONS_STATE[accessor.toString()], CONFIG.ICONS.ASC, CONFIG.ICONS.DESC) }
                </th>) 
            }
        </tr>

        <tr>
            {
                COLUMNS.map(({accessor}) => {
                    const filter = FILTERS.find(filter => filter.accessor.toString() === accessor.toString());

                    if (!filter) return <th></th>;

                    return <th>{ processInput<Item>(filter, onFilter) }</th>;
                })
            }
        </tr>
    </thead>;
}

export { DataTableHead };

// Helper Functions

function ShowSortIcon(direction: string, iconASC: JSX.Element, iconDESC: JSX.Element) {
    if (direction === 'ASC') {
        return iconASC;
    }

    if (direction === 'DESC') {
        return iconDESC;
    }

    return <></>;

}

// TODO: Implement support for other input types
function processInput<Item>(filter: Filter<Item>, onFilter: (accessor: string, inputValue: any) => void) {

    const onChange = (e: any) => onFilter(filter.accessor, e.target.value);

    if(filter.input.type === 'text') {
        return <input 
            type={ filter.input.type }
            placeholder={ filter.input.placeholder }
            onChange={ onChange }
        />;
    }

    if(filter.input.type === 'select') {
        return <select onChange={ onChange }>
                <option value="">{ filter.input.placeholder }</option>
                {
                    (filter.input.options || []).map(({text, value}) => <>
                        <option value={ value }>{ text }</option>
                    </>)
                }
        </select>;
    }
}

