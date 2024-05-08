package main

import (
	"context"
	"fmt"
	"html/template"
	"log"
	"net"
	"net/http"
	"net/url"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/acd19ml/EventCOM/config"
	"github.com/acd19ml/EventCOM/controllers"
	"github.com/acd19ml/EventCOM/gapi"
	"github.com/acd19ml/EventCOM/pb"
	"github.com/acd19ml/EventCOM/routes"
	"github.com/acd19ml/EventCOM/services"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

var (
	server      *gin.Engine
	ctx         context.Context
	mongoclient *mongo.Client
	redisclient *redis.Client

	userService         services.UserService
	UserController      controllers.UserController
	UserRouteController routes.UserRouteController

	authCollection      *mongo.Collection
	authService         services.AuthService
	AuthController      controllers.AuthController
	AuthRouteController routes.AuthRouteController

	// 👇 Create the Post Variables
	postService         services.PostService
	PostController      controllers.PostController
	postCollection      *mongo.Collection
	PostRouteController routes.PostRouteController

	// 👇 Create the Date Variables
	dateCollection      *mongo.Collection
	dateService         services.DateService
	DateController      controllers.DateController
	DateRouteController routes.DateRouteController

	// 👇 Create the Talk Variables
	talkCollection      *mongo.Collection
	talkService         services.TalkService
	TalkController      controllers.TalkController
	TalkRouteController routes.TalkRouteController

	// 👇 Create the Attendee Variables
	attendeeService         services.AttendeeService
	AttendeeController      controllers.AttendeeController
	attendeeCollection      *mongo.Collection
	AttendeeRouteController routes.AttendeeRouteController

	attendanceService         services.AttendanceService
	AttendanceController      controllers.AttendanceController
	attendanceCollection      *mongo.Collection
	AttendanceRouteController routes.AttendanceRouteController
	temp *template.Template
)

func init() {
	temp = template.Must(template.ParseGlob("templates/*.html"))
	config, err := config.LoadConfig(".")
	if err != nil {
		log.Fatal("Could not load environment variables", err)
	}

	ctx = context.TODO()

	// Connect to MongoDB
	mongoconn := options.Client().ApplyURI(config.DBUri)
	mongoclient, err := mongo.Connect(ctx, mongoconn)

	if err != nil {
		panic(err)
	}

	if err := mongoclient.Ping(ctx, readpref.Primary()); err != nil {
		panic(err)
	}

	fmt.Println("MongoDB successfully connected...")

	// Connect to Redis

	redisURI := config.RedisUri

	u, err := url.Parse(redisURI)
	if err != nil {
		log.Fatalf("Failed to parse REDIS_CLOUD_URL: %v", err)
	}

	password, _ := u.User.Password()
	redisclient = redis.NewClient(&redis.Options{
		Addr:     u.Host,   
		Password: password,
	})

	// redisclient = redis.NewClient(&redis.Options{
	// 	Addr: config.RedisUri,
	// })

	if _, err := redisclient.Ping(ctx).Result(); err != nil {
		panic(err)
	}

	err = redisclient.Set(ctx, "test", "Welcome to Golang with Redis and MongoDB", 0).Err()
	if err != nil {
		panic(err)
	}

	fmt.Println("Redis client connected successfully...")

	// Collections
	authCollection = mongoclient.Database("golang_mongodb").Collection("users")
	userService = services.NewUserServiceImpl(authCollection, ctx)
	authService = services.NewAuthService(authCollection, ctx)
	AuthController = controllers.NewAuthController(authService, userService, ctx, authCollection, temp)
	AuthRouteController = routes.NewAuthRouteController(AuthController)

	UserController = controllers.NewUserController(userService)
	UserRouteController = routes.NewRouteUserController(UserController)

	// 👇 Instantiate the Constructors
	postCollection = mongoclient.Database("golang_mongodb").Collection("posts")
	postService = services.NewPostService(postCollection, ctx)
	PostController = controllers.NewPostController(postService)
	PostRouteController = routes.NewPostControllerRoute(PostController)

	dateCollection = mongoclient.Database("golang_mongodb").Collection("dates")
	dateService = services.NewDateService(dateCollection, ctx)
	DateController = controllers.NewDateController(dateService)
	DateRouteController = routes.NewDateControllerRoute(DateController)

	talkCollection = mongoclient.Database("golang_mongodb").Collection("talks")
	talkService = services.NewTalkService(talkCollection, ctx)
	TalkController = controllers.NewTalkController(talkService)
	TalkRouteController = routes.NewTalkControllerRoute(TalkController)

	attendeeCollection = mongoclient.Database("golang_mongodb").Collection("attendees")
	attendeeService = services.NewAttendeeService(attendeeCollection, ctx)
	AttendeeController = controllers.NewAttendeeController(attendeeService)
	AttendeeRouteController = routes.NewAttendeeControllerRoute(AttendeeController)

	attendanceCollection = mongoclient.Database("golang_mongodb").Collection("attendances")
	attendanceService = services.NewAttendanceService(attendanceCollection, ctx)
	AttendanceController = controllers.NewAttendanceController(attendanceService)
	AttendanceRouteController = routes.NewAttendanceControllerRoute(AttendanceController)

	// Gin Server

	server = gin.Default()
}

func main() {
	config, err := config.LoadConfig(".")

	if err != nil {
		log.Fatal("Could not load config", err)
	}

	defer mongoclient.Disconnect(ctx)

	startGinServer(config)
	// startGrpcServer(config)
}

func startGrpcServer(config config.Config) {
	authServer, err := gapi.NewGrpcAuthServer(config, authService, userService, authCollection)
	if err != nil {
		log.Fatal("cannot create grpc authServer: ", err)
	}

	userServer, err := gapi.NewGrpcUserServer(config, userService, authCollection)
	if err != nil {
		log.Fatal("cannot create grpc userServer: ", err)
	}

	postServer, err := gapi.NewGrpcPostServer(postCollection, postService)
	if err != nil {
		log.Fatal("cannot create grpc postServer: ", err)
	}

	grpcServer := grpc.NewServer()

	pb.RegisterAuthServiceServer(grpcServer, authServer)
	pb.RegisterUserServiceServer(grpcServer, userServer)
	// 👇 Register the Post gRPC service
	pb.RegisterPostServiceServer(grpcServer, postServer)
	reflection.Register(grpcServer)

	listener, err := net.Listen("tcp", config.GrpcServerAddress)
	if err != nil {
		log.Fatal("cannot create grpc server: ", err)
	}

	log.Printf("start gRPC server on %s", listener.Addr().String())
	err = grpcServer.Serve(listener)
	if err != nil {
		log.Fatal("cannot create grpc server: ", err)
	}
}

func startGinServer(config config.Config) {
	value, err := redisclient.Get(ctx, "test").Result()

	if err == redis.Nil {
		fmt.Println("key: test does not exist")
	} else if err != nil {
		panic(err)
	}

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{config.Origin}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"} 
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	corsConfig.AllowCredentials = true

	server.Use(cors.New(corsConfig))

	router := server.Group("/api")
	router.GET("/healthchecker", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"status": "success", "message": value})
	})

	AuthRouteController.AuthRoute(router, userService)
	UserRouteController.UserRoute(router, userService)
	// 👇 Post Route
	PostRouteController.PostRoute(router, userService)
	DateRouteController.DateRoute(router, userService)
	TalkRouteController.TalkRoute(router, userService)
	AttendeeRouteController.AttendeeRoute(router, userService)
	AttendanceRouteController.AttendanceRoute(router, userService)


	log.Fatal(server.Run(":" + config.Port))
}
