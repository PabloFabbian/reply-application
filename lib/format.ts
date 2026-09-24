const TIME_ZONE = "America/Argentina/Buenos_Aires";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    timeZone: TIME_ZONE,
});

const longDateFormatter = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: TIME_ZONE,
});

const averageFormatter = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export function formatDate(isoDate: string) {
    return dateFormatter.format(new Date(isoDate));
}

export function formatLongDate(date: Date) {
    return longDateFormatter.format(date);
}

export function formatAverage(average: number) {
    return averageFormatter.format(average);
}

export function formatPercent(percent: number) {
    return `${Math.round(percent)} %`;
}