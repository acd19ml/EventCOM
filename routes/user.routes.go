package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/acd19ml/EventCOM/controllers"
	"github.com/acd19ml/EventCOM/middleware"
	"github.com/acd19ml/EventCOM/services"
)

type UserRouteController struct {
	userController controllers.UserController
}

func NewRouteUserController(userController controllers.UserController) UserRouteController {
	return UserRouteController{userController}
}

func (uc *UserRouteController) UserRoute(rg *gin.RouterGroup, userService services.UserService) {

	router := rg.Group("users")
	router.Use(middleware.DeserializeUser(userService))
	router.GET("/me", uc.userController.GetMe)
}
