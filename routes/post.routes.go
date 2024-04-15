package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/acd19ml/EventCOM/controllers"
	"github.com/acd19ml/EventCOM/middleware"
	"github.com/acd19ml/EventCOM/services"
)

type PostRouteController struct {
	postController controllers.PostController
}

func NewPostControllerRoute(postController controllers.PostController) PostRouteController {
	return PostRouteController{postController}
}

func (r *PostRouteController) PostRoute(rg *gin.RouterGroup, userService services.UserService) {
	router := rg.Group("/posts")
	router.POST("/", r.postController.CreatePost)
	router.GET("/:postId", r.postController.FindPostById)	
	router.Use(middleware.DeserializeUser(userService))

	router.POST("/send-email", r.postController.SendEmailToGroup)

	router.GET("/", r.postController.FindPosts)
	router.PATCH("/:postId", r.postController.UpdatePost)
	router.PATCH("/:postId/todos", r.postController.UpdateTodos)
	router.DELETE("/:postId", r.postController.DeletePost)
}
