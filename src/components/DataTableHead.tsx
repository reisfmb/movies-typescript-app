import {  useState } from "react";
import { Column, Filter } from "./DataTable";

interface DataTableHeadProps<Item> {
    COLUMNS: Array<Column<Item>>
    FILTERS: Array<Filter<Item>>
    onSort: (accessor: keyof Item) => void
    onFilter: (accessor: keyof Item, inputValue: any) => void
}

function DataTableHead<Item>(props: DataTableHeadProps<Item>) {    
    const { COLUMNS, FILTERS, onSort, onFilter } = props;

    return <thead>
        <tr>
            { 
                COLUMNS.map(({view, accessor}) => <th onClick={ () => onSort(accessor) }>{ view }</th>) 
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

// TODO: Implement support for other input types
function processInput<Item>(filter: Filter<Item>, onFilter: (accessor: keyof Item, inputValue: any) => void) {

    if(filter.input.type === 'text') {
        return <input 
            type={ filter.input.type }
            placeholder={ filter.input.placeholder }
            onChange={ (e) => onFilter(filter.accessor, e.target.value) }
        />
    }

    if(filter.input.type === 'select') {
        return <select 
            onChange={ (e) => onFilter(filter.accessor, e.target.value) }>
                <option value="">{ filter.input.placeholder }</option>
                {
                    (filter.input.options || []).map(({text, value}) => <>
                        <option value={ value }>{ text }</option>
                    </>)
                }
        </select>
    }
}

function getInitialSortObj<Item>(columns: Array<Column<Item>>) {
    return columns.reduce((prev, curr) => ({...prev, [curr.accessor.toString()]: 'DESC'}), {} as { [key: string]: string });
}