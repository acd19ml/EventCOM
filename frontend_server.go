package main

import (
    "net/http"
)

func main() {

    fs := http.FileServer(http.Dir("web/"))
    http.Handle("/", fs)


    println("Server is running at http://localhost:3000")
    err := http.ListenAndServe(":3000", nil)
    if err != nil {
        panic(err)
    }
}
