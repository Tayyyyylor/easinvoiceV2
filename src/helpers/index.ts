export const getItemName = (item: Quotes | Invoices | Clients) => {
    if ('firstname' in item || 'company_name' in item) {
        // C'est un Client
        const client = item as Clients
        return client.firstname
            ? `${client.firstname} ${client.lastname}`
            : client.company_name
    }
    // C'est un Quote ou Invoice
    return item.name
}
