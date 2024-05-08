FROM golang:1.18 as builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o myapp ./cmd/server/main.go

FROM scratch

COPY --from=builder /app/myapp /myapp
COPY --from=builder /app/app.env /app.env

EXPOSE 8080

CMD ["/myapp"]

