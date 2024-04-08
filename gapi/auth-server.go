package gapi

import (
	"github.com/acd19ml/EventCOM/config"
	"github.com/acd19ml/EventCOM/pb"
	"github.com/acd19ml/EventCOM/services"
	"go.mongodb.org/mongo-driver/mongo"
)

type AuthServer struct {
	pb.UnimplementedAuthServiceServer
	config         config.Config
	authService    services.AuthService
	userService    services.UserService
	userCollection *mongo.Collection
}

func NewGrpcAuthServer(config config.Config, authService services.AuthService,
	userService services.UserService, userCollection *mongo.Collection) (*AuthServer, error) {

	authServer := &AuthServer{
		config:         config,
		authService:    authService,
		userService:    userService,
		userCollection: userCollection,
	}

	return authServer, nil
}
