import { useEffect, useState } from "react";
import { Column, Transform, DataTableConfig } from "./DataTable";

interface DataTableBodyProps<Item> {
    CONFIG: DataTableConfig
    DATA: Array<Item>
    COLUMNS: Array<Column<Item>>
    TRANSFORMATIONS: Array<Transform<Item>>
    SCROLL_REACHED_BOTTOM_STATE: boolean
    onRowClick: (item: Item) => void
}

function DataTableBody<Item>(props: DataTableBodyProps<Item>) {
    const { CONFIG, DATA, COLUMNS, TRANSFORMATIONS, SCROLL_REACHED_BOTTOM_STATE, onRowClick } = props;

    const [increment, setIncrement] = useState(0);

    useEffect(updateIncrement, [SCROLL_REACHED_BOTTOM_STATE])

    function updateIncrement() {
        if (SCROLL_REACHED_BOTTOM_STATE) {
            setIncrement(increment + (CONFIG.NUM_ITEMS_TO_INCREASE_PER_SCROLL || 0));
        }
    }

    const DATA_TO_SHOW = CONFIG.SHOW_ALL_ITEMS 
        ? DATA 
        : DATA.slice(0, (CONFIG.NUM_ITEMS_TO_SHOW_INITTIALY || 0) + increment);

    return <tbody>
        {
            DATA_TO_SHOW.map(item => <>
                <tr onClick={() => onRowClick(item)}>
                    {
                        COLUMNS.map(({accessor}) => <>
                            <td>{ proccessData<Item>(item, accessor, TRANSFORMATIONS) }</td>
                        </>)
                    }
                </tr>
            </>)
        }
    </tbody>;
}

// Helper Functions

function proccessData<Item>(item: Item, accessor: keyof Item, transformations: Array<Transform<Item>>): string | JSX.Element{
    const transformation = transformations.find(transformation => transformation.accessor.toString() === accessor.toString());

    if (transformation) {
        return transformation.transform(item[accessor]);
    }

    return (item[accessor] || '' as any).toString();
}

export { DataTableBody };