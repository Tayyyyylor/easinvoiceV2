export const getItemName = (item: Quotes | Invoices | Clients) => {
    if ('firstname' in item || 'company_name' in item) {
        // C'est un Client
        const client = item as Clients
        return client.company_name ?? `${client.firstname} ${client.lastname}`
    }

    // C'est un Quote ou Invoice
    if (item.name) {
        return item.name
    }

    if ('formatted_no' in item && item.formatted_no) {
        return item.formatted_no
    }

    return item.description
}
