package main

import (
	"log"
	"net/http"
)

func main() {
	// 设置静态文件服务器。这里假设你的前端文件存放在项目的"web"目录下
	fs := http.FileServer(http.Dir("web"))

	// 将"/"路由到静态文件服务器
	http.Handle("/", fs)

	log.Println("Frontend server listening on http://localhost:3000...")
	err := http.ListenAndServe(":3000", nil) // 使用不同于后端的端口
	if err != nil {
		log.Fatal(err)
	}
}
