package main

import (
    "net/http"
)

func main() {
    // 设置静态文件服务，假设所有前端文件都放在"web/"目录下
    fs := http.FileServer(http.Dir("web/"))
    http.Handle("/", fs)

    // 启动HTTP服务器
    println("Server is running at http://localhost:3000")
    err := http.ListenAndServe(":3000", nil)
    if err != nil {
        panic(err)
    }
}
