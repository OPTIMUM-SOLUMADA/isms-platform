const TableSkeletonRow = ({ headers }: { headers: any[] }) => {
    return (
        <tr>
            {headers.map((header) => (
                <td
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="px-2 py-2"
                >
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-full" />
                </td>
            ))}
        </tr>
    );
};

export default TableSkeletonRow;
