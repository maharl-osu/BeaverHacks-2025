
export function DayToString(day) {

    switch (day) {
        case 1:
            return day.toString() + "st"
        case 2:
            return day.toString() + "nd"
        case 3:
            return day.toString() + "rd"
        default:
            return day.toString() + "th"
    }

} 

export function WeekDayToString(num) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[num]
}

export function MonthToString(num) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return months[num]
}