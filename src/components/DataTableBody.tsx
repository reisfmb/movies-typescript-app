import { Column, Transform } from "./DataTable";

interface DataTableBodyProps<Item> {
    DATA: Array<Item>
    COLUMNS: Array<Column<Item>>
    TRANSFORMATIONS: Array<Transform<Item>>,
}

function DataTableBody<Item>(props: DataTableBodyProps<Item>) {
    const { DATA, COLUMNS, TRANSFORMATIONS } = props;

    return <tbody>
        {
            DATA.map(item => <>
                <tr>
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

function proccessData<Item>(item: Item, accessor: keyof Item, transformations: Array<Transform<Item>>): string {
    const transformation = transformations.find(transformation => transformation.accessor.toString() === accessor.toString());

    if (transformation) {
        return transformation.transform(item[accessor]);
    }

    return (item[accessor] || '' as any).toString();
}

export { DataTableBody };