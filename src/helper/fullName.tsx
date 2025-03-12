
export const fullName = (data: any) => {
    return `${data?.first_name ?? ' '} ${data?.last_name ?? ' '}`
}

export const masulRegUchunFullName = (data: any) => {
    return `${data?.name ?? ' '} ${data?.full_name ?? ' '}`
}

