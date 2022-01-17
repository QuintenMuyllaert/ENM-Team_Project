from(bucket: "Transfosite") |> range(start: 2022-01-01T00:00:00Z, stop: 2022-02-01T00:00:00Z) |> aggregateWindow(every: 1h, fn: last, createEmpty: false)
    |> filter(fn: (r) => r._field == "Net_L3")