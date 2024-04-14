package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/acd19ml/EventCOM/controllers"
	"github.com/acd19ml/EventCOM/middleware"
	"github.com/acd19ml/EventCOM/services"
)

type DateRouteController struct {
	dateController controllers.DateController
}

func NewDateControllerRoute(dateController controllers.DateController) DateRouteController {
	return DateRouteController{dateController}
}

func (r *DateRouteController) DateRoute(rg *gin.RouterGroup, userService services.UserService) {
	router := rg.Group("/dates")
	router.GET("/", r.dateController.FindDates)
	router.GET("/:dateId", r.dateController.FindDateById)
	router.Use(middleware.DeserializeUser(userService))
	router.POST("/", r.dateController.CreateDate)
	router.PATCH("/:dateId", r.dateController.UpdateDate)
	router.DELETE("/:dateId", r.dateController.DeleteDate)
}
