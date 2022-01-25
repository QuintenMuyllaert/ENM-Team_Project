from(bucket: "Transfosite") |> range(start: 2022-01-25T12:00:00Z, stop: 2022-01-25T18:00:00Z) |> aggregateWindow(every: 1h, fn: last, createEmpty: false)// |> toString()
// |> group(columns: ["_field*", "_field"], mode: "by")
// |> distinct(column: "_field*")
// |> filter(fn: (r) => r._field == "net")
