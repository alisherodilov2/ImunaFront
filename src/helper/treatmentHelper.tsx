export function findMaxGraphItem(data:any) {
    return data?.reduce((max:any, current:any) => 
        current?.graph_archive_item?.length > max?.graph_archive_item?.length ? current : max
    );
}