package services

import (
	"github.com/acd19ml/EventCOM/models"
	// "go.mongodb.org/mongo-driver/bson/primitive"
)

type PostService interface {
	CreatePost(*models.CreatePostRequest) (*models.DBPost, error)
	UpdatePost(string, *models.UpdatePost) (*models.DBPost, error)
	FindPostById(string) (*models.DBPost, error)
	// FindPosts(userID primitive.ObjectID, page int, limit int) ([]*models.DBPost, error)
	FindPosts(page int, limit int) ([]*models.DBPost, error)
	DeletePost(string) error
	UpdateTodos(postId string, todo models.Todo) error
}
