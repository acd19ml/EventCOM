package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/acd19ml/EventCOM/controllers"
	"github.com/acd19ml/EventCOM/middleware"
	"github.com/acd19ml/EventCOM/services"
)

type AttendeeRouteController struct {
	attendeeController controllers.AttendeeController
}

func NewAttendeeControllerRoute(attendeeController controllers.AttendeeController) AttendeeRouteController {
	return AttendeeRouteController{attendeeController}
}

func (r *AttendeeRouteController) AttendeeRoute(rg *gin.RouterGroup, userService services.UserService) {
	router := rg.Group("/attendees")
	router.POST("/", r.attendeeController.CreateAttendee)
	router.Use(middleware.DeserializeUser(userService))
	router.GET("/", r.attendeeController.FindAttendees)
	router.GET("/:attendeeId", r.attendeeController.FindAttendeeById)
	router.PATCH("/:attendeeId", r.attendeeController.UpdateAttendee)
	router.DELETE("/:attendeeId", r.attendeeController.DeleteAttendee)
}
