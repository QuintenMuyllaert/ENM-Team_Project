from(bucket: "Transfosite") |> range(start: 2022-02-01T00:00:00Z, stop: 2022-02-01T18:00:00Z) |> aggregateWindow(every: 1h, fn: last, createEmpty: false)// |> toString()
// |> group(columns: ["_field*", "_field"], mode: "by")
// |> distinct(column: "_field*")
// |> filter(fn: (r) => r._field == "Buitenbar_Totaal")