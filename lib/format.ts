const dateFormatter = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    timeZone: "America/Argentina/Buenos_Aires",
});

export function formatDate(isoDate: string) {
    return dateFormatter.format(new Date(isoDate));
}