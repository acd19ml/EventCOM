# 使用Go官方镜像作为构建环境
FROM golang:1.18 as builder

# 设置工作目录
WORKDIR /app

# 复制go mod和sum文件
COPY go.mod go.sum ./

# 下载依赖项
RUN go mod download

# 复制项目所有文件到容器中
COPY . .

# 根据实际路径编译Go应用为二进制文件。这里假设入口点在cmd/server/main.go
RUN CGO_ENABLED=0 GOOS=linux go build -o myapp ./cmd/server/main.go

# 使用scratch作为最终镜像
FROM scratch

# 从构建器镜像中复制可执行文件
COPY --from=builder /app/myapp /myapp
COPY --from=builder /app/app.env /app.env
# 应用监听的端口（根据你的应用实际情况进行调整）
EXPOSE 8080

# 运行应用
CMD ["/myapp"]

